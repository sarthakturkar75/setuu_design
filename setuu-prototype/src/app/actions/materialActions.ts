"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMaterials(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_materials")
    .select("*")
    .eq("project_id", projectId);
    
  if (error) throw error;
  return data;
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
