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

export async function getClientApprovals(projectId?: string) { return [] as any[]; }
export async function createClientOrg(data: any): Promise<{success: boolean, error?: string}> { return { success: true }; }
export async function getClientOrgs() { return [] as any[]; }
