"use server";

import { createClient } from "@/lib/supabase/server";
import { parseStringPromise } from "xml2js";
import { revalidatePath } from "next/cache";

export async function getTimelineData(projectId: string) {
  const supabase = await createClient();
  
  const [milestonesRes, dependenciesRes] = await Promise.all([
    supabase.from("milestones").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
    supabase.from("timeline_dependencies").select("*") // Assuming this gets joined or filtered client side, or we filter by projectId if available
  ]);

  // For dependencies, we need to filter by milestones that belong to this project
  let validDependencies = dependenciesRes.data || [];
  if (milestonesRes.data && validDependencies.length > 0) {
    const validIds = new Set(milestonesRes.data.map(m => m.id));
    validDependencies = validDependencies.filter(d => validIds.has(d.successor_id));
  }

  return {
    milestones: milestonesRes.data || [],
    dependencies: validDependencies
  };
}

export async function updateMilestoneDates(milestoneId: string, startDate: Date, endDate: Date) {
  const supabase = await createClient();
  
  // 1. Update the milestone itself
  const { error } = await supabase
    .from("milestones")
    .update({ 
       // If start date doesn't exist on your schema natively, we'll map target_date as end_date
       // and created_at/baseline_start_date as start for now, OR we need to add start_date.
       // The prompt says updateMilestoneDates(start, end). Let's use custom_data for start_date if it's missing,
       // or assume custom_data->>'start_date' and target_date = end.
       target_date: endDate.toISOString().split('T')[0],
       custom_data: { start_date: startDate.toISOString().split('T')[0] }
    })
    .eq("id", milestoneId);

  if (error) throw new Error("Failed to update milestone dates: " + error.message);

  // 2. Recursive downstream shift (Critical Path Method logic)
  // Fetch dependencies where this milestone is the predecessor
  const { data: dependents } = await supabase
    .from("timeline_dependencies")
    .select("successor_id, dependency_type, lag_days")
    .eq("predecessor_id", milestoneId);

  if (dependents && dependents.length > 0) {
    for (const dep of dependents) {
      // Fetch successor current dates
      const { data: successor } = await supabase
        .from("milestones")
        .select("id, target_date, custom_data")
        .eq("id", dep.successor_id)
        .single();
        
      if (successor) {
         // Logic for Finish-to-Start (FS)
         if (dep.dependency_type === 'FS') {
            const currentStartStr = (successor.custom_data as any)?.start_date || new Date().toISOString();
            const currentEndStr = successor.target_date;
            
            const currentStart = new Date(currentStartStr);
            const currentEnd = new Date(currentEndStr);
            const duration = currentEnd.getTime() - currentStart.getTime();

            // New Start is Predecessor End + Lag
            const newStart = new Date(endDate);
            newStart.setDate(newStart.getDate() + (dep.lag_days || 0));
            
            const newEnd = new Date(newStart.getTime() + duration);
            
            // Recursively update
            await updateMilestoneDates(successor.id, newStart, newEnd);
         }
      }
    }
  }

  return { success: true };
}

export async function setScheduleBaseline(projectId: string) {
  const supabase = await createClient();
  const { data: milestones } = await supabase.from("milestones").select("id, target_date, custom_data").eq("project_id", projectId);
  
  if (!milestones) return { success: false };

  for (const m of milestones) {
    const startStr = (m.custom_data as any)?.start_date || new Date().toISOString().split('T')[0];
    await supabase.from("milestones").update({
      baseline_start_date: startStr,
      baseline_end_date: m.target_date
    }).eq("id", m.id);
  }

  revalidatePath(`/admin/projects/${projectId}/timeline`);
  return { success: true };
}

