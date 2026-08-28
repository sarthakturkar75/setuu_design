"use server";
import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function getReviews(userId: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("design_reviews").select("*").or(`reviewer_id.eq.${userId},author_id.eq.${userId}`);
  if (error) return [];
  return data;
}

export async function getPendingReviews() {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  const { count } = await supabase.from("design_reviews").select("*", { count: "exact" }).eq("reviewer_id", user.id).eq("status", "Pending");
  return count || 0;
}

export async function createReview(payload: any) {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  const supabase = await createClient();
  const { error } = await supabase.from("design_reviews").insert(payload);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitReviewAction(reviewId: string, status: string, comment?: string) {
  await verifyRole(["admin", "pm", "superadmin", "engineer"]);
  const supabase = await createClient();
  const { error: updateErr } = await supabase.from("design_reviews").update({ status, reviewed_at: new Date().toISOString() }).eq("id", reviewId);
  if (updateErr) return { success: false, error: updateErr.message };

  if (comment) {
    const { error: commentErr } = await supabase.from("design_review_comments").insert({ review_id: reviewId, content: comment });
    if (commentErr) return { success: false, error: commentErr.message };
  }
  return { success: true };
}
