"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMaterials(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("project_materials").select("*, project:projects!project_materials_project_id_fkey(name)");
  
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
    
  const { data, error } = await query;
  if (error) throw error;
  
  return data.map(material => ({
    ...material,
    project_name: material.project && typeof material.project === 'object' && !Array.isArray(material.project)
      ? (material.project as any).name
      : null
  }));
}

export async function createMaterial(projectId: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_materials")
    .insert({
      project_id: projectId,
      ...data,
      status: "Ordered",
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/projects/${projectId}/materials`);
  return { success: true };
}

export async function updateMaterialStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_materials")
    .update({ status })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}

export async function receiveMaterial(id: string, proofData: any) {
  const supabase = await createClient();
  // We would upload proof photos, etc.
  const { error } = await supabase
    .from("project_materials")
    .update({ 
      status: "Delivered", 
      actual_delivery: new Date().toISOString(),
      tracking_timeline: proofData 
    })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}
