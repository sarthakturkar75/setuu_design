"use server";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

// Helpers for the various roles

export async function getEngineerProductivity(targetUserId: string, projectId?: string) {
  try {
        const user = await verifyRole(["admin", "pm", "superadmin", "engineer"]);
    const supabase = await createClient();

    const { data: actor } = await supabase.from('user_actor').select('role').eq('id', user.id).single();
    if (actor?.role === 'engineer' && user.id !== targetUserId) {
      throw new Error("Access Denied: Engineers can only view their own productivity.");
    }
    if (actor?.role === 'pm' && user.id !== targetUserId) {
      const { data: pmProjects } = await supabase.from('projects').select('id').eq('project_manager_id', user.id);
      const pmProjectIds = pmProjects?.map(p => p.id) || [];
      const { data: targetResources } = await supabase.from('project_resources').select('id').eq('user_id', targetUserId).in('project_id', pmProjectIds);
      if (!targetResources || targetResources.length === 0) {
        throw new Error("Access Denied: PMs can only view productivity of engineers in their projects.");
      }
    }

    // 1. Task Completion & On-Time Rate
    let taskQuery = supabase.from("tasks").select("id, status, planned_finish_date, actual_finish_date").eq("assignee_id", targetUserId);
    if (projectId) taskQuery = taskQuery.eq("project_id", projectId);
    const { data: tasks, error: tasksError } = await taskQuery;

    let completedTasks = 0;
    let onTimeCompleted = 0;
    let totalTasks = tasks?.length || 0;
    let reopenedTasks = 0; // Simplified count 
    let previouslyBlockedTasks = 0; // Simplified count
    let currentlyBlockedTasks = 0;

    tasks?.forEach((t: any) => {
      if (t.status === "Completed") {
        completedTasks++;
        const actual = new Date(t.actual_finish_date || Date.now());
        const planned = new Date(t.planned_finish_date || Date.now());
        if (actual <= planned) onTimeCompleted++;
      }
      // Assuming a simplistic task history check could be done, here we rely on basic heuristics if history isn't fetched
      if (t.status === 'In Progress' && t.actual_finish_date) reopenedTasks++;
      if (t.status === 'blocked') currentlyBlockedTasks++;
      // We assume if a task has notes about being blocked but is now in progress/completed, it was unblocked
    });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const onTimeRate = completedTasks > 0 ? (onTimeCompleted / completedTasks) * 100 : 0;

    // 2. Utilization Rate
    const { data: logs } = await supabase.from("daily_logs").select("hours_logged").eq("user_id", targetUserId);
    const { data: resources } = await supabase.from("project_resources").select("allocated_hours").eq("user_id", targetUserId);
    
    let actualHours = logs?.reduce((acc: number, log: any) => acc + (log.hours_logged || 0), 0) || 0;
    let allocatedHours = resources?.reduce((acc: number, res: any) => acc + (res.allocated_hours || 0), 0) || 1; // avoid division by zero
    const utilizationRate = Math.min(100, (actualHours / allocatedHours) * 100);

    // 3. Issue Resolution Speed
    const { data: issues } = await supabase.from("project_issues").select("created_at, resolved_at, status").eq("assigned_to", targetUserId);
    let totalResolutionTime = 0;
    let resolvedIssuesCount = 0;
    issues?.forEach((issue: any) => {
      if (issue.status === 'Resolved' || issue.resolved_at) {
        resolvedIssuesCount++;
        const created = new Date(issue.created_at).getTime();
        const resolved = new Date(issue.resolved_at || Date.now()).getTime();
        totalResolutionTime += (resolved - created) / (1000 * 60 * 60 * 24); // days
      }
    });
    // Scale: 0 days = 100 score, 14+ days = 0 score
    const avgResolutionTime = resolvedIssuesCount > 0 ? totalResolutionTime / resolvedIssuesCount : 0;
    const issueResolutionSpeed = resolvedIssuesCount > 0 ? Math.max(0, 100 - (avgResolutionTime / 14) * 100) : 100;

    // 4. Rework Rate (Inverse)
    const reworkRateInverse = totalTasks > 0 ? 100 - ((reopenedTasks / totalTasks) * 100) : 100;

    // 5. Blocker Clearance
    // Without full audit history, we approximate unblocked by completed tasks that had blockers, or just assume a base clearance rate
    const blockerClearance = 100 - (totalTasks > 0 ? (currentlyBlockedTasks / totalTasks) * 100 : 0);

    const compositeScore = (
      (completionRate * 0.3) +
      (onTimeRate * 0.25) +
      (utilizationRate * 0.2) +
      (issueResolutionSpeed * 0.1) +
      (reworkRateInverse * 0.1) +
      (blockerClearance * 0.05)
    );

    return {
      score: Math.round(compositeScore) || 0,
      metrics: {
        completionRate: Math.round(completionRate),
        onTimeRate: Math.round(onTimeRate),
        utilizationRate: Math.round(utilizationRate),
        issueResolutionSpeed: Math.round(issueResolutionSpeed),
        reworkRateInverse: Math.round(reworkRateInverse),
        blockerClearance: Math.round(blockerClearance),
        totalTasks,
        completedTasks
      }
    };
  } catch (error) {
    console.error("Error in getEngineerProductivity:", error);
    return { score: 0, metrics: {} };
  }
}

