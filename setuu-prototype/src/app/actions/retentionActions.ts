"use server";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getRetentionPolicies(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_retention_policies")
    .select("*")
    .eq("project_id", projectId);
    
  if (error) {
    console.error("Error fetching retention policies:", error);
    return [];
  }
  return data || [];
}

export async function saveRetentionPolicy(projectId: string, entityType: string, retainDays: number, action: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  
  const { data: existing } = await supabase
    .from("project_retention_policies")
    .select("id")
    .eq("project_id", projectId)
    .eq("entity_type", entityType)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("project_retention_policies")
      .update({ retain_days: retainDays, action })
      .eq("id", existing.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("project_retention_policies")
      .insert({
        project_id: projectId,
        entity_type: entityType,
        retain_days: retainDays,
        action: action
      });
    if (error) return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteRetentionPolicy(id: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_retention_policies")
    .delete()
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  return { success: true };
}
