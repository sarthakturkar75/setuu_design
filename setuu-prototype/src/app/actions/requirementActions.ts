"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "./authUtils";

export async function getProjectRequirements(projectId: string) {
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
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const specification_value = formData.get("specification_value") as string;
    const customer_requirement = formData.get("customer_requirement") as string;
    const priority = formData.get("priority") as any;
    const source_document = formData.get("source_document") as string;
    const responsible_id = formData.get("responsible_id") as string;
    const remarks = formData.get("remarks") as string;

    const { error } = await supabase.from("project_requirements").insert({
        project_id,
        title,
        category: category || null,
        description: description || null,
        specification_value: specification_value || null,
        customer_requirement: customer_requirement || null,
        priority: priority || "Medium",
        source_document: source_document || null,
        responsible_id: responsible_id || null,
        remarks: remarks || null,
        status: "Draft",
    });

    if (error) return { success: false, error: error.message };

    revalidatePath(`/pm/projects/${project_id}/requirements`);
    revalidatePath(`/admin/projects/${project_id}/requirements`);
    return { success: true };
}