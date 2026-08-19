"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAuditLogs(filters?: { event_type?: string, actor_id?: string, dateRange?: { start: string, end: string }, resource_id?: string }) {
  const supabase = await createClient();
  let query = supabase.from("audit_log").select("*").order("created_at", { ascending: false });
  
  if (filters?.event_type) query = query.eq("event_type", filters.event_type);
  if (filters?.actor_id) query = query.eq("user_id", filters.actor_id);
  if (filters?.resource_id) query = query.eq("resource_id", filters.resource_id);
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
  const { data: scans, error } = await supabase.from("virus_scan_results").select("*");
  
  if (error) throw error;
  
  // Since file_id doesn't have an explicit foreign key in the schema, fetch media_attachments separately
  const fileIds = scans.map(s => s.file_id).filter(id => id);
  let filesMap: Record<string, any> = {};
  
  if (fileIds.length > 0) {
    const { data: files } = await supabase
      .from("media_attachments")
      .select("id, file_name, project_id")
      .in("id", fileIds);
      
    if (files) {
      files.forEach(f => {
        filesMap[f.id] = f;
      });
    }
  }
  
  return scans.map(scan => {
    const fileInfo = filesMap[scan.file_id];
    return {
      ...scan,
      file_name: fileInfo?.file_name || "Unknown File",
      project_id: fileInfo?.project_id || "Unknown Project"
    };
  });
}
