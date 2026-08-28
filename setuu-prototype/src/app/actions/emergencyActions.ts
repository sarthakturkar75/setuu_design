"use server";

import { createClient } from "@/lib/supabase/server";

export async function initiateEmergencyMuster(projectId: string) {
  const supabase = await createClient();
  

  // 1. Get everyone currently on site for this project
  const { data: onSiteLogs, error: turnstileErr } = await supabase
    .from('turnstile_logs')
    .select('user_id')
    .eq('project_id', projectId)
    .is('exit_time', null);

  if (turnstileErr) return { success: false, error: turnstileErr.message };

  if (!onSiteLogs || onSiteLogs.length === 0) {
    return { success: false, error: "No personnel currently logged on site via turnstile." };
  }

  // 2. Create the Muster Roll Event
  const { data: event, error: eventErr } = await supabase
    .from('muster_roll_events')
    .insert({
      project_id: projectId,
      status: 'Active'
    })
    .select('id')
    .single();

  if (eventErr || !event) return { success: false, error: eventErr?.message || "Failed to create event" };

  // 3. Populate Responses table with 'UNKNOWN' status
  const responseInserts = onSiteLogs.map((log: any) => ({
    event_id: event.id,
    user_id: log.user_id,
    status: 'UNKNOWN'
  }));

  const { error: responseErr } = await supabase
    .from('muster_roll_responses')
    .insert(responseInserts);

  if (responseErr) return { success: false, error: responseErr.message };

  return { success: true, eventId: event.id };
}

export async function markUserSafe(eventId: string, userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('muster_roll_responses')
    .update({ 
      status: 'SAFE',
      responded_at: new Date().toISOString()
    })
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getActiveMusterEvents(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('muster_roll_events')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'Active')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

export async function getMusterResponses(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('muster_roll_responses')
    .select(`
      id, 
      status, 
      responded_at, 
      user_id,
      user_actor ( display_name, role, phone_number )
    `)
    .eq('event_id', eventId);

  if (error) return [];
  return data;
}
