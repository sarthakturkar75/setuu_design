"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPlatformMetrics() {
  return {
    apiLatencyMs: 42,
    activeSessions: 1240,
    errorRate5xx: 0.01,
    syncQueueDepth: 15
  };
}

export async function getStorageMetrics() {
  return [
    { orgId: "1", name: "Praimo Innovation", usedGb: 120, maxGb: 500 },
    { orgId: "2", name: "Acme Corp", usedGb: 450, maxGb: 500 }
  ];
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
