"use server";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

// Helpers for the various roles

export async function getEngineerProductivity(targetUserId: string, projectId?: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  
  // A robust implementation would strictly enforce the hierarchy here.
  // For the prototype, we assume UI or the route checks access.
  const supabase = await createClient();

  // Task Completion Rate
  let taskQuery = supabase.from("tasks").select("status, percent_complete, planned_finish_date, actual_finish_date").eq("assignee_id", targetUserId);
  if (projectId) taskQuery = taskQuery.eq("project_id", projectId);
  const { data: tasks } = await taskQuery;

  let completedTasks = 0;
  let onTimeCompleted = 0;
  let totalTasks = tasks?.length || 0;
  let reopenedTasks = 0;

  tasks?.forEach((t: any) => {
    if (t.status === "Completed") {
      completedTasks++;
      const actual = new Date(t.actual_finish_date || Date.now());
      const planned = new Date(t.planned_finish_date || Date.now());
      if (actual <= planned) {
        onTimeCompleted++;
      }
    }
  });

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const onTimeRate = completedTasks > 0 ? (onTimeCompleted / completedTasks) * 100 : 0;
  
  // Utilization Rate (dummy 80 for prototype)
  const utilizationRate = 85;

  // Issue Resolution Speed (dummy)
  const issueResolutionSpeed = 90;

  // Rework Rate (inverse) (dummy)
  const reworkRateInverse = 95;

  // Blocker Clearance (dummy)
  const blockerClearance = 80;

  const compositeScore = (
    (completionRate * 0.3) +
    (onTimeRate * 0.25) +
    (utilizationRate * 0.2) +
    (issueResolutionSpeed * 0.1) +
    (reworkRateInverse * 0.1) +
    (blockerClearance * 0.05)
  );

  return {
    score: Math.round(compositeScore),
    metrics: {
      completionRate: Math.round(completionRate),
      onTimeRate: Math.round(onTimeRate),
      utilizationRate,
      issueResolutionSpeed,
      reworkRateInverse,
      blockerClearance,
      totalTasks,
      completedTasks
    }
  };
}

export async function getPMProductivity(targetUserId: string) {
  await verifyRole(["admin", "superadmin", "pm"]);
  const supabase = await createClient();
  
  // Real calculation would aggregate across projects PM is managing
  // For prototype, using simulated scores based on formulas
  return {
    score: 88,
    metrics: {
      scheduleVarianceInverse: 85, // 25%
      milestoneHitRate: 90,        // 25%
      riskMitigationRate: 88,      // 20%
      teamUtilization: 85,         // 15%
      costVarianceInverse: 92,     // 10%
      stakeholderResponsiveness: 95 // 5%
    }
  };
}

export async function getAdminProductivity(orgId: string) {
  await verifyRole(["admin", "superadmin"]);
  return {
    score: 92,
    metrics: {
      approvalTurnaroundInverse: 95,      // 30%
      resourceAllocationEfficiency: 90,   // 25%
      crossProjectIssueDensityInverse: 88,// 20%
      escalationRateInverse: 96,          // 15%
      userOnboardingVelocity: 94          // 10%
    }
  };
}

export async function getVendorProductivity(targetVendorId: string) {
  await verifyRole(["admin", "pm", "superadmin", "vendor"]);
  return {
    score: 85,
    metrics: {
      onTimeDelivery: 88,       // 35%
      defectRateInverse: 90,    // 25%
      slaCompliance: 85,        // 20%
      costVarianceInverse: 82,  // 10%
      wasteContributionInverse: 75 // 10%
    }
  };
}

export async function getProductivityLeaderboard(projectId?: string, role?: string) {
  // Returns ranked comparison
  return [
    { id: "1", name: "Alice Johnson", score: 94, rank: 1, role: "engineer" },
    { id: "2", name: "Bob Smith", score: 89, rank: 2, role: "engineer" },
    { id: "3", name: "Charlie Davis", score: 82, rank: 3, role: "engineer" },
  ];
}

export async function getProductivityTrends(userId: string, period: "week" | "month" | "quarter") {
  return [
    { date: "2026-08-01", score: 82 },
    { date: "2026-08-08", score: 85 },
    { date: "2026-08-15", score: 89 },
    { date: "2026-08-22", score: 88 },
  ];
}
