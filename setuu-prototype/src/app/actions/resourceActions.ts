"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

export async function getProjectResources(filters?: { projectId?: string, type?: string }) {
  const supabase = await createClient();
  let query = supabase.from("project_resources").select("*, project:projects!project_resources_project_id_fkey(name)");
  
  if (filters?.projectId) query = query.eq("project_id", filters.projectId);
  if (filters?.type) query = query.eq("resource_type", filters.type);
  
  const { data, error } = await query;
  if (error) throw error;
  
  return data.map(res => ({
    ...res,
    project_name: res.project && typeof res.project === 'object' && !Array.isArray(res.project) ? (res.project as any).name : "Unknown Project"
  }));
}

export async function getResourceConflicts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_issues")
    .select("*, project:projects(name)");
  
  if (error) throw error;
  
  return data.map(issue => ({
    ...issue,
    project_name: issue.project && typeof issue.project === 'object' && !Array.isArray(issue.project) ? (issue.project as any).name : "Unknown Project"
  }));
}

export async function createResource(formData: FormData) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const project_id = formData.get("project_id") as string;
  const name = formData.get("name") as string;
  const resource_type = formData.get("resource_type") as string;
  const allocated_hours = parseInt(formData.get("allocated_hours") as string || "0", 10);

  const { error } = await supabase.from("project_resources").insert({
    project_id, name, resource_type, allocated_hours
  });
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/projects/${project_id}/team`);
  revalidatePath(`/pm/projects/${project_id}/team`);
  return { success: true };
}

export async function deleteResource(resourceId: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { data, error: fetchError } = await supabase.from("project_resources").select("project_id").eq("id", resourceId).single();
  if (fetchError) return { success: false, error: fetchError.message };
  const { error } = await supabase.from("project_resources").delete().eq("id", resourceId);
  if (error) return { success: false, error: error.message };
  if (data?.project_id) {
    revalidatePath(`/admin/projects/${data.project_id}/team`);
    revalidatePath(`/pm/projects/${data.project_id}/team`);
  }
  return { success: true };
}

