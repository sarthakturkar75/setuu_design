"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

// Utility to safely add days to a YYYY-MM-DD date string
function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// Replaces checkResourceAllocation and autoLevelResources
export async function levelProjectTimeline(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();

  // 1. Fetch all tasks for the project with the new Phase 1 temporal columns
  const { data: tasks, error: tasksErr } = await supabase
    .from("tasks")
    .select("id, planned_start_date, planned_finish_date, actual_start_date, actual_finish_date, duration_days")
    .eq("project_id", projectId);

  if (tasksErr) return { success: false, error: tasksErr.message };
  if (!tasks || tasks.length === 0) return { success: true, shiftedCount: 0, message: "No tasks to level." };

  const taskIds = tasks.map(t => t.id);

  // 2. Fetch all dependencies for these tasks
  const { data: dependencies, error: depsErr } = await supabase
    .from("timeline_dependencies")
    .select("predecessor_id, successor_id, dep_type, lag_days")
    .in("predecessor_id", taskIds);

  if (depsErr) return { success: false, error: depsErr.message };

  // 3. Build Adjacency List & In-Degree Map for Topological Sort
  const taskMap = new Map<string, any>(tasks.map(t => [t.id, { ...t }]));
  const successors = new Map<string, any[]>();
  const inDegree = new Map<string, number>();

  taskIds.forEach(id => {
    successors.set(id, []);
    inDegree.set(id, 0);
  });

  (dependencies || []).forEach(dep => {
    if (successors.has(dep.predecessor_id) && inDegree.has(dep.successor_id)) {
      successors.get(dep.predecessor_id)!.push(dep);
      inDegree.set(dep.successor_id, inDegree.get(dep.successor_id)! + 1);
    }
  });

  // 4. Initialize queue with tasks having no predecessors
  const queue: string[] = [];
  inDegree.forEach((degree, id) => {
    if (degree === 0) queue.push(id);
  });

  const updatesToCommit: any[] = [];
  let shiftedCount = 0;

  // 5. Traverse the Graph and Calculate Dates
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentTask = taskMap.get(currentId)!;
    const duration = currentTask.duration_days || 1;

    // Ensure current task has a planned_finish_date based on its start
    if (currentTask.planned_start_date) {
      currentTask.planned_finish_date = addDaysToDate(currentTask.planned_start_date, duration);
    }

    // Process all dependent tasks
    for (const dep of successors.get(currentId)!) {
      const succId = dep.successor_id;
      const succTask = taskMap.get(succId)!;
      const lag = dep.lag_days || 0;
      const succDuration = succTask.duration_days || 1;

      // BASELINE RULE: If predecessor has an actual date, use it. Otherwise, use planned.
      const predStart = currentTask.actual_start_date || currentTask.planned_start_date;
      const predFinish = currentTask.actual_finish_date || currentTask.planned_finish_date;

      let newSuccStart = succTask.planned_start_date;

      // Apply Dependency Logic (FS, SS, FF, SF)
      if (dep.dep_type === 'FS' && predFinish) {
        newSuccStart = addDaysToDate(predFinish, lag);
      } else if (dep.dep_type === 'SS' && predStart) {
        newSuccStart = addDaysToDate(predStart, lag);
      } else if (dep.dep_type === 'FF' && predFinish) {
        const newSuccFinish = addDaysToDate(predFinish, lag);
        newSuccStart = addDaysToDate(newSuccFinish, -succDuration);
      } else if (dep.dep_type === 'SF' && predStart) {
        const newSuccFinish = addDaysToDate(predStart, lag);
        newSuccStart = addDaysToDate(newSuccFinish, -succDuration);
      }

      // If the calculated start date pushes the task later than currently planned, update it.
      if (newSuccStart && (!succTask.planned_start_date || new Date(newSuccStart) > new Date(succTask.planned_start_date))) {
        succTask.planned_start_date = newSuccStart;
        succTask.planned_finish_date = addDaysToDate(newSuccStart, succDuration);
        shiftedCount++;
      }

      // Decrement in-degree and push to queue if 0
      inDegree.set(succId, inDegree.get(succId)! - 1);
      if (inDegree.get(succId) === 0) {
        queue.push(succId);
      }
    }

    // Stage updates for DB writing
    updatesToCommit.push({
      id: currentId,
      planned_start_date: currentTask.planned_start_date,
      planned_finish_date: currentTask.planned_finish_date
    });
  }

  // 6. Commit Updates back to PostgreSQL
  for (const update of updatesToCommit) {
    if (update.planned_start_date || update.planned_finish_date) {
      await supabase.from("tasks").update({
        planned_start_date: update.planned_start_date,
        planned_finish_date: update.planned_finish_date
      }).eq("id", update.id);
    }
  }

  revalidatePath(`/pm/projects/${projectId}/timeline`);
  revalidatePath(`/admin/projects/${projectId}/timeline`);
  return { success: true, shiftedCount, message: `Successfully leveled ${shiftedCount} tasks.` };
}