"use server";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getTimesheets(startDate: string, endDate: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("employee_timesheets")
    .select("*, projects(name)")
    .eq("user_id", user.id)
    .gte("work_date", startDate)
    .lte("work_date", endDate);
    
  if (error) throw error;
  return data || [];
}

export async function logTimeEntry(data: any) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { error } = await supabase.from("employee_timesheets").insert(data);
  if (error) throw error;
  return { success: true };
}

export async function submitWeek(startDate: string, endDate: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  
  const { error } = await supabase
    .from("employee_timesheets")
    .update({ status: 'submitted' })
    .eq("user_id", user.id)
    .gte("work_date", startDate)
    .lte("work_date", endDate)
    .eq("status", "draft");
    
  if (error) throw error;
  return { success: true };
}
