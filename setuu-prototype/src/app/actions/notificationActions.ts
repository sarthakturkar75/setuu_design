"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function markAsRead(id: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}

export async function sendBroadcast(data: any) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  
  // We pull all users that match the criteria (for prototype, we might just grab active ones)
  const { data: users, error: usersError } = await supabase
    .from("user_actor")
    .select("id")
    .eq("is_active", true);
    
  if (usersError || !users) return { success: false, error: "Failed to resolve users" };
  
  // Batch insert notifications
  const inserts = users.map(u => ({
    user_id: u.id,
    title: data.title || "Broadcast",
    message: data.message,
    type: "System",
    is_read: false
  }));
  
  const { error } = await supabase.from("notifications").insert(inserts);
  if (error) return { success: false, error: error.message };
  
  return { success: true, count: inserts.length };
}
