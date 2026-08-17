"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createClientOrg(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const subscription_tier = formData.get("subscription_tier") as string || "Basic";
  
  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name,
      type: "client",
      max_projects: 5,
      subscription_tier,
      status: "Active",
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true, data };
}

export async function getClientOrgs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("type", "client");
    
  if (error) throw error;
  return data;
}

export async function updateClientOrg(id: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("organizations")
    .update(data)
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deactivateClientOrg(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("organizations")
    .update({ status: "Inactive" })
    .eq("id", id);
    
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}
