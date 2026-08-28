"use server";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getTeamDocuments() {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_documents").select("*").order("title");
  if (error) return [];
  return data;
}

export async function createTeamDocument(payload: any) {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  const supabase = await createClient();
  const { error } = await supabase.from("team_documents").insert(payload);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateTeamDocument(docId: string, payload: any) {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  const supabase = await createClient();
  const { error } = await supabase.from("team_documents").update(payload).eq("id", docId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteTeamDocument(docId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  const supabase = await createClient();
  const { error } = await supabase.from("team_documents").delete().eq("id", docId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
