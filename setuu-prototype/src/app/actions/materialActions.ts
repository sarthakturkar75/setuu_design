"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  const supabase = await createClient();

  const project_id = formData.get("project_id") as string;
  const name = formData.get("name") as string;
  const po_number = formData.get("po_number") as string;
  const supplier = formData.get("supplier") as string;
  const expected_delivery = formData.get("expected_delivery") as string;

  const { error } = await supabase
    .from("project_materials")
    .insert({
      project_id,
      name,
      po_number,
      supplier,
      expected_delivery: expected_delivery || null,
      status: "Ordered",
    });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/pm/projects/${project_id}/materials`);
  revalidatePath(`/pm/materials`);
  return { success: true };
}

export async function updateMaterialStatus(id: string, projectId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_materials")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/pm/projects/${projectId}/materials`);
  revalidatePath(`/pm/materials`);
  return { success: true };
}

export async function receiveMaterial(id: string, projectId: string, proofData: any) {
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
  revalidatePath(`/pm/materials`);
  return { success: true };
}