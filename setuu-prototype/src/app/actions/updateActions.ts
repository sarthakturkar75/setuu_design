"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUpdates(projectId: string, filters?: { milestone_id?: string, status?: string }) {
  const supabase = await createClient();
  let query = supabase.from("updates").select("*, user_actor(display_name, avatar_url), media_attachments(*), comments(*)").eq("project_id", projectId);
  
  if (filters?.milestone_id) query = query.eq("milestone_id", filters.milestone_id);
  if (filters?.status) query = query.eq("approval_status", filters.status);
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createUpdate(formData: FormData) {
  const supabase = await createClient();
  const project_id = formData.get("project_id") as string;
  const author_id = formData.get("author_id") as string;
  const caption = formData.get("caption") as string;
  const milestone_id = formData.get("milestone_id") as string;
  
  const { data, error } = await supabase.from("updates").insert({
    project_id,
    author_id,
    caption,
    milestone_id: milestone_id || null,
    approval_status: "Pending",
  }).select().single();
  
  if (error) return { success: false, error: error.message };
  
  // In a full environment with Storage buckets configured, we would process uploads:
  const files = formData.getAll("files") as File[];
  if (files && files.length > 0) {
    for (const file of files) {
      if (file.size === 0) continue;
      // We simulate successful upload processing for the prototype
      const { error: insertError } = await supabase.from("media_attachments").insert({
        update_id: data.id,
        file_name: file.name,
        file_url: `/mock-storage/${project_id}/${file.name}`,
        file_type: file.type,
        file_size: file.size
      });
      if (insertError) console.error("Attachment failed", insertError);
    }
  }

  revalidatePath(`/pm/projects/${project_id}/timeline`);
  return { success: true, data };
}

export async function moderateUpdate(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("updates").update({ approval_status: status }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/admin/moderation`);
  return { success: true };
}

export async function addComment(updateId: string, authorId: string, content: string, mentions: string[] = []) {
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
