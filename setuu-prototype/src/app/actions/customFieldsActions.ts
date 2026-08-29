"use server";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getCustomFieldsSchema(projectId: string, entityType: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("custom_fields_schema")
    .select("*")
    .eq("project_id", projectId)
    .eq("entity_type", entityType);

  if (error) {
    console.error("Error fetching custom fields:", error);
    return [];
  }
  return data || [];
}

export async function addCustomField(projectId: string, entityType: string, fieldName: string, fieldType: string, isRequired: boolean) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_fields_schema")
    .insert({
      project_id: projectId,
      entity_type: entityType,
      field_name: fieldName,
      field_type: fieldType,
      is_required: isRequired
    });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCustomField(id: string) {
  await verifyRole(["admin", "pm"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_fields_schema")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
