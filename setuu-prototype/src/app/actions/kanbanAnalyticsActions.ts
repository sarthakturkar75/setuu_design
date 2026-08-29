"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getCycleTimeAnalytics(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();

  // 1. Fetch all milestones for project
  const { data: milestones } = await supabase
    .from("milestones")
    .select("id")
    .eq("project_id", projectId);

  if (!milestones || milestones.length === 0) return { inProgressAvg: 0, reviewAvg: 0 };

  const milestoneIds = milestones.map(m => m.id);

  // 2. Fetch all status history for these milestones
  const { data: history } = await supabase
    .from("milestone_status_history")
    .select("status_name, entered_at, exited_at")
    .in("milestone_id", milestoneIds);

  if (!history || history.length === 0) return { inProgressAvg: 0, reviewAvg: 0 };

  let inProgressTotal = 0;
  let inProgressCount = 0;
  
  let reviewTotal = 0;
  let reviewCount = 0;

  for (const h of history) {
    if (h.exited_at && h.entered_at) {
      const ms = new Date(h.exited_at).getTime() - new Date(h.entered_at).getTime();
      const hours = ms / (1000 * 60 * 60);

      if (h.status_name === "in_progress") {
        inProgressTotal += hours;
        inProgressCount++;
      } else if (h.status_name === "review") {
        reviewTotal += hours;
        reviewCount++;
      }
    }
  }

  return {
    inProgressAvg: inProgressCount > 0 ? (inProgressTotal / inProgressCount).toFixed(1) : 0,
    reviewAvg: reviewCount > 0 ? (reviewTotal / reviewCount).toFixed(1) : 0
  };
}
