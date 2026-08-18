"use server";

import { createClient } from "@/lib/supabase/server";

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
