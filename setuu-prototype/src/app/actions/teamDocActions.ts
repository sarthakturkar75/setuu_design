"use server";
import { createClient } from "@/lib/supabase/server";

export async function getTeamDocuments(orgId: string, projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("team_documents").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
  if (projectId) query = query.eq("project_id", projectId);
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createTeamDocument(data: any) {
  const supabase = await createClient();
  const { error } = await supabase.from("team_documents").insert(data);
  if (error) throw error;
  return { success: true };
}

export async function updateTeamDocument(id: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase.from("team_documents").update(data).eq("id", id);
  if (error) throw error;
  return { success: true };
}

export async function deleteTeamDocument(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("team_documents").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
