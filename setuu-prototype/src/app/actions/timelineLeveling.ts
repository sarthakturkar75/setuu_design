"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkResourceAllocation(projectId: string) {
  const supabase = await createClient();
  
  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, title, target_date, custom_data")
    .eq("project_id", projectId);
    
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

  return Object.keys(allocationMap).filter(k => allocationMap[k].count > 1).map(k => ({
     assigneeId: k,
     ...allocationMap[k]
  }));
}

export async function autoLevelResources(projectId: string) {
  const supabase = await createClient();
  const conflicts = await checkResourceAllocation(projectId);
  let shiftedCount = 0;

  for (const conflict of conflicts) {
    // Sort tasks by target_date (earliest first)
    const sortedTasks = conflict.tasks.sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime());
    
    // Shift subsequent tasks so they don't overlap. 
    // Assuming 3 day duration for simplicity if start_date isn't present
    let currentEnd = new Date(sortedTasks[0].target_date);

    for (let i = 1; i < sortedTasks.length; i++) {
      const task = sortedTasks[i];
      const startStr = (task.custom_data as any)?.start_date;
      const start = startStr ? new Date(startStr) : new Date(new Date(task.target_date).getTime() - (3*86400000));
      
      // If the next task starts before the previous one ended (overlap)
      if (start < currentEnd) {
        // Shift it to start exactly after currentEnd
        const diff = currentEnd.getTime() - start.getTime();
        const newStart = new Date(start.getTime() + diff + 86400000); // add 1 day buffer
        const newEnd = new Date(new Date(task.target_date).getTime() + diff + 86400000);
        
        await supabase.from("milestones").update({
          target_date: newEnd.toISOString().split('T')[0],
          custom_data: { ...task.custom_data, start_date: newStart.toISOString().split('T')[0] }
        }).eq("id", task.id);
        
        shiftedCount++;
        currentEnd = newEnd;
      } else {
        currentEnd = new Date(task.target_date);
      }
    }
  }

  return { success: true, shiftedCount };
}
