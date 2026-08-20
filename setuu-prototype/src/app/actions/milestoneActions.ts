"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

export async function getProjectMilestones(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("*, milestone_checklist_items(*)")
    .eq("project_id", projectId)
    .order("display_order", { ascending: true });
    
  if (error) throw error;
  
  return data.map((m: any) => {
    let status = "Pending";
    if (m.completion_status === true) {
      status = "Completed";
    } else if (m.target_date && new Date(m.target_date) < new Date()) {
      status = "Overdue";
    } else {
      status = "In Progress";
    }
    return { ...m, completion_status: status };
  });
}

export async function getMilestones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("*, projects(name)")
    .order("target_date", { ascending: true });
    
  if (error) throw error;
  
  return data.map((m: any) => {
    let status = "Pending";
    if (m.completion_status === true) {
      status = "Completed";
    } else if (m.target_date && new Date(m.target_date) < new Date()) {
      status = "Overdue";
    } else {
      status = "In Progress";
    }
    return { ...m, completion_status: status };
  });
}

export async function createMilestone(projectId: string, milestoneData: any) {
  await verifyRole(["admin", "pm"]);
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
  await verifyRole(["admin", "pm"]);
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
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  
  const promises = orderedIds.map((id, index) => 
    supabase.from("milestones").update({ display_order: index }).eq("id", id)
  );
  
  const results = await Promise.all(promises);
  
  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    return { success: false, error: "Failed to reorder some milestones", details: errors.map(e => e.error?.message) };
  }
  
  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true };
}

export async function toggleChecklistItem(itemId: string, completed: boolean) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("milestone_checklist_items")
    .update({ is_complete: completed })
    .eq("id", itemId);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}

export async function addChecklistItem(milestoneId: string, title: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
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

export async function deleteMilestone(milestoneId: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { data: milestone, error: fetchError } = await supabase.from("milestones").select("project_id").eq("id", milestoneId).single();
  
  if (fetchError) return { success: false, error: fetchError.message };

  const { error } = await supabase.from("milestones").delete().eq("id", milestoneId);
  if (error) return { success: false, error: error.message };
  
  if (milestone?.project_id) {
    revalidatePath(`/pm/projects/${milestone.project_id}/milestones`);
    revalidatePath(`/admin/projects/${milestone.project_id}/milestones`);
  }
  
  return { success: true };
}

