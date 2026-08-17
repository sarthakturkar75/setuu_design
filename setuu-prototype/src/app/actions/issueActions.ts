"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getIssues(projectId: string, filters?: { severity?: string }) {
  const supabase = await createClient();
  let query = supabase.from("project_issues").select("*").eq("project_id", projectId);
  
  if (filters?.severity) query = query.eq("severity", filters.severity);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createIssue(projectId: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_issues")
    .insert({
      project_id: projectId,
      ...data,
      status: "Open",
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/projects/${projectId}/issues`);
  return { success: true };
}

export async function updateIssueStatus(id: string, status: string) {
  const supabase = await createClient();
  const updateData: any = { status };
  if (status === "Resolved" || status === "Closed") {
    updateData.resolved_at = new Date().toISOString();
  }
  
  const { error } = await supabase
    .from("project_issues")
    .update(updateData)
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}

export async function escalateIssue(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_issues")
    .update({ severity: "Critical" })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}
