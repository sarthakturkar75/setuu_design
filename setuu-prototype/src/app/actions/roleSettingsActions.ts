"use server";
import { createClient } from "@/lib/supabase/server";

export async function getRoleLandingPage(projectId: string, role: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_role_settings")
    .select("default_landing_page")
    .eq("project_id", projectId)
    .eq("role", role)
    .maybeSingle();

  if (data?.default_landing_page) return data.default_landing_page;

  // Fallbacks
  if (role === "vendor") return `/vendor/projects/${projectId}/collaboration`;
  if (role === "client") return `/client/projects/${projectId}/handover`; // Or dashboard
  if (role === "engineer") return `/engineer/projects/${projectId}/issues`;
  return `/${role}/projects/${projectId}`;
}

export async function getProjectRoleSettings(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_role_settings")
    .select("role, default_landing_page")
    .eq("project_id", projectId);
    
  return data || [];
}

export async function updateRoleSetting(projectId: string, role: string, landingPage: string) {
  const supabase = await createClient();
  
  const { data: existing } = await supabase
    .from("project_role_settings")
    .select("id")
    .eq("project_id", projectId)
    .eq("role", role)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("project_role_settings")
      .update({ default_landing_page: landingPage })
      .eq("id", existing.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("project_role_settings")
      .insert({
        project_id: projectId,
        role: role,
        default_landing_page: landingPage
      });
    if (error) return { success: false, error: error.message };
  }
  
  return { success: true };
}
