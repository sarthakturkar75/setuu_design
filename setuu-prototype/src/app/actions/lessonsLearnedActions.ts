"use server";

import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons_learned")
    .insert(data);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/lessons`);
  return { success: true };
}

export async function getCategories() {
  return [
    "Technical",
    "Financial",
    "Safety",
    "Client Relations",
    "Supply Chain"
  ];
}
