"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAuditLogs(filters?: { event_type?: string, actor_id?: string, dateRange?: { start: string, end: string } }) {
  const supabase = await createClient();
  let query = supabase.from("audit_log").select("*").order("created_at", { ascending: false });
  
  if (filters?.event_type) query = query.eq("event_type", filters.event_type);
  if (filters?.actor_id) query = query.eq("user_id", filters.actor_id);
  if (filters?.dateRange) {
    query = query.gte("created_at", filters.dateRange.start).lte("created_at", filters.dateRange.end);
  }
  
  const { data, error } = await query;
  if (error) throw error;

  const { data: users } = await supabase.from("user_actor").select("id, display_name");

  return data.map(log => ({
    ...log,
    user_actor: { display_name: users?.find(u => u.id === log.user_id)?.display_name || 'System' }
  }));
}

export async function exportAuditLogs(filters?: any, format: "csv" | "pdf" = "csv") {
  const supabase = await createClient();
  let query = supabase.from("audit_log").select("*").order("created_at", { ascending: false });
  
  if (filters?.event_type) query = query.eq("event_type", filters.event_type);
  if (filters?.actor_id) query = query.eq("user_id", filters.actor_id);
  if (filters?.dateRange) {
    query = query.gte("created_at", filters.dateRange.start).lte("created_at", filters.dateRange.end);
  }
  
  const { data, error } = await query;
  if (error) return { success: false, error: error.message };

  const { data: users } = await supabase.from("user_actor").select("id, display_name");
  
  if (format === "csv") {
    const csvHeader = "Timestamp,Event,Actor,IP Address,Target Table\n";
    const csvRows = (data || []).map(row => {
      const displayName = users?.find(u => u.id === row.user_id)?.display_name || 'System';
      return `${row.created_at},${row.event_type},${displayName},${row.ip_address || ''},${row.table_name || ''}`;
    }).join("\n");
    
    return { success: true, format: "csv", data: csvHeader + csvRows };
  }
  
  return { success: false, error: "PDF generation not configured" };
}

export async function getVirusScanResults() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("virus_scan_results").select("*, file:media_attachments!virus_scan_results_file_id_fkey(file_name, file_url, project_id)");
  
  if (error) throw error;
  
  return data.map(scan => ({
    ...scan,
    file_name: scan.file && typeof scan.file === 'object' && !Array.isArray(scan.file) ? (scan.file as any).file_name : "Unknown File",
    project_id: scan.file && typeof scan.file === 'object' && !Array.isArray(scan.file) ? (scan.file as any).project_id : "Unknown Project"
  }));
}
