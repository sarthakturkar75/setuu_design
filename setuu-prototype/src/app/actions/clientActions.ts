"use server";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getClientPortfolio(orgId: string) {
  await verifyRole(["admin", "pm", "superadmin", "client"]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("client_org_id", orgId);
  if (error) return [];
  return data;
}

export async function getClientFinancialSummary(orgId: string) {
  await verifyRole(["admin", "pm", "superadmin", "client"]);
  const supabase = await createClient();
  // Aggregate contract_value and change request impacts
  const { data: projects, error } = await supabase.from("projects").select("id, contract_value, change_requests(cost_impact)").eq("client_org_id", orgId);
  if (error || !projects) return { totalContractValue: 0, totalChanges: 0 };
  
  let totalContractValue = 0;
  let totalChanges = 0;
  projects.forEach((p: any) => {
    totalContractValue += p.contract_value || 0;
    p.change_requests?.forEach((cr: any) => {
      totalChanges += cr.cost_impact || 0;
    });
  });

  return { totalContractValue, totalChanges };
}

export async function getClientApprovals(projectId?: string) {
  await verifyRole(["admin", "pm", "superadmin", "client"]);
  const supabase = await createClient();
  
  let query = supabase.from("client_approvals").select(`
    *,
    projects(id, name, client_org_id)
  `);

  if (projectId) {
    query = query.eq("project_id", projectId);
  } else {
    // Only fetch pending approvals for the dashboard/list by default
    query = query.eq("status", "pending");
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching client approvals:", error);
    return [];
  }
  return data || [];
}

export async function createClientOrg(data: any): Promise<{success: boolean, error?: string}> {
  await verifyRole(["admin", "superadmin"]);
  const supabase = await createClient();
  
  const { data: orgData, error: orgError } = await supabase.from("organizations").insert({
    name: data.name,
    type: "client",
    ...data
  }).select().single();

  if (orgError) {
    console.error("Error creating client org:", orgError);
    return { success: false, error: orgError.message };
  }

  return { success: true };
}

export async function getClientOrgs() {
  await verifyRole(["admin", "pm", "superadmin", "client"]);
  const supabase = await createClient();
  
  const { data, error } = await supabase.from("organizations").select("*").eq("type", "client");
  if (error) {
    console.error("Error fetching client orgs:", error);
    return [];
  }
  
  return data || [];
}

export async function getClientProjectUpdates(orgId: string) {
  await verifyRole(["admin", "pm", "superadmin", "client"]);
  const supabase = await createClient();
  
  const { data, error } = await supabase.from("project_updates").select(`
    *,
    projects!inner(id, name, client_org_id)
  `).eq("projects.client_org_id", orgId);
  
  if (error) {
    console.error("Error fetching project updates:", error);
    return [];
  }
  
  return data || [];
}

export async function getClientIssuesSummary(orgId: string) {
  await verifyRole(["admin", "pm", "superadmin", "client"]);
  const supabase = await createClient();
  
  const { data, error } = await supabase.from("project_issues").select(`
    severity,
    projects!inner(id, client_org_id)
  `).eq("projects.client_org_id", orgId);
  
  if (error) {
    console.error("Error fetching client issues:", error);
    return { high: 0, medium: 0, low: 0 };
  }
  
  const summary = { high: 0, medium: 0, low: 0 };
  data?.forEach((issue: any) => {
    if (issue.severity === "high") summary.high++;
    else if (issue.severity === "medium") summary.medium++;
    else if (issue.severity === "low") summary.low++;
  });
  
  return summary;
}

export async function getClientMeetings(orgId: string) {
  await verifyRole(["admin", "pm", "superadmin", "client"]);
  const supabase = await createClient();
  
  const { data, error } = await supabase.from("project_meetings").select(`
    *,
    projects!inner(id, name, client_org_id)
  `).eq("projects.client_org_id", orgId);
  
  if (error) {
    console.error("Error fetching client meetings:", error);
    return [];
  }
  
  return data || [];
}

export async function reviewClientApproval(approvalId: string, action: "approved" | "revision_requested", comments: string) {
  await verifyRole(["client"]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("client_approvals").update({
    status: action,
    comments: comments,
    actioned_at: new Date().toISOString()
  }).eq("id", approvalId);

  if (error) {
    console.error("Error updating client approval:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
