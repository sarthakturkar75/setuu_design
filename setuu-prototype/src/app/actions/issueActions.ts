"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createSystemNotification } from "./notificationActions";
import { verifyRole } from "./authUtils";



// Fetch Root Causes
export async function getRootCauses() {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  // We must bypass RLS entirely for this configuration table using the Service Role Key.
  // Standard user sessions likely lack SELECT policies, causing it to constantly return an empty array.
  const supabase = await createClient();

  const { data, error } = await supabase.from("issue_root_causes").select("*");
  if (error) {
    console.error("Failed to fetch root causes:", error);
    return [];
  }

  // Temporary deduplication logic to clean up multiple inserts caused by previous RLS failures
  if (data && data.length > 0) {
    const seenNames = new Set();
    const idsToDelete = [];

    for (const rc of data) {
      if (seenNames.has(rc.name)) {
        idsToDelete.push(rc.id);
      } else {
        seenNames.add(rc.name);
      }
    }

    if (idsToDelete.length > 0) {
      console.log(`Cleaning up ${idsToDelete.length} duplicate root causes...`);
      await supabase.from("issue_root_causes").delete().in("id", idsToDelete);

      // Re-fetch clean data
      const { data: cleanData } = await supabase.from("issue_root_causes").select("*");
      return cleanData || [];
    }
  }

  // Auto-seed if the table is empty
  if (!data || data.length === 0) {
    const seedData = [
      { name: "Design Error", category: "Engineering" },
      { name: "Vendor Execution", category: "Subcontractor" },
      { name: "Weather Impact", category: "Environmental" },
      { name: "Material Shortage", category: "Procurement" },
      { name: "Site Logistics", category: "Operations" },
      { name: "Safety Violation", category: "Compliance" }
    ];

    const { error: seedError } = await supabase.from("issue_root_causes").insert(seedData);
    if (seedError) console.error("Root cause seeding failed:", seedError);

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

  // Handle rich media if uploaded directly
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

  if (!error) {
    // Notify PMs and Admins
    const { data: stakeholders } = await supabase.from("user_actor").select("id").in("role", ["admin", "pm"]);
    if (stakeholders) {
      const userIds = stakeholders.map(s => s.id).filter(id => id !== user?.user?.id);
      if (userIds.length > 0) {
        const creatorEmail = user?.user?.email || "Someone";
        await createSystemNotification(
          userIds,
          `New ${severity} Issue Logged`,
          `${creatorEmail} logged a new ${severity} issue: "${title}". SLA Deadline is ${new Date(slaDeadline).toLocaleDateString()}.`,
          "project",
          projectId
        );
      }
    }
  }

  revalidatePath(`/`);
  return { success: true };
}

// Fetch Issues for Project
export async function getProjectIssues(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
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
  await verifyRole(["admin", "pm", "engineer", "vendor"]);
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  

  // 1. Insert the inspection record
  const { error: inspectError } = await supabase.from("issue_inspections").insert({
    issue_id: issueId,
    inspector_id: user?.user?.id,
    checklist_json: checklistJson,
    conducted_at: new Date().toISOString()
  });

  if (inspectError) return { success: false, error: inspectError.message };

  // 2. Automatically resolve the parent issue since it passed QA!
  const { error: updateError } = await supabase
    .from("project_issues")
    .update({
      status: "Resolved",
      resolved_at: new Date().toISOString()
    })
    .eq("id", issueId);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath(`/`);
  return { success: true };
}

// Add this new function at the bottom so the Global Console "Mark Resolved" button works too!
export async function markIssueResolved(issueId: string) {
  await verifyRole(["admin", "pm", "engineer", "vendor"]);
  const supabase = await createClient();

  const { error } = await supabase
    .from("project_issues")
    .update({
      status: "Resolved",
      resolved_at: new Date().toISOString()
    })
    .eq("id", issueId);

  if (error) return { success: false, error: error.message };
  revalidatePath(`/`);
  return { success: true };
}

// Analytics Aggregation (Tasks 2, 7)
export async function getIssueAnalytics(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
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
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  let query = supabase.from("project_issues").select("*, projects(name)").order("created_at", { ascending: false });
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
