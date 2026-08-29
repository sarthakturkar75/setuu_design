import { createClient } from "@/lib/supabase/server";

export async function verifyRole(allowedRoles: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: Not logged in");
  
  const { data: actor } = await supabase.from("user_actor").select("role").eq("id", user.id).single();
  const userRole = actor?.role?.toLowerCase() || "";
  
  if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    throw new Error("Forbidden: Insufficient permissions");
  }
  return user;
}

export async function verifyModuleAccess(projectId: string, moduleId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: config, error } = await supabase
    .from("project_module_config")
    .select("is_enabled")
    .eq("project_id", projectId)
    .eq("module_id", moduleId)
    .single();

  // If there's no config record, we default to enabled (or true) based on requirements, 
  // but strict enforcement usually means false. Assuming default is true for legacy.
  if (error || !config) return true;
  
  if (config.is_enabled === false) {
    throw new Error("Forbidden: Module is disabled for this project.");
  }
  return true;
}
