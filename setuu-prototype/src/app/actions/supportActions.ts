"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";

export async function getTickets(filters?: { priority?: string, status?: string }) {
  const supabase = await createClient();
  let query = supabase.from("support_tickets").select("*");
  
  if (filters?.priority) query = query.eq("priority", filters.priority);
  if (filters?.status) query = query.eq("status", filters.status);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createTicket(data: any) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("support_tickets")
    .insert({
      ...data,
      status: "Open"
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/support`);
  return { success: true };
}

export async function updateTicket(id: string, data: any) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("support_tickets")
    .update(data)
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/support`);
  return { success: true };
}

export async function escalateTicket(id: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ priority: "Critical", status: "Escalated" })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/support`);
  return { success: true };
}
