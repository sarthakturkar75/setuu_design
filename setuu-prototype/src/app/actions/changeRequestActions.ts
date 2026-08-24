"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createSystemNotification } from "./notificationActions";
import { verifyRole } from "./authUtils";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function createChangeRequest(formData: FormData) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  // SECURE: Get the actual logged-in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const project_id = formData.get("project_id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const cost_impact = parseFloat(formData.get("cost_impact") as string);
  const time_impact_days = parseInt(formData.get("time_impact_days") as string, 10);
  const status = formData.get("status") as string || "Pending";
  const { count } = await supabase.from('change_requests').select('*', { count: 'exact', head: true });
  const display_id = 'CR-' + String((count || 0) + 1).padStart(4, '0');

  const { error } = await supabase.from("change_requests").insert({
    project_id,
    title,
    description,
    cost_impact: isNaN(cost_impact) ? 0 : cost_impact,
    time_impact_days: isNaN(time_impact_days) ? 0 : time_impact_days,
    status: status,
    created_by: user.id, // Assigned securely
    display_id: display_id
  });

  if (error) return { success: false, error: error.message };

  // Notify stakeholders
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: stakeholders } = await adminSupabase.from("user_actor").select("id").in("role", ["admin", "client", "pm"]);
  if (stakeholders) {
    const userIds = stakeholders.map(s => s.id).filter(id => id !== user.id);
    if (userIds.length > 0) {
      const creatorEmail = user.email || "Someone";
      const costStr = cost_impact > 0 ? ` with a $${cost_impact.toLocaleString()} cost impact` : "";
      await createSystemNotification(
        userIds,
        `New Change Request: ${title}`,
        `${creatorEmail} requested a change${costStr}. This adds ${time_impact_days} days to the schedule.`,
        "update",
        project_id
      );
    }
  }

  // SECURE: Clear all relevant caches
  revalidatePath(`/pm/projects/${project_id}/changes`);
  revalidatePath(`/pm/projects/${project_id}`);
  revalidatePath(`/admin/projects/${project_id}/changes`);
  revalidatePath("/client/approvals");

  return { success: true };
}

export async function approveChangeRequest(id: string, projectId: string) {
  const user = await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("change_requests")
    .update({ status: "Approved", approved_by: user.id })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/changes`);
  revalidatePath(`/pm/projects/${projectId}/changes`);
  revalidatePath(`/admin/projects/${projectId}/changes`);
  revalidatePath("/client/approvals");
  return { success: true };
}

export async function rejectChangeRequest(id: string, projectId: string, reason: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("change_requests")
    .update({ status: "Rejected" })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/changes`);
  revalidatePath(`/pm/projects/${projectId}/changes`);
  revalidatePath(`/admin/projects/${projectId}/changes`);
  revalidatePath("/client/approvals");
  return { success: true };
}

export async function getChangeRequests(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("change_requests").select("*, project:projects!change_requests_project_id_fkey(name)").order('created_at', { ascending: false });
  if (projectId) query = query.eq("project_id", projectId);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(cr => ({
    ...cr,
    project_name: cr.project && typeof cr.project === 'object' && !Array.isArray(cr.project)
      ? (cr.project as any).name
      : "Unknown Project"
  }));
}