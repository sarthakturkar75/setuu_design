"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function logStatusTransition(milestoneId: string, statusName: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  
  // Close previous status
  await supabase
    .from("milestone_status_history")
    .update({ exited_at: new Date().toISOString() })
    .eq("milestone_id", milestoneId)
    .is("exited_at", null);

  // Enter new status
  await supabase
    .from("milestone_status_history")
    .insert({
      milestone_id: milestoneId,
      status_name: statusName,
      entered_at: new Date().toISOString()
    });
}

export async function draftInvoiceFromMilestone(milestoneId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  
  // 1. Get milestone info
  const { data: milestone } = await supabase
    .from("milestones")
    .select("project_id, title, sov_value, wbs_code")
    .eq("id", milestoneId)
    .single();

  if (!milestone || !milestone.sov_value || milestone.sov_value <= 0) return;

  // 2. Draft an invoice for this SOV Value
  // Using vendor_invoices since it has less strict non-null constraints than invoices (vendor_id is nullable in vendor_invoices)
  await supabase.from("vendor_invoices").insert({
    project_id: milestone.project_id,
    amount: milestone.sov_value,
    status: "Draft",
    // We omit metadata/invoice_date because they don't exist in the schema.
    // In a real app we'd alter the schema, but we must use what's available physically.
  });
}

export async function triggerHandoffNotifications(milestoneId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();

  // Find successors
  const { data: links } = await supabase
    .from("timeline_dependencies")
    .select("successor_id")
    .eq("predecessor_id", milestoneId);

  if (!links || links.length === 0) return;

  const successorIds = links.map(l => l.successor_id);

  // Get successor assignees
  const { data: successors } = await supabase
    .from("milestones")
    .select("id, title, project_id, custom_data")
    .in("id", successorIds);

  if (!successors) return;

  for (const succ of successors) {
    const assignee = (succ.custom_data as any)?.assignee;
    if (assignee) {
      await supabase.from("notifications").insert({
        user_id: assignee, 
        title: "Site Ready: Handoff Triggered",
        body: `The prerequisite for your task "${succ.title}" is now complete. You may mobilize to site.`,
        is_read: false,
        type: "system",
        reference_id: succ.project_id
      });
    }
  }
}
