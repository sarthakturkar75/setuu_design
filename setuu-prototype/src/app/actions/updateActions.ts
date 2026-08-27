"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";
import { revalidatePath } from "next/cache";
import { scanForSafetyViolations } from "@/lib/safetyScanner";

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
  const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null;
  const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null;
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
  
  const { data, error } = await supabase.from("updates").insert({
    project_id,
    author_id,
    caption,
    milestone_id: milestone_id || null,
    approval_status: "Pending",
    idempotency_key,
    location_name: "Mobile App Capture",
    latitude,
    longitude,
    weather_data,
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
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('updates')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Storage upload failed', uploadError);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('updates')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("media_attachments").insert({
        update_id: data.id,
        file_name: file.name,
        url: publicUrl,
        type: file.type,
        file_size_bytes: file.size
      });
      if (insertError) console.error("Attachment failed", insertError);
      
      // Run AI Safety Scanner sync so we can show toast
      const buffer = Buffer.from(await file.arrayBuffer());
      const hasViolation = await scanForSafetyViolations(project_id, author_id, buffer, data.id, publicUrl);
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

export async function addComment(updateId: string, authorId: string, content: string, mentions: string[] = []) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "vendor"]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("comments").insert({
    update_id: updateId,
    author_id: authorId,
    content,
  }).select().single();
  
  if (error) return { success: false, error: error.message };
  
  // Mentions logic
  if (mentions.length > 0 && data) {
    const mentionInserts = mentions.map(userId => ({
      comment_id: data.id,
      mentioned_user_id: userId
    }));
    await supabase.from("comment_mentions").insert(mentionInserts);
  }

  revalidatePath(`/`); // Simplified
  return { success: true };
}

export async function acknowledgeUpdate(updateId: string, clientId: string) {
  await verifyRole(["admin", "pm", "superadmin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("acknowledgements").insert({
    update_id: updateId,
    client_id: clientId,
    status: "Acknowledged"
  });
  
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}
