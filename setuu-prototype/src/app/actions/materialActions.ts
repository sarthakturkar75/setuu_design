"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

export async function getMaterials(projectId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("project_materials")
    .select("*, project:projects!project_materials_project_id_fkey(name)")
    .order('created_at', { ascending: false });

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

export async function createMaterial(formData: FormData) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();

  const project_id = formData.get("project_id") as string;
  const item_name = formData.get("item_name") as string;
  const quantity = formData.get("quantity") as string;
  const po_number = formData.get("po_number") as string;
    
  const { error } = await supabase
    .from("project_materials")
    .insert({
      project_id,
      item_name,
      quantity: parseInt(quantity || "0", 10),
      po_number,
      
      
      status: "Ordered",
    });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/pm/projects/${project_id}/materials`);
  revalidatePath(`/admin/projects/${project_id}/materials`);
  revalidatePath(`/pm/materials`);
  return { success: true };
}

export async function updateMaterialStatus(id: string, projectId: string, status: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_materials")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/pm/projects/${projectId}/materials`);
  revalidatePath(`/admin/projects/${projectId}/materials`);
  revalidatePath(`/pm/materials`);
  return { success: true };
}

export async function receiveMaterial(id: string, projectId: string, proofData: any) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_materials")
    .update({
      status: "Delivered",
      actual_delivery: new Date().toISOString(),
      tracking_timeline: proofData
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/pm/projects/${projectId}/materials`);
  revalidatePath(`/admin/projects/${projectId}/materials`);
  revalidatePath(`/pm/materials`);
  return { success: true };
}
export async function deleteMaterial(materialId: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { data: material, error: fetchError } = await supabase.from("project_materials").select("project_id").eq("id", materialId).single();
  
  if (fetchError) return { success: false, error: fetchError.message };

  const { error } = await supabase.from("project_materials").delete().eq("id", materialId);
  if (error) return { success: false, error: error.message };
  
  if (material?.project_id) {
    revalidatePath(`/pm/projects/${material.project_id}/materials`);
    revalidatePath(`/admin/projects/${material.project_id}/materials`);
  }
  
  return { success: true };
}

