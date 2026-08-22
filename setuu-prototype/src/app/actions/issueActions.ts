"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

// Fetch Root Causes
export async function getRootCauses() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("issue_root_causes").select("*");
  if (error) throw error;
  
  // Auto-seed if the table is empty to ensure strict dropdown enforcement works
  if (!data || data.length === 0) {
    const seedData = [
      { name: "Design Error", category: "Engineering" },
      { name: "Vendor Execution", category: "Subcontractor" },
      { name: "Weather Impact", category: "Environmental" },
      { name: "Material Shortage", category: "Procurement" },
      { name: "Site Logistics", category: "Operations" },
      { name: "Safety Violation", category: "Compliance" }
    ];
    await supabase.from("issue_root_causes").insert(seedData);
    const { data: newData } = await supabase.from("issue_root_causes").select("*");
    return newData || [];
  }
  
  return data;
}

// 1. Create Issue with SLA Timer and Rework Cost (Tasks 1, 2, 7)
export async function createIssue(formData: FormData) {
  await verifyRole(["admin", "pm", "vendor", "engineer"]);
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  const projectId = formData.get("project_id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string; // 'Critical', 'High', 'Medium', 'Low'
  const rootCauseId = formData.get("root_cause_id") as string;
  const estimatedReworkCost = parseFloat(formData.get("estimated_rework_cost") as string) || 0;

  // SLA Calculation
  const slaHours = severity === "Critical" ? 24 : 72;
  const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();

  // Handle rich media if uploaded directly (simulated array for now, real UI will pass JSON strings)
  const mediaAssets = formData.get("media_assets") ? JSON.parse(formData.get("media_assets") as string) : [];

  const { error } = await supabase.from("project_issues").insert({
    project_id: projectId,
    title,
    description,
    severity,
    status: "Open",
    root_cause_id: rootCauseId || null,
    estimated_rework_cost: estimatedReworkCost,
    sla_deadline: slaDeadline,
    created_by: user?.user?.id,
    custom_data: { media_assets: mediaAssets }
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

// Fetch Issues for Project
export async function getProjectIssues(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_issues")
    .select("*, issue_root_causes(name, category)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// 3. QA/QC Inspection Templates (Task 3)
export async function logQAInspection(issueId: string, checklistJson: any) {
  await verifyRole(["admin", "pm", "engineer"]);
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase.from("issue_inspections").insert({
    issue_id: issueId,
    inspector_id: user?.user?.id,
    checklist_json: checklistJson,
    conducted_at: new Date().toISOString()
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

// Analytics Aggregation (Tasks 2, 7)
export async function getIssueAnalytics(projectId: string) {
  const supabase = await createClient();
  
  // Aggregate Financial Impact
  const { data: issues } = await supabase.from("project_issues").select("estimated_rework_cost, issue_root_causes(name)").eq("project_id", projectId);
  
  let totalReworkCost = 0;
  const rootCauseDistribution: Record<string, number> = {};

  if (issues) {
    issues.forEach(issue => {
      totalReworkCost += (issue.estimated_rework_cost || 0);
      
      const rcName = (issue.issue_root_causes as any)?.name || "Uncategorized";
      rootCauseDistribution[rcName] = (rootCauseDistribution[rcName] || 0) + 1;
    });
  }

  const chartData = Object.entries(rootCauseDistribution).map(([name, count]) => ({ name, count }));

  return { totalReworkCost, rootCauseDistribution: chartData };
}

// Legacy compatibility for global dashboards
export async function getIssues(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("project_issues").select("*, projects(name)").order("created_at", { ascending: false });
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
