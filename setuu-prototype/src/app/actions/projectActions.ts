"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/projects/${id}`);
  revalidatePath(`/admin/projects/${id}/config`);
  return { success: true };
}
