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
    .from("project_resources")
    .select("*, project:projects(name)");
  
  if (error) throw error;
  
  // Find resources with the same name across different projects
  const nameCounts = data.reduce((acc, res) => {
    acc[res.name] = (acc[res.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const conflicts = data.filter(res => nameCounts[res.name] > 1);

  return conflicts.map(res => ({
    ...res,
    project_name: res.project && typeof res.project === 'object' && !Array.isArray(res.project) ? (res.project as any).name : "Unknown Project"
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

export async function getGlobalResourceAnalytics() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project_resources").select("*, project:projects!project_resources_project_id_fkey(name)");
  if (error) throw error;
  
  // Group by project
  const projectAggregates: Record<string, { allocated: number, actual: number }> = {};
  let totalVariance = 0;
  
  data.forEach((r: any) => {
    const pName = r.project && typeof r.project === 'object' && !Array.isArray(r.project) ? (r.project as any).name : "Unknown Project";
    if (!projectAggregates[pName]) projectAggregates[pName] = { allocated: 0, actual: 0 };
    projectAggregates[pName].allocated += r.allocated_hours || 0;
    projectAggregates[pName].actual += r.actual_hours || 0;
    
    totalVariance += (r.actual_hours || 0) - (r.allocated_hours || 0);
  });
  
  const topProjects = Object.entries(projectAggregates).map(([name, stats]) => ({
    name,
    allocated: stats.allocated,
    actual: stats.actual
  })).sort((a, b) => b.allocated - a.allocated).slice(0, 5);

  const conflicts = data.filter((r: any) => (r.actual_hours || 0) > (r.allocated_hours || 0)).map((r: any) => ({
    id: r.id,
    project_name: r.project && typeof r.project === 'object' && !Array.isArray(r.project) ? (r.project as any).name : "Unknown Project",
    resource_name: r.name,
    type: r.resource_type,
    allocated: r.allocated_hours || 0,
    actual: r.actual_hours || 0,
    variance: (r.actual_hours || 0) - (r.allocated_hours || 0)
  }));
  
  return {
    topProjects,
    totalVariance,
    conflicts
  };
}

export async function reallocateResource(formData: FormData) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const resource_id = formData.get("resource_id") as string;
  const target_project_id = formData.get("target_project_id") as string;
  
  if (!resource_id || !target_project_id) return { success: false, error: "Missing fields" };
  
  const { error } = await supabase.from("project_resources").update({ project_id: target_project_id }).eq("id", resource_id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin/resources");
  revalidatePath("/pm/resources");
  return { success: true };
}

