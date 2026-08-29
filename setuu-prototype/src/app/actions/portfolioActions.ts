"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getPortfolioAverages() {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error("Unauthorized");

  // Fetch all projects the user has access to
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, status, contract_value");

  if (projectsError || !projects || projects.length === 0) {
    return { avgProgress: 0, avgRiskScore: 0, avgBudgetVariance: 0 };
  }

  const projectIds = projects.map(p => p.id);

  // Fetch real data across all accessible projects
  const [
    { data: milestones },
    { data: issues },
    { data: changes }
  ] = await Promise.all([
    supabase.from("milestones").select("project_id, completion_status, status_label").in("project_id", projectIds),
    supabase.from("project_issues").select("project_id, status, severity_level, severity").in("project_id", projectIds),
    supabase.from("change_requests").select("project_id, status, cost_impact").in("project_id", projectIds)
  ]);

  let totalProgress = 0;
  let totalRiskScore = 0;
  let totalBudgetVariance = 0;
  let validProjectsCount = 0;

  for (const proj of projects) {
    validProjectsCount++;

    // 1. Calculate Progress
    const projMilestones = (milestones || []).filter(m => m.project_id === proj.id);
    const completed = projMilestones.filter(m => m.completion_status === true || m.status_label === 'Completed').length;
    const progress = projMilestones.length > 0 ? (completed / projMilestones.length) * 100 : 0;
    totalProgress += progress;

    // 2. Calculate Real Budget Variance
    const projChanges = (changes || []).filter(c => c.project_id === proj.id && c.status === 'Approved');
    const totalChangesCost = projChanges.reduce((acc, c) => acc + Number(c.cost_impact || 0), 0);
    const variance = proj.contract_value ? (totalChangesCost / proj.contract_value) * 100 : 0;
    totalBudgetVariance += variance;

    // 3. Calculate Risk Score
    const projIssues = (issues || []).filter(i => i.project_id === proj.id);
    const criticalIssues = projIssues.filter(i => i.status === 'Open' && (i.severity === 'High' || i.severity === 'Critical' || i.severity_level === 'High' || i.severity_level === 'Critical')).length;
    const overdueMilestones = projMilestones.filter(m => m.status_label === 'Overdue').length;
    
    let risk = 10 + (criticalIssues * 15) + (overdueMilestones * 10) + (variance > 0 ? variance * 5 : 0);
    if (risk > 100) risk = 100;
    totalRiskScore += risk;
  }

  let totalOpenIssues = 0;
  let totalCompletedMilestones = 0;
  for (const proj of projects) {
    const projIssues = (issues || []).filter(i => i.project_id === proj.id);
    const projMilestones = (milestones || []).filter(m => m.project_id === proj.id);
    totalOpenIssues += projIssues.filter(i => i.status === 'Open').length;
    totalCompletedMilestones += projMilestones.filter(m => m.completion_status === true || m.status_label === 'Completed').length;
  }

  return {
    avgProgress: validProjectsCount > 0 ? Math.round(totalProgress / validProjectsCount) : 0,
    avgRiskScore: validProjectsCount > 0 ? Math.round(totalRiskScore / validProjectsCount) : 0,
    avgBudgetVariance: validProjectsCount > 0 ? +(totalBudgetVariance / validProjectsCount).toFixed(1) : 0,
    avgOpenIssues: validProjectsCount > 0 ? Math.round(totalOpenIssues / validProjectsCount) : 0,
    avgCompletedMilestones: validProjectsCount > 0 ? Math.round(totalCompletedMilestones / validProjectsCount) : 0
  };
}
