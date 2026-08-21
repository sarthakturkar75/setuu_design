"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";

export async function emergencyLockOrganization(
    organizationId: string,
    actorId: string,
    reason: string,
) {
  await verifyRole(["admin", "pm", "superadmin"]);
    const supabase = await createClient();

    const { data: org, error: fetchError } = await supabase
        .from("organizations")
        .select("status")
        .eq("id", organizationId)
        .single();

    if (fetchError) return { success: false, error: fetchError.message };

    const { error: updateError } = await supabase
        .from("organizations")
        .update({ status: "Locked" })
        .eq("id", organizationId);

    if (updateError) return { success: false, error: updateError.message };

    const { error: auditError } = await supabase.from("audit_log").insert({
        user_id: actorId,
        event_type: "emergency_lock",
        table_name: "organizations",
        resource_id: organizationId,
        old_data: { status: org?.status ?? null },
        new_data: { status: "Locked", reason },
    });

    if (auditError) {
        console.error("Failed to write audit log for emergency lock:", auditError);
    }

    revalidatePath("/admin");
    return { success: true };
}
export async function updateOrganization(id: string, data: any) {
  await verifyRole(["admin", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").update(data).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/settings");
  return { success: true };
}