export async function getPMProductivity(targetUserId: string) {
  try {
        const user = await verifyRole(["admin", "superadmin", "pm"]);
    const supabase = await createClient();

    const { data: actor } = await supabase.from('user_actor').select('role').eq('id', user.id).single();
    if (actor?.role === 'pm' && user.id !== targetUserId) {
      throw new Error("Access Denied: PMs can only view their own productivity.");
    }
    
    const { data: projects } = await supabase.from("projects").select("id, status, planned_start_date, planned_end_date, actual_start_date, actual_end_date, contract_value, actual_spend").eq("project_manager_id", targetUserId);
    
    if (!projects || projects.length === 0) {
      return { score: 0, metrics: {} };
    }

    const projectIds = projects.map(p => p.id);

    // 1. Schedule Variance Inverse
    let totalDelayDays = 0;
    projects.forEach(p => {
      if (p.actual_end_date && p.planned_end_date) {
        const planned = new Date(p.planned_end_date).getTime();
        const actual = new Date(p.actual_end_date).getTime();
        if (actual > planned) totalDelayDays += (actual - planned) / (1000 * 60 * 60 * 24);
      }
    });
    const scheduleVarianceInverse = Math.max(0, 100 - (totalDelayDays / 30) * 10); // arbitrary scaling

    // 2. Milestone Hit Rate
    const { data: milestones } = await supabase.from("project_milestones").select("status, target_date, actual_date").in("project_id", projectIds);
    let onTimeMilestones = 0;
    let totalMilestones = milestones?.length || 0;
    milestones?.forEach(m => {
      if (m.status === 'Completed' && new Date(m.actual_date || Date.now()) <= new Date(m.target_date)) onTimeMilestones++;
    });
    const milestoneHitRate = totalMilestones > 0 ? (onTimeMilestones / totalMilestones) * 100 : 100;

    // 3. Risk Mitigation Rate
    const { data: issues } = await supabase.from("project_issues").select("status").in("project_id", projectIds);
    let resolvedIssues = 0;
    let totalIssues = issues?.length || 0;
    issues?.forEach(i => { if (i.status === 'Resolved' || i.status === 'Closed') resolvedIssues++; });
    const riskMitigationRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 100;

    // 4. Team Utilization
    const { data: resources } = await supabase.from("project_resources").select("allocated_hours, user_id").in("project_id", projectIds);
    let totalAllocated = resources?.reduce((acc: number, r: any) => acc + (r.allocated_hours || 0), 0) || 1;
    // Ideally fetch daily_logs for these users & projects, approximating for now
    const { data: logs } = await supabase.from("daily_logs").select("hours_logged").in("project_id", projectIds);
    let totalActual = logs?.reduce((acc: number, l: any) => acc + (l.hours_logged || 0), 0) || 0;
    const teamUtilization = Math.min(100, (totalActual / totalAllocated) * 100);

    // 5. Cost Variance Inverse
    let totalContractValue = projects.reduce((acc, p) => acc + (Number(p.contract_value) || 0), 0);
    let totalSpend = projects.reduce((acc, p) => acc + (Number(p.actual_spend) || 0), 0) || 1; // avoid zero div
    const costVarianceInverse = totalSpend <= totalContractValue ? 100 : Math.max(0, 100 - ((totalSpend - totalContractValue) / totalContractValue) * 100);

    // 6. Stakeholder Responsiveness (Calculated from project_updates)
    const { data: updates } = await supabase.from("project_updates").select("id").in("project_id", projectIds).eq("user_id", targetUserId);
    const updatesCount = updates?.length || 0;
    // Simple heuristic: 1 update per active project per week is "100" responsiveness. 
    const stakeholderResponsiveness = projectIds.length > 0 ? Math.min(100, (updatesCount / (projectIds.length * 4)) * 100) : 100;

    const compositeScore = (
      (scheduleVarianceInverse * 0.25) +
      (milestoneHitRate * 0.25) +
      (riskMitigationRate * 0.20) +
      (teamUtilization * 0.15) +
      (costVarianceInverse * 0.10) +
      (stakeholderResponsiveness * 0.05)
    );

    return {
      score: Math.round(compositeScore) || 0,
      metrics: {
        scheduleVarianceInverse: Math.round(scheduleVarianceInverse),
        milestoneHitRate: Math.round(milestoneHitRate),
        riskMitigationRate: Math.round(riskMitigationRate),
        teamUtilization: Math.round(teamUtilization),
        costVarianceInverse: Math.round(costVarianceInverse),
        stakeholderResponsiveness
      }
    };
  } catch (error) {
    console.error("Error in getPMProductivity:", error);
    return { score: 0, metrics: {} };
  }
}

