"use server";
import { createAdminClient } from '@/lib/supabase/admin';

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";
import { analyzeUpdatePhoto } from "@/lib/safetyScanner";

export async function getUpdates(filters?: { projectId?: string, milestone_id?: string, status?: string }) {
  const supabase = await createClient();
  let query = supabase.from("updates").select("*, user_actor(display_name, avatar_url), media_attachments(*), comments(*), project:projects!updates_project_id_fkey(name)");

  if (filters?.projectId) {
    if (filters.projectId === 'default') {
      const { data: firstProject } = await supabase.from('projects').select('id').limit(1).single();
      if (firstProject) {
        query = query.eq("project_id", firstProject.id);
      }
    } else {
      query = query.eq("project_id", filters.projectId);
    }
  }
  if (filters?.milestone_id) query = query.eq("milestone_id", filters.milestone_id);
  if (filters?.status) query = query.eq("approval_status", filters.status);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(upd => ({
    ...upd,
    project_name: upd.project && typeof upd.project === 'object' && !Array.isArray(upd.project) ? (upd.project as any).name : "Unknown Project"
  }));
}

export async function createUpdate(formData: FormData) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  let project_id = formData.get("project_id") as string;
  const author_id = formData.get("author_id") as string;
  const caption = formData.get("caption") as string;
  const milestone_id = formData.get("milestone_id") as string;
  const update_type = (formData.get("update_type") as string) || 'General';
  const weather_data = formData.get("weather_data") ? JSON.parse(formData.get("weather_data") as string) : null;

  if (project_id === 'default') {
    const { data: firstProject } = await supabase.from('projects').select('id').limit(1).single();
    if (firstProject) {
      project_id = firstProject.id;
    }
  }

  const idempotency_key = formData.get("idempotency_key") as string;
  if (idempotency_key) {
    // Check if we recently saved this exact payload by caption/time or if we use the caption hack for idempotency checking without schema migration
    const { data: existing } = await supabase.from("updates").select("id").eq("idempotency_key", idempotency_key).limit(1).single();
    if (existing) {
      return { success: true, data: existing, safetyViolation: false, message: "Idempotent success" };
    }
  }

  // Use service role for insertion to bypass potentially restrictive RLS since we already verified roles

  const adminSupabase = createAdminClient();

  const { data, error } = await adminSupabase.from("updates").insert({
    project_id,
    author_id,
    caption,
    milestone_id: milestone_id || null,
    idempotency_key,
        weather_data, update_type,
  }).select().single();

  if (error) return { success: false, error: error.message };

  // Storage logic
  let safetyFlagged = false;
  const files = formData.getAll("files") as File[];
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.size === 0) continue;

      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${project_id}/${uniqueFileName}`;

      const { data: uploadData, error: uploadError } = await adminSupabase.storage
        .from('updates')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload failed', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('updates')
        .getPublicUrl(filePath);

      // Map MIME type to strict Database Enum
      let dbMediaType = "document";
      if (file.type.startsWith("image/")) dbMediaType = "image";
      else if (file.type.startsWith("video/")) dbMediaType = "video";

      const { error: insertError } = await adminSupabase.from("media_attachments").insert({
        update_id: data.id,
        file_name: file.name,
        url: publicUrl,
        type: dbMediaType,
        file_size_bytes: file.size
      });
      if (insertError) console.error("Attachment failed", insertError);

      // Run Comprehensive AI Vision Scanner sync so we can show toast and enrich data
      const buffer = Buffer.from(await file.arrayBuffer());
      const { hasViolation } = await analyzeUpdatePhoto(project_id, author_id, buffer, data.id, publicUrl, caption || "");
      if (hasViolation) {
        safetyFlagged = true;
      }
    }
  }

  revalidatePath(`/pm/projects/${project_id}/timeline`);
  revalidatePath(`/admin/projects/${project_id}/timeline`);
  return { success: true, data, safetyViolation: safetyFlagged };
}

export async function moderateUpdate(id: string, status: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("updates").update({ approval_status: status }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/moderation`);
  return { success: true };
}



export async function addComment(updateId: string, content: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase.from("comments").insert({
      update_id: updateId,
      author_id: user.id,
      content: content
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Comment Error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteUpdate(updateId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase.from("updates").delete().eq("id", updateId);
    if (error) throw error;
    
    revalidatePath("/admin/projects/[id]/update", "page");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
