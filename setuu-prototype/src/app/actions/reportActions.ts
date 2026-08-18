"use server";

import { createClient } from "@/lib/supabase/server";

export async function generateProjectReport(projectId: string, modules: string[]) {
  const supabase = await createClient();
  
  // Actually verify project exists and grab basics to compile report
  const { data: project, error } = await supabase
    .from("projects")
    .select("*, milestones(*), project_materials(*)")
    .eq("id", projectId)
    .single();
    
  if (error || !project) return { success: false, error: "Project not found for reporting" };
  
  // We can return a structured data payload that a PDF renderer could use
  return { 
    success: true, 
    downloadUrl: `/api/reports/project-${projectId}.pdf`,
    reportPayload: { project, requestedModules: modules, generatedAt: new Date().toISOString() } 
  };
}

export async function getScheduledReports() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scheduled_reports")
    .select("*");
    
  if (error) throw error;
  return data;
}

export async function scheduleReport(config: any) {
  if (!config.name) return { success: false, error: "Report name required" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("scheduled_reports")
    .insert(config);
    
  if (error) return { success: false, error: error.message };
  return { success: true };
}
