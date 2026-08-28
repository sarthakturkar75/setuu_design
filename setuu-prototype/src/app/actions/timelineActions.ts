"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

// ----------------------------------------------------
// Core Schedule & Task CRUD
// ----------------------------------------------------

export async function getTimelineData(projectId: string) {
  const supabase = await createClient();

  // FETCH FROM TASKS NOW (Not Milestones)
  const [tasksRes, dependenciesRes] = await Promise.all([
    supabase.from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("planned_start_date", { ascending: true }),
    supabase.from("timeline_dependencies")
      .select("*, predecessor:tasks!timeline_dependencies_predecessor_id_fkey(*)")
  ]);

  let validDependencies = dependenciesRes.data || [];
  if (tasksRes.data && validDependencies.length > 0) {
    const validIds = new Set(tasksRes.data.map(t => t.id));
    validDependencies = validDependencies.filter(d => validIds.has(d.successor_id));
  }

  return {
    tasks: tasksRes.data || [],
    dependencies: validDependencies
  };
}

export async function createTask(projectId: string, taskData: any) {
  // Enforce security: Only PMs and Admins can create base schedule blocks
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Calculate planned_finish_date dynamically if start and duration exist
  let finishDate = null;
  if (taskData.planned_start_date && taskData.duration_days) {
    const start = new Date(taskData.planned_start_date);
    start.setDate(start.getDate() + taskData.duration_days);
    finishDate = start.toISOString().split('T')[0];
  }

  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    created_by: user?.id,
    display_id: taskData.display_id || null,
    title: taskData.title,
    department: taskData.department || 'General',
    planned_start_date: taskData.planned_start_date || null,
    planned_finish_date: finishDate,
    duration_days: taskData.duration_days || null,
    priority: (taskData.priority || 'medium').toLowerCase(), // Normalized to lowercase
    status: 'pending',
    planned_percent_complete: 0,
    actual_percent_complete: 0,
    blockers: []
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/pm/projects/${projectId}/timeline`);
  revalidatePath(`/admin/projects/${projectId}/timeline`);
  return { success: true };
}

export async function updateTaskDates(taskId: string, startDateStr: string, endDateStr: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  // Calculate new duration
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const { error } = await supabase
    .from("tasks")
    .update({
      planned_start_date: startDateStr,
      planned_finish_date: endDateStr,
      duration_days: durationDays
    })
    .eq("id", taskId);

  if (error) throw new Error("Failed to update task dates: " + error.message);

  // We leave the recursive downstream shift to the timelineLeveling.ts script 
  // which the PM can trigger manually via the Auto-Level button.

  return { success: true };
}

export async function setScheduleBaseline(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  // Fetch current tasks
  const { data: tasks } = await supabase.from("tasks").select("id, planned_start_date, planned_finish_date, actual_start_date").eq("project_id", projectId);
  if (!tasks) return { success: false };

  // Set the "Actual" start date to lock in the baseline
  for (const t of tasks) {
    if (!t.actual_start_date && t.planned_start_date) {
      await supabase.from("tasks").update({
        actual_start_date: t.planned_start_date // Locks baseline
      }).eq("id", t.id);
    }
  }

  revalidatePath(`/pm/projects/${projectId}/timeline`);
  return { success: true };
}

// ----------------------------------------------------
// Telemetry & Weather Integration
// ----------------------------------------------------

export async function calculateWeatherDelays(projectId: string) {
  const supabase = await createClient();

  // 1. Fetch weather logs to check for consecutive heavy rain
  const { data: weatherLogs } = await supabase
    .from("weather_logs")
    .select("*")
    .eq("project_id", projectId)
    .order("log_date", { ascending: false })
    .limit(3);

  if (weatherLogs && weatherLogs.length === 3) {
    const consecutiveRain = weatherLogs.every(log => (log.precipitation_mm || 0) > 15);

    if (consecutiveRain) {
      // 2. Identify exterior tasks from the new tasks schema
      // (Assuming tasks that belong to structural/exterior departments)
      const { data: exteriorTasks } = await supabase
        .from("tasks")
        .select("id, title, planned_finish_date")
        .eq("project_id", projectId)
        .in("department", ["Mechanical", "General"])
        .eq("status", "in_progress");

      if (exteriorTasks && exteriorTasks.length > 0) {
        return {
          delayDetected: true,
          recommendedShiftDays: 3,
          affectedTasks: exteriorTasks
        };
      }
    }
  }
  return { delayDetected: false, affectedTasks: [] };
}

export async function checkResourceAllocation(projectId: string) {
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, assignee_id, status")
    .eq("project_id", projectId)
    .in("status", ["pending", "in_progress"]);

  const allocationMap: Record<string, { count: number, tasks: any[] }> = {};

  (tasks || []).forEach(t => {
    if (t.assignee_id) {
      if (!allocationMap[t.assignee_id]) {
        allocationMap[t.assignee_id] = { count: 0, tasks: [] };
      }
      allocationMap[t.assignee_id].count += 1;
      allocationMap[t.assignee_id].tasks.push(t);
    }
  });

  // Identify any assignee with more than 3 simultaneous active tasks
  const conflicts = Object.keys(allocationMap)
    .filter(k => allocationMap[k].count > 3)
    .map(k => ({
      assigneeId: k,
      ...allocationMap[k]
    }));

  return conflicts;
}

// ----------------------------------------------------
// Scenarios (What-if Planning)
// ----------------------------------------------------

export async function cloneTimelineToScenario(projectId: string, scenarioName: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  const { data: tasks } = await supabase.from("tasks").select("*").eq("project_id", projectId);

  const { data: scenario, error: scenarioError } = await supabase
    .from("timeline_scenarios")
    .insert({ project_id: projectId, name: scenarioName, payload: tasks })
    .select("id")
    .single();

  if (scenarioError || !scenario) throw new Error("Failed to create scenario");

  return { success: true, scenarioId: scenario.id };
}

export async function applyScenario(scenarioId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  const { data: scenario, error } = await supabase
    .from("timeline_scenarios")
    .select("payload, project_id")
    .eq("id", scenarioId)
    .single();

  if (error || !scenario || !scenario.payload) {
    throw new Error("Failed to load scenario payload");
  }

  const tasks = scenario.payload as any[];
  for (const t of tasks) {
    await supabase.from("tasks").update({
      planned_start_date: t.planned_start_date,
      planned_finish_date: t.planned_finish_date,
      duration_days: t.duration_days
    }).eq("id", t.id);
  }

  return { success: true };
}
export async function getAssignedTasks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*, project:projects(name)")
    .eq("assignee_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return tasks;
}
