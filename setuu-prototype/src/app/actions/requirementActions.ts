"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

export async function getProjectRequirements(projectId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("project_requirements")
        .select("*, responsible:user_actor!project_requirements_responsible_id_fkey(display_name)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function createRequirement(formData: FormData) {
    await verifyRole(["admin", "pm", "superadmin"]);
    const supabase = await createClient();

    const project_id = formData.get("project_id") as string;
    const { error } = await supabase.from("project_requirements").insert({
        project_id,
        title: formData.get("title") as string,
        category: (formData.get("category") as string) || null,
        description: (formData.get("description") as string) || null,
        specification_value: (formData.get("specification_value") as string) || null,
        customer_requirement: (formData.get("customer_requirement") as string) || null,
        priority: (formData.get("priority") as any) || "Medium",
        source_document: (formData.get("source_document") as string) || null,
        responsible_id: (formData.get("responsible_id") as string) || null,
        remarks: (formData.get("remarks") as string) || null,
        status: "Draft",
    });

    if (error) return { success: false, error: error.message };

    revalidatePath(`/pm/projects/${project_id}/requirements`);
    revalidatePath(`/admin/projects/${project_id}/requirements`);
    return { success: true };
}


export async function updateRequirementStatus(reqId: string, projectId: string, status: string, remarks?: string) {
    // Engineers can update status, so we allow them here
    await verifyRole(["admin", "pm", "superadmin", "engineer"]);
    const supabase = await createClient();

    const updatePayload: any = { status };
    if (remarks !== undefined) updatePayload.remarks = remarks;

    const { error } = await supabase
        .from("project_requirements")
        .update(updatePayload)
        .eq("id", reqId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/pm/projects/${projectId}/requirements`);
    revalidatePath(`/admin/projects/${projectId}/requirements`);
    revalidatePath(`/engineer/projects/${projectId}/requirements`);
    return { success: true };
}