"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

export async function getDrawings(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("drawing_versions").select("*, project:projects!drawing_versions_project_id_fkey(name)");
  
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  
  query = query.order("version_number", { ascending: false });
    
  const { data, error } = await query;
  if (error) throw error;
  
  return data.map(drawing => ({
    ...drawing,
    project_name: drawing.project && typeof drawing.project === 'object' && !Array.isArray(drawing.project)
      ? (drawing.project as any).name
      : null
  }));
}

export async function uploadDrawingVersion(drawingId: string, formData: FormData) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const project_id = formData.get("project_id") as string;
  const file = formData.get("file") as File;
  const uploaded_by = formData.get("uploaded_by") as string;
  let url = formData.get("url") as string;
  
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${project_id}/${uniqueFileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(filePath, file);
      
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('drawings')
        .getPublicUrl(filePath);
      url = publicUrl;
    }
  }
  
  // Get latest version number
  const { data: latest } = await supabase
    .from("drawing_versions")
    .select("version_number")
    .eq("drawing_id", drawingId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();
    
  const nextVersion = latest ? latest.version_number + 1 : 1;
  
  const { error } = await supabase.from("drawing_versions").insert({
    project_id,
    drawing_id: drawingId,
    drawing_name: (formData.get("drawing_name") as string) || "Untitled Drawing",
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
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { data: v1, error: e1 } = await supabase.from("drawing_versions").select("*").eq("id", v1Id).single();
  const { data: v2, error: e2 } = await supabase.from("drawing_versions").select("*").eq("id", v2Id).single();
  
  if (e1 || e2) return { success: false, error: "Failed to load drawing versions" };
  
  return {
    success: true,
    data: { v1, v2, diff_ready: true }
  };
}

export async function deleteDrawing(drawingId: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { data: drawing, error: fetchError } = await supabase.from("drawing_versions").select("project_id").eq("id", drawingId).single();
  
  if (fetchError) return { success: false, error: fetchError.message };

  const { error } = await supabase.from("drawing_versions").delete().eq("id", drawingId);
  if (error) return { success: false, error: error.message };
  
  if (drawing?.project_id) {
    revalidatePath(`/pm/projects/${drawing.project_id}/drawings`);
    revalidatePath(`/admin/projects/${drawing.project_id}/drawings`);
  }
  
  return { success: true };
}

export async function updateDrawing(drawingId: string, updates: any) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { data: drawing, error: fetchError } = await supabase.from("drawing_versions").select("project_id").eq("id", drawingId).single();
  
  if (fetchError) return { success: false, error: fetchError.message };

  const { error } = await supabase.from("drawing_versions").update(updates).eq("id", drawingId);
  if (error) return { success: false, error: error.message };
  
  if (drawing?.project_id) {
    revalidatePath(`/pm/projects/${drawing.project_id}/drawings`);
    revalidatePath(`/admin/projects/${drawing.project_id}/drawings`);
  }
  
  return { success: true };
}

