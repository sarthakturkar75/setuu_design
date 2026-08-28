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

  // Fetch real Overdue Tasks (Updated to use tasks and planned_finish_date)
  const today = new Date().toISOString().split('T')[0];
  const { data: overdueTasks } = await supabase
    .from("tasks")
    .select("id, title, planned_finish_date")
    .eq("project_id", projectId)
    .neq("status", "Completed") // Assuming status mapped from Excel
    .lt("planned_finish_date", today);

  if (overdueTasks && overdueTasks.length > 0) {
    items.push({
      id: 'tasks-overdue',
      title: `${overdueTasks.length} Task(s) have passed their planned finish date`,
      type: 'overdue',
      priority: 'high',
      moduleUrl: `/admin/projects/${projectId}/timeline`,
      timestamp: 'Immediate Action'
    });
  }

  // Fetch real Critical Issues
  const { data: issues } = await supabase
    .from("project_issues")
    .select("id, title, severity")
    .eq("project_id", projectId)
    .eq("status", "Open");

  const critical = (issues || []).filter(i =>
    i.severity === 'Critical' || i.severity === 'High'
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

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
export async function getProjectEVMMetrics(projectId: string) {
  const supabase = await createClient();

  // Fetch all tasks with EVM metadata
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, duration_days, planned_percent_complete, actual_percent_complete, delay_days")
    .eq("project_id", projectId);

  if (error) throw new Error(error.message);

  const defaultMetrics = {
    overallCompletion: 0,
    plannedCompletion: 0,
    scheduleVariance: 0,
    delayedTasksCount: 0,
    totalTasks: 0
  };

  if (!tasks || tasks.length === 0) return defaultMetrics;

  let totalWeight = 0;
  let earnedValue = 0; // The actual percent complete weighted by duration
  let plannedValue = 0; // The planned percent complete weighted by duration
  let delayedTasksCount = 0;

  for (const task of tasks) {
    // Weight each task's impact by its duration (1 day = 1 unit of weight)
    const weight = task.duration_days || 1;
    totalWeight += weight;

    // EV = % Complete * Task Weight
    earnedValue += ((task.actual_percent_complete || 0) / 100) * weight;

    // PV = Planned % * Task Weight
    plannedValue += ((task.planned_percent_complete || 0) / 100) * weight;

    // Utilize the auto-calculated database column
    if (task.delay_days && task.delay_days > 0) {
      delayedTasksCount++;
    }
  }

  const overallCompletion = totalWeight > 0 ? (earnedValue / totalWeight) * 100 : 0;
  const plannedCompletion = totalWeight > 0 ? (plannedValue / totalWeight) * 100 : 0;

  // Schedule Variance (SV) = EV - PV
  // Positive = Ahead of schedule. Negative = Behind schedule.
  const scheduleVariance = overallCompletion - plannedCompletion;

  return {
    overallCompletion: Math.round(overallCompletion * 100) / 100,
    plannedCompletion: Math.round(plannedCompletion * 100) / 100,
    scheduleVariance: Math.round(scheduleVariance * 100) / 100,
    delayedTasksCount,
    totalTasks: tasks.length
  };
}