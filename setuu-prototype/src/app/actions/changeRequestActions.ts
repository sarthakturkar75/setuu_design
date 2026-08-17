"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createChangeRequest(formData: FormData) {
  const supabase = await createClient();
  const project_id = formData.get("project_id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const cost_impact = parseFloat(formData.get("cost_impact") as string);
  const time_impact_days = parseInt(formData.get("time_impact_days") as string, 10);
  
  const { error } = await supabase.from("change_requests").insert({
    project_id,
    title,
    description,
    cost_impact: isNaN(cost_impact) ? 0 : cost_impact,
    time_impact_days: isNaN(time_impact_days) ? 0 : time_impact_days,
    status: "Pending",
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/projects/${project_id}/changes`);
  return { success: true };
}

export async function approveChangeRequest(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("change_requests")
    .update({ status: "Approved" })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/changes");
  return { success: true };
}

export async function rejectChangeRequest(id: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("change_requests")
    .update({ status: "Rejected", description: reason }) // Storing reason in description temporarily or ideally a new column
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/changes");
  return { success: true };
}

export async function getChangeRequests(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("change_requests").select("*");
  if (projectId) query = query.eq("project_id", projectId);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
