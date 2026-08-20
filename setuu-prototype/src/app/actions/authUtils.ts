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