export async function getAdminProductivity(orgId: string) {
  try {
    await verifyRole(["admin", "superadmin"]);
    const supabase = await createClient();

    // 1. Approval Turnaround Inverse
    const { data: changes } = await supabase.from("change_requests").select("created_at, updated_at, status");
    let totalDays = 0, count = 0;
    changes?.forEach(c => {
      if (c.status === 'Approved' || c.status === 'Rejected') {
        const days = (new Date(c.updated_at).getTime() - new Date(c.created_at).getTime()) / (1000*60*60*24);
        totalDays += days;
        count++;
      }
    });
    const avgTurnaround = count > 0 ? totalDays / count : 0;
    const approvalTurnaroundInverse = Math.max(0, 100 - (avgTurnaround * 5)); // 20 days max

    // 2. Resource Allocation Efficiency
    const { data: resources } = await supabase.from("project_resources").select("allocated_hours");
    const { data: logs } = await supabase.from("daily_logs").select("hours_logged");
    let alloc = resources?.reduce((a,r)=>a+(r.allocated_hours||0),0)||1;
    let act = logs?.reduce((a,l)=>a+(l.hours_logged||0),0)||0;
    const resourceAllocationEfficiency = Math.min(100, act/alloc*100);

    // 3. Cross Project Issue Density
    const { data: projects } = await supabase.from("projects").select("id");
    const { data: issues } = await supabase.from("project_issues").select("id");
    const projectCount = projects?.length || 1;
    const issueDensity = (issues?.length || 0) / projectCount;
    const crossProjectIssueDensityInverse = Math.max(0, 100 - (issueDensity * 2)); 

    // 4. Escalation Rate
    const { data: criticalIssues } = await supabase.from("project_issues").select("id").eq("severity", "critical");
    const escalationRate = issues?.length ? (criticalIssues?.length || 0) / issues.length : 0;
    const escalationRateInverse = 100 - (escalationRate * 100);

    // 5. User Onboarding Velocity
    // Assuming users added in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: newUsers } = await supabase.from("user_actor").select("id").gte("created_at", thirtyDaysAgo.toISOString());
    const userOnboardingVelocity = Math.min(100, (newUsers?.length || 0) * 10); // scale max 10 users = 100

    const compositeScore = (
      (approvalTurnaroundInverse * 0.3) +
      (resourceAllocationEfficiency * 0.25) +
      (crossProjectIssueDensityInverse * 0.2) +
      (escalationRateInverse * 0.15) +
      (userOnboardingVelocity * 0.1)
    );

    return {
      score: Math.round(compositeScore) || 0,
      metrics: {
        approvalTurnaroundInverse: Math.round(approvalTurnaroundInverse),
        resourceAllocationEfficiency: Math.round(resourceAllocationEfficiency),
        crossProjectIssueDensityInverse: Math.round(crossProjectIssueDensityInverse),
        escalationRateInverse: Math.round(escalationRateInverse),
        userOnboardingVelocity: Math.round(userOnboardingVelocity)
      }
    };
  } catch (error) {
    console.error("Error in getAdminProductivity:", error);
    return { score: 0, metrics: {} };
  }
}

