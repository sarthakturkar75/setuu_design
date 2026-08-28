"use server";

import { createClient } from "@/lib/supabase/server";

export async function generatePublicShareLink(projectId: string, expiryDays: number = 7) {
  const supabase = await createClient();
  
  const { data: user, error: authError } = await supabase.auth.getUser();
  if (authError || !user?.user) throw new Error("Unauthorized");

  // Generate a random secure token
  const secureToken = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  const { data, error } = await supabase
    .from("public_shares")
    .insert({
      project_id: projectId,
      secure_token: secureToken,
      expires_at: expiresAt.toISOString(),
      created_by: user.user.id
    })
    .select('secure_token')
    .single();

  if (error) {
    console.error("Failed to create public share:", error);
    throw new Error("Failed to generate share link.");
  }

  return data.secure_token;
}

export async function getPublicProjectData(secureToken: string) {
  const supabase = await createClient(); // Use a service client or bypass RLS if strictly public

  // 1. Validate Token
  const { data: share, error: shareError } = await supabase
    .from("public_shares")
    .select("project_id, expires_at")
    .eq("secure_token", secureToken)
    .single();

  if (shareError || !share) return { error: "Link not found or invalid." };

  if (new Date(share.expires_at) < new Date()) {
    return { error: "This share link has expired." };
  }

  // 2. Fetch Project Data (Bypass RLS explicitly for this safe read-only access)
  // For safety in this prototype, we'll use regular queries assuming RLS allows anon reads for these specific project IDs
  // OR we can implement an RPC function `get_public_project(token)`.
  // Since we are using standard data fetching:
  const { data: project } = await supabase.from("projects").select("*").eq("id", share.project_id).single();
  const { data: milestones } = await supabase.from("milestones").select("*").eq("project_id", share.project_id);
  
  let finalKpis = { progress: 0, budget_variance: 0 };
  const { data: kpis, error: kpiErr } = await supabase.rpc("calculate_project_health", { p_id: share.project_id }).single();
  if (!kpiErr && kpis) {
    finalKpis = kpis as any;
  }

  return { project, milestones, kpis: finalKpis };
}
