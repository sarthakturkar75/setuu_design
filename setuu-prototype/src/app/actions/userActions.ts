"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUsers(filters?: { role?: string, organization_id?: string, status?: string }) {
  const supabase = await createClient();
  let query = supabase.from("user_actor").select("*, organizations(name)");
  
  if (filters?.role) query = query.eq("role", filters.role);
  if (filters?.organization_id) query = query.eq("organization_id", filters.organization_id);
  if (filters?.status) {
    query = query.eq("is_active", filters.status === "Active");
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getUserById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_actor")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) throw error;
  return data;
}

export async function inviteUser(email: string, role: string, orgId: string) {
  // In a real implementation this would use Supabase Admin Auth to generate an invite link
  // For the prototype we'll just insert a dummy identity and actor
  const supabase = await createClient();
  const newUserId = crypto.randomUUID();
  
  await supabase.from("user_identity").insert({
    actor_id: newUserId,
    email,
    full_name: "Invited User",
    password_hash: "pending",
  });
  
  const { error } = await supabase.from("user_actor").insert({
    id: newUserId,
    role,
    organization_id: orgId || null,
    display_name: email.split('@')[0],
    is_active: true,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserProfile(id: string, updateData: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_actor")
    .update(updateData)
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/users`);
  return { success: true };
}

export async function deactivateUser(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_actor")
    .update({ is_active: false })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function forceLogout(id: string) {
  const supabase = await createClient();
  // Invalidating tokens or sessions
  const { error } = await supabase
    .from("user_actor")
    .update({ is_active: false, lockout_until: new Date(Date.now() + 24*60*60*1000).toISOString() })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath("/superadmin/users");
  return { success: true };
}
