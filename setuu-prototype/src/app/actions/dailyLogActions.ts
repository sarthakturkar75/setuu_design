"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateDailyReport(projectId: string, targetDate: string) {
  const supabase = await createClient();
  const { data: userAuth } = await supabase.auth.getUser();
  if (!userAuth?.user) throw new Error("Unauthorized");

  // Check if a log already exists for this date so we can UPDATE it instead of creating duplicates
  const { data: existingLog } = await supabase
    .from("daily_logs")
    .select("id")
    .eq("project_id", projectId)
    .eq("date", targetDate)
    .maybeSingle();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable.");
  }

  // 1. Fetch updates for the given date
  const startOfDay = new Date(targetDate);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const { data: updates } = await supabase
    .from("updates")
    .select("caption, weather_data")
    .eq("project_id", projectId)
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  // 2. Fetch labor hours for the given date
  const { data: timesheets } = await supabase
    .from("employee_timesheets")
    .select("hours_logged, notes")
    .eq("project_id", projectId)
    .eq("work_date", targetDate);

  // 3. Fetch issues logged on this date
  const { data: issues } = await supabase
    .from("project_issues")
    .select("title, severity, status")
    .eq("project_id", projectId)
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  // Aggregate Data
  let totalHours = 0;
  timesheets?.forEach(t => { totalHours += (t.hours_logged || 0); });

  const weatherSamples = (updates || []).map(u => u.weather_data).filter(Boolean);
  const weatherSummary = weatherSamples.length > 0 ? weatherSamples[0] : null;

  const prompt = `
    You are an AI Project Manager writing an End-Of-Day Project Status Report.
    Write a clear, structured daily log based on the following raw data.
    
    Date: ${targetDate}
    Total Labor Hours Logged Today: ${totalHours}
    Weather Observed: ${JSON.stringify(weatherSummary)}
    
    Site Updates Logged:
    ${(updates || []).map(u => "- " + u.caption).join("\n")}
    
    Issues/Defects Logged Today:
    ${(issues || []).map(i => `- [${i.severity}] ${i.title} (${i.status})`).join("\n")}
    
    Output Format:
    Create a markdown document with the following sections:
    ## Executive Summary
    ## Weather Conditions
    ## Labor & Productivity
    ## Work Completed
    ## Safety & Issues
    
    Keep it professional, concise, and do not invent any data not provided above.
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API responded with status ${response.status}`);
    }

    const data = await response.json();
    const reportMarkdown = data.choices[0].message.content;

    // We use the admin client to bypass RLS because the daily_logs table lacks an explicit UPDATE policy for users
    const adminSupabase = createAdminClient();

    // Save or Update Database
    let savedLog, dbError;
    if (existingLog) {
      const result = await adminSupabase
        .from("daily_logs")
        .update({
          weather_summary_json: weatherSummary || {},
          labor_hours_total: totalHours,
          ai_generated_report: reportMarkdown,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingLog.id)
        .select()
        .maybeSingle();
      savedLog = result.data;
      dbError = result.error;
    } else {
      const result = await adminSupabase
        .from("daily_logs")
        .insert({
          project_id: projectId,
          date: targetDate,
          weather_summary_json: weatherSummary || {},
          labor_hours_total: totalHours,
          ai_generated_report: reportMarkdown,
          created_by: userAuth.user.id
        })
        .select()
        .maybeSingle();
      savedLog = result.data;
      dbError = result.error;
    }

    if (dbError) throw dbError;

    return savedLog;
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw new Error("Failed to generate Daily Log.");
  }
}

export async function getDailyLogs(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("project_id", projectId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteDailyLog(logId: string) {
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.from("daily_logs").delete().eq("id", logId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
