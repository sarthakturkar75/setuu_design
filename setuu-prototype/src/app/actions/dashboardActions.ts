"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActionItem {
  id: string;
  title: string;
  type: 'approval' | 'overdue' | 'review';
  priority: 'high' | 'medium' | 'low';
  moduleUrl: string;
  timestamp: string;
}

export async function getActionItems(projectId: string): Promise<ActionItem[]> {
  const supabase = await createClient();
  const items: ActionItem[] = [];

  // Fetch real Pending Changes
  const { data: changes } = await supabase
    .from("change_requests")
    .select("id, title, status, created_at")
    .eq("project_id", projectId)
    .eq("status", "Pending Approval");

  if (changes && changes.length > 0) {
    items.push({
      id: `changes-pending`,
      title: `${changes.length} Change Request(s) require your signature/approval`,
      type: 'approval',
      priority: 'high',
      moduleUrl: `/admin/projects/${projectId}/changes`,
      timestamp: 'Action Required'
    });
  }

  // Fetch real Overdue Milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, title, target_date")
    .eq("project_id", projectId)
    .in("status_label", ["Overdue"]);

  if (milestones && milestones.length > 0) {
    items.push({
      id: 'milestones-overdue',
      title: `${milestones.length} Milestone(s) have passed their target date`,
      type: 'overdue',
      priority: 'high',
      moduleUrl: `/admin/projects/${projectId}/timeline`,
      timestamp: 'Immediate Action'
    });
  }

  // Fetch real Critical Issues
  const { data: issues } = await supabase
    .from("project_issues")
    .select("id, title, severity_level, severity")
    .eq("project_id", projectId)
    .eq("status", "Open");
    
  const critical = (issues || []).filter(i => 
    i.severity === 'Critical' || i.severity === 'High' || 
    i.severity_level === 'Critical' || i.severity_level === 'High'
  );

  if (critical.length > 0) {
    items.push({
      id: 'issues-critical',
      title: `${critical.length} Critical safety/quality issues are unresolved`,
      type: 'review',
      priority: 'high',
      moduleUrl: `/admin/projects/${projectId}/issues`,
      timestamp: 'High Priority'
    });
  }

  return items;
}

export async function saveDashboardLayout(layoutJson: any) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("user_actor")
    .update({ user_preferences: { dashboardLayout: layoutJson } })
    .eq("id", user.user.id);

  if (error) {
    console.error("Failed to save layout:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
