"use server";
import { createClient } from "@/lib/supabase/server";

export async function getReviews(projectId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { incoming: [], outgoing: [] };

  const { data: actor } = await supabase.from('user_actor').select('id, role').eq('id', user.id).single();
  if (!actor) return { incoming: [], outgoing: [] };

  // Incoming: where reviewer_id = me
  let incQuery = supabase.from("design_reviews").select("*, author:user_actor!author_id(display_name)").eq("reviewer_id", actor.id);
  if (projectId) incQuery = incQuery.eq("project_id", projectId);
  
  // Outgoing: where author_id = me
  let outQuery = supabase.from("design_reviews").select("*, reviewer:user_actor!reviewer_id(display_name)").eq("author_id", actor.id);
  if (projectId) outQuery = outQuery.eq("project_id", projectId);

  const [incRes, outRes] = await Promise.all([incQuery, outQuery]);
  
  return {
    incoming: incRes.data || [],
    outgoing: outRes.data || []
  };
}

export async function createReview(data: any) {
  const supabase = await createClient();
  const { error } = await supabase.from("design_reviews").insert(data);
  if (error) throw error;
  return { success: true };
}

export async function submitReviewAction(reviewId: string, action: "approve" | "request_changes", comment: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const status = action === "approve" ? "approved" : "changes_requested";
  
  await supabase.from("design_reviews").update({ status }).eq("id", reviewId);
  await supabase.from("design_review_comments").insert({
    review_id: reviewId,
    author_id: user.id,
    content: comment,
    action
  });
  return { success: true };
}

export async function getPendingReviews() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  
  const { count } = await supabase
    .from("design_reviews")
    .select("*", { count: "exact", head: true })
    .eq("reviewer_id", user.id)
    .eq("status", "pending");
    
  return count || 0;
}
