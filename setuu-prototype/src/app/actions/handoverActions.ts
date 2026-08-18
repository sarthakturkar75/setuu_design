"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getHandovers(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("project_handovers").select("*, project:projects!project_handovers_project_id_fkey(name)");
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  const { data, error } = await query;
    
  if (error) throw error;
  
  return data.map(h => ({
    ...h,
    project_name: h.project && typeof h.project === 'object' && !Array.isArray(h.project) ? (h.project as any).name : "Unknown Project"
  }));
}

export async function createHandover(projectId: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_handovers")
    .insert({
      project_id: projectId,
      ...data,
      status: "Draft"
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/projects/${projectId}/handover`);
  return { success: true };
}

export async function updateHandoverChecklist(id: string, items: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_handovers")
    .update({ package_contents: items })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}

export async function requestSignature(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_handovers")
    .update({ status: "Pending Signature" })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/handovers`);
  return { success: true };
}
