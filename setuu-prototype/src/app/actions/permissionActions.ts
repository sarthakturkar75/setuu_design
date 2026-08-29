"use server";
import { verifyRole } from "./authUtils";

import { createClient } from "@/lib/supabase/server";




export async function getProjectPermissions(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data } = await supabase
    .from('project_granular_permissions')
    .select('*')
    .eq('project_id', projectId);
  
  return data || [];
}

export async function toggleUserPermission(projectId: string, userId: string, field: 'can_view_drawings' | 'can_view_financials', value: boolean) {
  await verifyRole(["admin", "superadmin"]);
  const supabase = await createClient();
  
  try {
    const { data: existing, error: fetchErr } = await supabase
      .from('project_granular_permissions')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr) {
      return { success: false, error: fetchErr.message };
    }

    if (existing) {
      const { error: updateErr } = await supabase
        .from('project_granular_permissions')
        .update({ [field]: value })
        .eq('id', existing.id);
        
      if (updateErr) return { success: false, error: updateErr.message };
    } else {
      const { error: insertErr } = await supabase
        .from('project_granular_permissions')
        .insert({
          project_id: projectId,
          user_id: userId,
          [field]: value
        });
        
      if (insertErr) return { success: false, error: insertErr.message };
    }
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}