export async function getVendorProductivity(targetVendorId: string) {
  try {
        const user = await verifyRole(["admin", "pm", "superadmin", "vendor"]);
    const supabase = await createClient();

    const { data: actor } = await supabase.from('user_actor').select('role, organization_id').eq('id', user.id).single();
    if (actor?.role === 'vendor') {
      const { data: orgVendor } = await supabase.from('org_vendors').select('id').eq('organization_id', actor.organization_id).single();
      if (orgVendor?.id !== targetVendorId) {
        throw new Error("Access Denied: Vendors can only view their own productivity.");
      }
    }
    if (actor?.role === 'pm') {
      const { data: pmProjects } = await supabase.from('projects').select('id').eq('project_manager_id', user.id);
      const pmProjectIds = pmProjects?.map(p => p.id) || [];
      const { data: projectVendors } = await supabase.from('project_vendors').select('id').eq('vendor_id', targetVendorId).in('project_id', pmProjectIds);
      if (!projectVendors || projectVendors.length === 0) {
        throw new Error("Access Denied: PMs can only view productivity of vendors in their projects.");
      }
    }

    // 1. On Time Delivery
    const { data: materials } = await supabase.from("project_materials").select("status, estimated_delivery, actual_delivery, estimated_cost, actual_cost, damaged_qty, total_qty").eq("vendor_id", targetVendorId);
    let onTime = 0, totalDelivered = 0, damaged = 0, totalItems = 0, estCost = 0, actCost = 0;
    
    materials?.forEach(m => {
      if (m.status === 'Delivered') {
        totalDelivered++;
        if (new Date(m.actual_delivery) <= new Date(m.estimated_delivery)) onTime++;
      }
      damaged += (m.damaged_qty || 0);
      totalItems += (m.total_qty || 1);
      estCost += (m.estimated_cost || 0);
      actCost += (m.actual_cost || 0);
    });
    const onTimeDelivery = totalDelivered > 0 ? (onTime / totalDelivered) * 100 : 100;

    // 2. Cost Variance Inverse
    const costVarianceInverse = actCost <= estCost ? 100 : Math.max(0, 100 - ((actCost - estCost) / (estCost || 1)) * 100);

    // 3. Waste Contribution Inverse
    const wasteContributionInverse = totalItems > 0 ? 100 - ((damaged / totalItems) * 100) : 100;

    // 4. Defect Rate Inverse (Issues attributed to vendor)
    const { data: issues } = await supabase.from("project_issues").select("id").eq("responsible_vendor_id", targetVendorId);
    const defectCount = issues?.length || 0;
    const defectRateInverse = Math.max(0, 100 - (defectCount * 5)); // arbitrary scale

    // 5. SLA Compliance
    // Read from a vendors table or similar
    const { data: vendor } = await supabase.from("org_vendors").select("sla_status").eq("id", targetVendorId).single();
    const slaCompliance = vendor?.sla_status === 'Breached' ? 50 : (vendor?.sla_status === 'Warning' ? 75 : 100);

    const compositeScore = (
      (onTimeDelivery * 0.35) +
      (defectRateInverse * 0.25) +
      (slaCompliance * 0.20) +
      (costVarianceInverse * 0.10) +
      (wasteContributionInverse * 0.10)
    );

    return {
      score: Math.round(compositeScore) || 0,
      metrics: {
        onTimeDelivery: Math.round(onTimeDelivery),
        defectRateInverse: Math.round(defectRateInverse),
        slaCompliance: Math.round(slaCompliance),
        costVarianceInverse: Math.round(costVarianceInverse),
        wasteContributionInverse: Math.round(wasteContributionInverse)
      }
    };
  } catch (error) {
    console.error("Error in getVendorProductivity:", error);
    return { score: 0, metrics: {} };
  }
}

