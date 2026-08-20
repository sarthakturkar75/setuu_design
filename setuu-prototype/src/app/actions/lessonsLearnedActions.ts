"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";

export async function getLessons(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("lessons_learned").select("*");
  
  if (projectId) query = query.eq("project_id", projectId);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createLesson(data: any) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons_learned")
    .insert(data);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/lessons`);
  return { success: true };
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("lessons_learned").select("category");
  if (error) throw error;
  
  return Array.from(new Set(data.map((d: any) => d.category))).filter(Boolean) as string[];
}
