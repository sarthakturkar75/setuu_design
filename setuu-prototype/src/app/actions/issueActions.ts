"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getIssues(projectId?: string, filters?: { severity?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("project_issues")
    .select("*, assignee:user_actor!project_issues_assigned_to_fkey(display_name), project:projects!project_issues_project_id_fkey(name)")
    .order("created_at", { ascending: false }); // Best practice: newest issues first

  if (projectId) query = query.eq("project_id", projectId);
  if (filters?.severity) query = query.eq("severity", filters.severity);

  const { data, error } = await query;
  if (error) throw error;

  // Map joined assignee name for easy UI rendering
  return data.map(issue => ({
    ...issue,
    assignee_name: issue.assignee && typeof issue.assignee === 'object' && !Array.isArray(issue.assignee)
      ? (issue.assignee as any).display_name
      : null,
    project_name: issue.project && typeof issue.project === 'object' && !Array.isArray(issue.project)
      ? (issue.project as any).name
      : null
  }));
}

export async function createIssue(formData: FormData) {
  const supabase = await createClient();

  // 1. Securely get the authenticated user making the request
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized: You must be logged in to log an issue." };
  }

  // 2. Strictly extract only the allowed fields
  const project_id = formData.get("project_id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string;
  const type = formData.get("type") as string;

  const { error } = await supabase
    .from("project_issues")
    .insert({
      project_id,
      title,
      description,
      severity,
      type,
      status: "Open",
      created_by: user.id // Attach the user securely!
    });

  if (error) {
    console.error("Issue creation error:", error.message);
    return { success: false, error: error.message };
  }

  // 3. Clear cache for the issue list and project dashboard
  revalidatePath(`/pm/projects/${project_id}/issues`);
  revalidatePath(`/pm/projects/${project_id}`);
  return { success: true };
}

export async function updateIssueStatus(id: string, projectId: string, status: string) {
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

  revalidatePath(`/pm/projects/${projectId}/issues`);
  return { success: true };
}

export async function escalateIssue(id: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_issues")
    .update({ severity: "Critical" })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/pm/projects/${projectId}/issues`);
  return { success: true };
}