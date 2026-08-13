"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClientOrg(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name,
      description,
      type: "client",
      config: {},
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  redirect(`/admin/users`);
}
