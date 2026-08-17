"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getDrawings(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("drawing_versions")
    .select("*")
    .eq("project_id", projectId)
    .order("version_number", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function uploadDrawingVersion(drawingId: string, formData: FormData) {
  const supabase = await createClient();
  const project_id = formData.get("project_id") as string;
  const url = formData.get("url") as string;
  const uploaded_by = formData.get("uploaded_by") as string;
  
  // Get latest version number
  const { data: latest } = await supabase
    .from("drawing_versions")
    .select("version_number")
    .eq("display_id", drawingId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();
    
  const nextVersion = latest ? latest.version_number + 1 : 1;
  
  const { error } = await supabase.from("drawing_versions").insert({
    project_id,
    display_id: drawingId,
    file_url: url,
    uploaded_by,
    version_number: nextVersion,
    status: "Active",
  });
  
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/drawings`);
  return { success: true };
}

export async function compareDrawingVersions(v1Id: string, v2Id: string) {
  const supabase = await createClient();
  const { data: v1, error: e1 } = await supabase.from("drawing_versions").select("*").eq("id", v1Id).single();
  const { data: v2, error: e2 } = await supabase.from("drawing_versions").select("*").eq("id", v2Id).single();
  
  if (e1 || e2) return { success: false, error: "Failed to load drawing versions" };
  
  return {
    success: true,
    data: { v1, v2, diff_ready: true }
  };
}
