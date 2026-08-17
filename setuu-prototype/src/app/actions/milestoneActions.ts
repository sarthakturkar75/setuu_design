"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMilestones(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("*, milestone_checklist_items(*)")
    .eq("project_id", projectId)
    .order("display_order", { ascending: true });
    
  if (error) throw error;
  return data;
}

export async function createMilestone(projectId: string, milestoneData: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("milestones")
    .insert({
      project_id: projectId,
      ...milestoneData,
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true };
}

export async function updateMilestone(id: string, updateData: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("milestones")
    .update(updateData)
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified invalidation for prototype
  return { success: true };
}

export async function reorderMilestones(projectId: string, orderedIds: string[]) {
  const supabase = await createClient();
  
  // In a real app we'd want a transaction or RPC call here
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from("milestones").update({ display_order: i }).eq("id", orderedIds[i]);
  }
  
  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true };
}

export async function toggleChecklistItem(itemId: string, completed: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("milestone_checklist_items")
    .update({ is_completed: completed })
    .eq("id", itemId);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}

export async function addChecklistItem(milestoneId: string, title: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("milestone_checklist_items")
    .insert({
      milestone_id: milestoneId,
      title,
      is_completed: false,
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}
