"use server";
import { createClient } from "@/lib/supabase/server";

export async function getTimesheets(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("employee_timesheets")
    .select("*, projects(name)")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate);
    
  if (error) throw error;
  return data || [];
}

export async function logTimeEntry(data: any) {
  const supabase = await createClient();
  const { error } = await supabase.from("employee_timesheets").insert(data);
  if (error) throw error;
  return { success: true };
}

export async function submitWeek(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  
  const { error } = await supabase
    .from("employee_timesheets")
    .update({ status: 'submitted' })
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .eq("status", "draft");
    
  if (error) throw error;
  return { success: true };
}
