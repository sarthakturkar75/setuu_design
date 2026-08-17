"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAuditLogs(filters?: { event_type?: string, actor_id?: string, dateRange?: { start: string, end: string } }) {
  const supabase = await createClient();
  let query = supabase.from("audit_log").select("*, user_actor(display_name)").order("created_at", { ascending: false });
  
  if (filters?.event_type) query = query.eq("event_type", filters.event_type);
  if (filters?.actor_id) query = query.eq("user_id", filters.actor_id);
  if (filters?.dateRange) {
    query = query.gte("created_at", filters.dateRange.start).lte("created_at", filters.dateRange.end);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function exportAuditLogs(filters?: any, format: "csv" | "pdf" = "csv") {
  const supabase = await createClient();
  let query = supabase.from("audit_log").select("*, user_actor(display_name)").order("created_at", { ascending: false });
  
  if (filters?.event_type) query = query.eq("event_type", filters.event_type);
  if (filters?.actor_id) query = query.eq("user_id", filters.actor_id);
  if (filters?.dateRange) {
    query = query.gte("created_at", filters.dateRange.start).lte("created_at", filters.dateRange.end);
  }
  
  const { data, error } = await query;
  if (error) return { success: false, error: error.message };
  
  if (format === "csv") {
    const csvHeader = "Timestamp,Event,Actor,IP Address,Target Table\n";
    const csvRows = (data || []).map(row => 
      `${row.created_at},${row.event_type},${(row.user_actor as any)?.display_name || 'System'},${row.ip_address || ''},${row.table_target || ''}`
    ).join("\n");
    
    return { success: true, format: "csv", data: csvHeader + csvRows };
  }
  
  return { success: false, error: "PDF generation not configured" };
}
