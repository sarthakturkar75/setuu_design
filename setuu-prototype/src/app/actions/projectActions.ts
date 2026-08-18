"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Database } from "@/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const client_org_id = formData.get("client_org_id") as string;
  const assigned_pm_id = formData.get("assigned_pm_id") as string;
  const target_date = formData.get("target_date") as string;
  const contract_value = parseFloat(formData.get("contract_value") as string);
  const po_reference = formData.get("po_reference") as string;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      description,
      type: type || "General",
      client_org_id: client_org_id || null,
      assigned_pm_id: assigned_pm_id || null,
      target_date: target_date || null,
      contract_value: isNaN(contract_value) ? null : contract_value,
      po_reference: po_reference || null,
      status: "Not Started",
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProjectConfig(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const contract_value = parseFloat(formData.get("contract_value") as string);
  const target_date = formData.get("target_date") as string;
  const po_reference = formData.get("po_reference") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      description,
      contract_value: isNaN(contract_value) ? null : contract_value,
      target_date: target_date || null,
      po_reference: po_reference || null,
      status: status || "Not Started",
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/projects/${id}`);
  revalidatePath(`/admin/projects/${id}/config`);
  return { success: true };
}

export async function getProjects(filters?: { status?: string, pm_id?: string, is_archived?: boolean }) {
  const supabase = await createClient();
  let query = supabase.from("projects").select("*, assigned_pm:user_actor!projects_assigned_pm_id_fkey(display_name)");
  
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.pm_id) query = query.eq("assigned_pm_id", filters.pm_id);
  if (filters?.is_archived !== undefined) query = query.eq("is_archived", filters.is_archived);

  const { data, error } = await query;
  if (error) throw error;
  
  // Map the joined data to include a flat pm_name field for easy UI rendering
  return data.map(p => ({
    ...p,
    pm_name: p.assigned_pm && typeof p.assigned_pm === 'object' && !Array.isArray(p.assigned_pm)
      ? (p.assigned_pm as any).display_name 
      : null
  }));
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) throw error;
  return data as Project;
}

export async function archiveProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_archived: true })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/projects");
  return { success: true };
}
