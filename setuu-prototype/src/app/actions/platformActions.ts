"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPlatformMetrics() {
  const supabase = await createClient();
  
  const { count: activeSessions } = await supabase
    .from("user_actor")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);
    
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });
    
  return {
    apiLatencyMs: 42,
    activeSessions: activeSessions || 0,
    totalProjects: totalProjects || 0,
    errorRate5xx: 0.01,
    syncQueueDepth: 15
  };
}

export async function getStorageMetrics() {
  const supabase = await createClient();
  const { data: orgs, error } = await supabase
    .from("organizations")
    .select("id, name, subscription_tier");

  if (error) throw error;
  
  const { data: tiers } = await supabase
    .from("subscription_tiers")
    .select("tier_name, max_storage_gb");

  return orgs.map(org => {
    const tier = tiers?.find(t => t.tier_name === org.subscription_tier);
    const maxGb = tier?.max_storage_gb || 100;
    
    // Deterministic mock for used bytes for prototype UI
    let hash = 0;
    for (let i = 0; i < org.id.length; i++) {
      hash = org.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const stableRandom = Math.abs(hash) % (maxGb - 5) + 5;

    return {
      orgId: org.id,
      name: org.name,
      usedGb: stableRandom,
      maxGb: maxGb,
      trend: "+5 GB this week"
    };
  });
}

export async function updatePlatformSettings(data: any) {
  const supabase = await createClient();
  // Assume a single row in platform_settings
  const { error } = await supabase
    .from("platform_settings")
    .update(data)
    .eq("id", 1);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/superadmin/platform`);
  return { success: true };
}

export async function invokeBreakGlass(orgId: string, reason: string, durationMinutes: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("break_glass_logs")
    .insert({
      target_org_id: orgId,
      reason,
      duration_minutes: durationMinutes,
      status: "Active"
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/superadmin/security`);
  return { success: true };
}

export async function terminateBreakGlass(sessionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("break_glass_logs")
    .update({ status: "Terminated", ended_at: new Date().toISOString() })
    .eq("id", sessionId);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/superadmin/security/logs`);
  return { success: true };
}

export async function getBreakGlassLogs() {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from("break_glass_logs")
    .select("*")
    .order("invoked_at", { ascending: false });
    
  if (error) throw error;
  
  const { data: orgs } = await supabase.from("organizations").select("id, name");
  const { data: users } = await supabase.from("user_actor").select("id, display_name");

  return logs.map(log => ({
    ...log,
    organization: { name: orgs?.find(o => o.id === log.target_org_id)?.name || "Unknown" },
    user: { display_name: users?.find(u => u.id === log.super_admin_id)?.display_name || "System" }
  }));
}

export async function getOrganizations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*");
    
  if (error) throw error;
  return data;
}

export async function provisionOrg(data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("organizations")
    .insert({
      ...data,
      type: "client",
      status: "Active"
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/superadmin/organizations`);
  return { success: true };
}

export async function getSubscriptionTiers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscription_tiers")
    .select("*");
    
  if (error) throw error;
  return data;
}
