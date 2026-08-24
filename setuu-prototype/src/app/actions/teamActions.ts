"use server";

import { createClient } from "@/lib/supabase/server";

export async function calculateRealTimeBurn(projectId: string) {
  const supabase = await createClient();

  // Fetch all completed shifts (has exit_time) and currently open shifts (no exit_time)
  const { data: logs, error } = await supabase
    .from('turnstile_logs')
    .select(`
      entry_time,
      exit_time,
      user_actor!inner (
        hourly_rate,
        employment_type
      )
    `)
    .eq('project_id', projectId);

  if (error || !logs) return { totalBurn: 0, internalBurn: 0, externalBurn: 0 };

  let totalBurn = 0;
  let internalBurn = 0;
  let externalBurn = 0;

  const now = new Date();

  logs.forEach((log: any) => {
    const entry = new Date(log.entry_time);
    // If exit_time is null, they are actively on site right now! Calculate burn up to this exact second.
    const exit = log.exit_time ? new Date(log.exit_time) : now;

    // Calculate hours (difference in ms / 1000 / 60 / 60)
    const hours = (exit.getTime() - entry.getTime()) / 3600000;

    // Some users might not have a rate set, default to 0
    const rate = log.user_actor?.hourly_rate || 0;
    const cost = hours * rate;

    totalBurn += cost;
    if (log.user_actor?.employment_type === 'Internal Employee') {
      internalBurn += cost;
    } else {
      externalBurn += cost;
    }
  });

  return { totalBurn, internalBurn, externalBurn };
}

export async function getCompanyResourcePool(skillFilter?: string) {
  const supabase = await createClient();
  
  let query = supabase.from('user_actor').select('id, display_name, role, employment_type, skills, hourly_rate, rfid_badge_id');
  
  if (skillFilter) {
    // Search within the skills text array
    query = query.contains('skills', [skillFilter]);
  }
  
  const { data, error } = await query;
  if (error) return { success: false, error: error.message, data: [] };
  
  return { success: true, data: data || [] };
}

export async function updatePersonnelProfile(formData: FormData) {
  const supabase = await createClient();
  
  const userId = formData.get('user_id') as string;
  const hourlyRate = parseFloat(formData.get('hourly_rate') as string) || 0;
  const employmentType = formData.get('employment_type') as string;
  
  // Parse skills from comma-separated string
  const skillsRaw = formData.get('skills') as string;
  const skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(s => s !== "") : [];

  const { error } = await supabase
    .from('user_actor')
    .update({
      hourly_rate: hourlyRate,
      employment_type: employmentType,
      skills: skills
    })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getCompanyTags() {
  const supabase = await createClient();
  // Using rpc or direct select. We'll select from the new table.
  const { data } = await supabase.from('company_skills_tags').select('name').order('name');
  return { success: true, data: data?.map(d => d.name) || [] };
}

export async function createCompanyTag(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  if (!name) return { success: false, error: "Tag name required" };

  const { error } = await supabase.from('company_skills_tags').insert({ name: name.trim() });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