export async function importProjectSchedule(projectId: string, xmlString: string) {
  const supabase = await createClient();
  try {
    const parsed = await parseStringPromise(xmlString);
    // Typical MS Project XML structure: Project.Tasks[0].Task
    const tasks = parsed.Project?.Tasks?.[0]?.Task || [];
    
    // Clear existing (Optional, or just append)
    // For MVP append
    
    for (const task of tasks) {
       if (!task.Name || !task.Name[0]) continue;
       const name = task.Name[0];
       const start = task.Start ? task.Start[0].split('T')[0] : new Date().toISOString().split('T')[0];
       const finish = task.Finish ? task.Finish[0].split('T')[0] : start;
       
       await supabase.from("milestones").insert({
         project_id: projectId,
         title: name,
         target_date: finish,
         custom_data: { start_date: start },
         wbs_code: task.WBS ? task.WBS[0] : null
       });
    }
    
    revalidatePath(`/admin/projects/${projectId}/timeline`);
    return { success: true };
  } catch (error: any) {
    throw new Error("Failed to parse schedule file: " + error.message);
  }
}

// ----------------------------------------------------
// Weather Automation & Resource Leveling
// ----------------------------------------------------

export async function calculateWeatherDelays(projectId: string) {
  const supabase = await createClient();
  
  // 1. Fetch weather logs to check for consecutive heavy rain
  const { data: weatherLogs } = await supabase
    .from("weather_logs")
    .select("*")
    .eq("project_id", projectId)
    .order("date", { ascending: false })
    .limit(3);
    
  if (weatherLogs && weatherLogs.length === 3) {
    const consecutiveRain = weatherLogs.every(log => log.precipitation_mm > 15);
    if (consecutiveRain) {
      // 2. Identify exterior tasks
      const { data: exteriorMilestones } = await supabase
        .from("milestones")
        .select("id, title, target_date, custom_data")
        .eq("project_id", projectId)
        .eq("is_exterior", true);
        
      if (exteriorMilestones && exteriorMilestones.length > 0) {
        // We wouldn't shift silently. We return this to the PM for approval.
        return {
          delayDetected: true,
          recommendedShiftDays: 3,
          affectedMilestones: exteriorMilestones
        };
      }
    }
  }
  return { delayDetected: false, affectedMilestones: [] };
}

export async function checkResourceAllocation(projectId: string) {
  const supabase = await createClient();
  
  // 1. Get all assigned tasks
  // For the prototype, we check 'milestones' which might not have assignee at milestone level.
  // We'll simulate fetching tasks with user assignments.
  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, title, target_date, custom_data")
    .eq("project_id", projectId);
    
  // Since we don't have a rigid milestone_assignees table yet, we'll parse custom_data
  const allocationMap: Record<string, { count: number, tasks: any[] }> = {};
  
  (milestones || []).forEach(m => {
     const assigneeId = (m.custom_data as any)?.assignee_id;
     if (assigneeId) {
        if (!allocationMap[assigneeId]) {
           allocationMap[assigneeId] = { count: 0, tasks: [] };
        }
        allocationMap[assigneeId].count += 1;
        allocationMap[assigneeId].tasks.push(m);
     }
  });

  const conflicts = Object.keys(allocationMap).filter(k => allocationMap[k].count > 1).map(k => ({
     assigneeId: k,
     ...allocationMap[k]
  }));

  return conflicts;
}

export async function cloneTimelineToScenario(projectId: string, scenarioName: string) {
  const supabase = await createClient();
  
  const { data: milestones } = await supabase.from("milestones").select("*").eq("project_id", projectId);
  
  const { data: scenario, error: scenarioError } = await supabase
    .from("timeline_scenarios")
    .insert({ project_id: projectId, name: scenarioName, payload: milestones })
    .select("id")
    .single();
    
  if (scenarioError || !scenario) throw new Error("Failed to create scenario");

  return { success: true, scenarioId: scenario.id };
}

export async function applyScenario(scenarioId: string) {
  const supabase = await createClient();
  
  // 1. Fetch scenario payload
  const { data: scenario, error } = await supabase
    .from("timeline_scenarios")
    .select("payload, project_id")
    .eq("id", scenarioId)
    .single();

  if (error || !scenario || !scenario.payload) {
    throw new Error("Failed to load scenario payload");
  }

  // 2. Overwrite actual milestones
  const milestones = scenario.payload as any[];
  for (const m of milestones) {
    await supabase.from("milestones").update({
      target_date: m.target_date,
      custom_data: m.custom_data
    }).eq("id", m.id);
  }

  return { success: true };
}
