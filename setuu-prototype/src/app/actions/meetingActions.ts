"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMeetings(projectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("client_meetings").select("*, client_meeting_agendas(*), project:projects!client_meetings_project_id_fkey(name)").order("meeting_date", { ascending: false });
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  const { data, error } = await query;
    
  if (error) throw error;
  return data.map(m => ({
    ...m,
    project_name: m.project && typeof m.project === 'object' && !Array.isArray(m.project) ? (m.project as any).name : "Unknown Project"
  }));
}

export async function createMeeting(data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("client_meetings")
    .insert({
      ...data,
      status: "Scheduled"
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/handovers`);
  return { success: true };
}

export async function addAgendaItem(meetingId: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("client_meeting_agendas")
    .insert({
      meeting_id: meetingId,
      ...data
    });
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/`); // Simplified
  return { success: true };
}

export async function updateMeetingMinutes(meetingId: string, minutes: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("client_meetings")
    .update({ 
      minutes_url: minutes, // Storing rich text here for now
      status: "Completed" 
    })
    .eq("id", meetingId);
    
  if (error) return { success: false, error: error.message };
  revalidatePath(`/pm/handovers`);
  return { success: true };
}
