"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveChangeRequest(id: string) {
  const supabase = await createClient();
  
  // Here we would typically set approved_by to the current user's ID
  // For now we just update the status
  const { error } = await supabase
    .from("change_requests")
    .update({ status: "Approved" })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/changes");
  return { success: true };
}
