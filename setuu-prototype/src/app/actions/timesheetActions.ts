"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTimesheets(userId: string, dateRange?: { start: string, end: string }) {
  const supabase = await createClient();
  let query = supabase.from("employee_timesheets").select("*").eq("user_id", userId);
  
  if (dateRange) {
    query = query.gte("date", dateRange.start).lte("date", dateRange.end);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function logTimeEntry(data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("employee_timesheets")
    .insert({
      ...data,
      status: "Draft"
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/engineer/timesheet`);
  return { success: true };
}

export async function submitWeek(userId: string, weekStart: string) {
  const supabase = await createClient();
  
  const startDate = new Date(weekStart);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  
  const { error } = await supabase
    .from("employee_timesheets")
    .update({ status: "Submitted" })
    .eq("user_id", userId)
    .eq("status", "Draft")
    .gte("date", startDate.toISOString().split('T')[0])
    .lt("date", endDate.toISOString().split('T')[0]);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/engineer/timesheet`);
  return { success: true };
}

export async function approveTimesheet(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("employee_timesheets")
    .update({ status: "Approved" })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/resources`);
  return { success: true };
}
