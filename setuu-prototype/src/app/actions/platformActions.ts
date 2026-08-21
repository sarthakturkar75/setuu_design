"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
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
    
    return {
      orgId: org.id,
      name: org.name,
      usedGb: 0,
      maxGb: maxGb,
      trend: "stable"
    };
  });
}

export async function updatePlatformSettings(data: any) {
  await verifyRole(["admin", "pm", "superadmin"]);
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
  await verifyRole(["admin", "pm", "superadmin"]);
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
  await verifyRole(["admin", "pm", "superadmin"]);
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
  await verifyRole(["admin", "pm", "superadmin"]);
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

export async function getTelemetryData() {
  const supabase = await createClient();
  const { count: users } = await supabase.from("user_actor").select("*", { count: "exact", head: true });
  const { count: orgs } = await supabase.from("organizations").select("*", { count: "exact", head: true });
  const { count: projects } = await supabase.from("projects").select("*", { count: "exact", head: true });
  const { data: logs } = await supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(5);
  
  return {
    kpiData: [
      { label: "Active Users", value: users || 0, trend: { value: 0, label: "stable", isPositive: true } },
      { label: "Organizations", value: orgs || 0, trend: { value: 0, label: "stable", isPositive: true } },
      { label: "Total Projects", value: projects || 0, trend: { value: 0, label: "stable", isPositive: true } },
    ],
    apiRequestData: [],
    regionalData: [],
    securityEvents: logs || []
  };
}


export async function getInfrastructureData() {
  const supabase = await createClient();
  const { data: logs } = await supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(5);
  
  return {
    nodeTopology: [],
    edgeThreats: logs || []
  };
}

export async function getAdminDashboardData() {
  const supabase = await createClient();

  // 1. Portfolio Health
  const { data: projects } = await supabase.from("projects").select("status");
  const healthData = [
    { name: "In Progress", value: projects?.filter(p => p.status === "In Progress").length || 0, color: "var(--semantic-primary)" },
    { name: "Planning", value: projects?.filter(p => p.status === "Not Started").length || 0, color: "var(--semantic-emerald)" },
    { name: "On Hold", value: projects?.filter(p => p.status === "On Hold").length || 0, color: "var(--semantic-amber)" },
  ];

  // 2. Regional Data (Organizations mapped as regions)
  const { data: orgs } = await supabase.from("organizations").select("name");
  let regionalData = (orgs || []).slice(0, 4).map((o, i) => ({
    label: o.name,
    value: 0
  }));

  // 3. Activity Feed (Audit Log)
  const { data: audits } = await supabase
    .from("audit_log")
    .select("*, user_actor(display_name)")
    .order("created_at", { ascending: false })
    .limit(4);

  let recentActivity = (audits || []).map((a) => ({
    id: a.id,
    type: a.event_type.includes("update") ? "update" : "system",
    title: `${a.event_type} on ${a.table_name}`,
    user: a.user_actor?.display_name || "System",
    time: new Date(a.created_at).toLocaleString(),
    project: "Global"
  }));

  // 4. Pending Change Requests
  const { data: crs } = await supabase
    .from("change_requests")
    .select("*, projects(name)")
    .eq("status", "pending")
    .limit(3);

  const pendingChangeRequests = (crs || []).map(cr => ({
    id: cr.display_id || cr.id.substring(0, 8),
    project: cr.projects?.name || "Unknown",
    impact: cr.cost_impact ? `$${cr.cost_impact}` : "$0",
    time: cr.time_impact_days ? `+${cr.time_impact_days} Days` : "+0 Days",
    status: cr.status
  }));

  return {
    portfolioHealthData: healthData,
    regionalData,
    recentActivity,
    pendingChangeRequests
  };
}

export async function sendBroadcast(data: any) {
  await verifyRole(["admin", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").insert({
    title: data.title,
    body: data.message,
    type: "system",
    is_read: false,
    user_id: "00000000-0000-0000-0000-000000000000" // Global fallback or we'd loop users
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