export async function getProductivityLeaderboard(projectId?: string, role?: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  try {
    const supabase = await createClient();
    
    let query = supabase.from("user_actor").select("id, full_name, role");
    if (role) query = query.eq("role", role);
    
    const { data: users, error } = await query;
    if (error || !users) return [];

    const leaderboard = await Promise.all(users.map(async (u) => {
      let score = 0;
      if (u.role === 'engineer') score = (await getEngineerProductivity(u.id, projectId)).score;
      else if (u.role === 'pm') score = (await getPMProductivity(u.id)).score;
      // admins and vendors might have different IDs or tables, simplify by scoring based on role
      return { id: u.id, name: u.full_name || 'Unknown', score, role: u.role };
    }));

    return leaderboard
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  } catch (error) {
    console.error("Error in getProductivityLeaderboard:", error);
    return [];
  }
}

export async function getProductivityTrends(userId: string, period: "week" | "month" | "quarter") {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  try {
    const supabase = await createClient();
    
    // Simplistic trend calculation: 4 data points for previous periods
    const dates = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      let d = new Date();
      if (period === 'week') d.setDate(now.getDate() - (i * 7));
      if (period === 'month') d.setMonth(now.getMonth() - i);
      if (period === 'quarter') d.setMonth(now.getMonth() - (i * 3));
      dates.push(d.toISOString().split('T')[0]);
    }

    // Since calculating actual historical scores requires snapshotting or complex historical queries,
    // we return calculated dates and proxy scores (e.g. by querying tasks completed up to that date)
    // For this rewrite, we will query tasks completed before each date to compute a rolling completion rate.
    
    const { data: tasks } = await supabase.from("tasks").select("status, actual_finish_date").eq("assignee_id", userId);
    
    return dates.map(date => {
      let completedBeforeDate = 0;
      let totalBeforeDate = 0;
      
      tasks?.forEach(t => {
        // assume all tasks created before the date, simplified:
        totalBeforeDate++;
        if (t.status === 'Completed' && t.actual_finish_date && t.actual_finish_date <= date) {
          completedBeforeDate++;
        }
      });
      
      let rate = totalBeforeDate > 0 ? (completedBeforeDate / totalBeforeDate) * 100 : 0;
      // Blend with a base score for visualization
      let baseScore = 70;
      let score = Math.round(baseScore + (rate * 0.3));

      return { date, score };
    });
  } catch (error) {
    console.error("Error in getProductivityTrends:", error);
    return [];
  }
}
