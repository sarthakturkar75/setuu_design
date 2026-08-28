"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProductivityScore(userId: string) {
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("user_actor")
    .select("role")
    .eq("id", userId)
    .single();

  if (!user) return 0;

  // Simulate analytics logic dynamically for now
  // Real implementation would join tasks, issues, invoices, etc. based on role
  let score = 0;

  if (user.role === "engineer") {
    const { data: tasks } = await supabase.from("tasks").select("status").eq("assignee_id", userId);
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === "completed").length;
    score = (completed / tasks.length) * 100;
  } else if (user.role === "pm") {
    const { data: tasks } = await supabase.from("tasks").select("status").eq("created_by", userId);
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === "completed").length;
    score = (completed / tasks.length) * 100;
  } else if (user.role === "vendor") {
    const { data: materials } = await supabase.from("project_materials").select("status, estimated_delivery, actual_delivery").eq("vendor_id", userId);
    if (!materials || materials.length === 0) return 0;
    let onTimeCount = 0;
    materials.forEach((m: any) => {
      if (m.actual_delivery && m.estimated_delivery) {
        if (new Date(m.actual_delivery) <= new Date(m.estimated_delivery)) onTimeCount++;
      } else if (m.status === 'Delivered') {
        onTimeCount++;
      }
    });
    score = (onTimeCount / materials.length) * 100;
  } else {
    // Admin / Client
    score = 100; // Base baseline
  }

  return Math.round(score);
}

export async function getProductivityMatrix() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("user_actor")
    .select("id, display_name, role, is_active");
    
  if (!users) return [];

  const matrix = await Promise.all(
    users.map(async (u) => {
      const score = await getProductivityScore(u.id);
      return {
        id: u.id,
        name: u.display_name || "Unknown",
        role: u.role,
        status: u.is_active ? "Active" : "Inactive",
        score: score
      };
    })
  );

  return matrix.sort((a, b) => b.score - a.score);
}
