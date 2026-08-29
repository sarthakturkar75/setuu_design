"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRole } from "./authUtils";

export async function generateWelcomeBrief(metrics: any) {
  await verifyRole(["admin", "pm", "superadmin", "engineer", "client", "vendor"]); // Auto-injected baseline auth
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error("Unauthorized");

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable. AI features require a valid OpenAI key to function without mocks.");
  }

  const prompt = `
    You are an AI Project Manager assistant for the "Setuu" platform. 
    Write a concise, professional 2-3 sentence morning briefing for the project manager of the project named "${metrics.name}".
    
    Current Metrics:
    - Completion: ${metrics.progress}%
    - Critical Blockers: ${metrics.criticalIssues}
    - Budget Variance: ${metrics.budgetVar > 0 ? `+${metrics.budgetVar.toFixed(1)}%` : 'On track'}
    - Pending Action Items: ${metrics.actionItemCount}
    
    Tone: Professional, direct, actionable.
    Instructions: 
    1. Start directly with "Good morning."
    2. Do NOT use markdown formatting (no asterisks, no bolding).
    3. Keep it to exactly two or three clean sentences.
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b", // Upgraded to Groq's current flagship text model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      console.error("Groq API Error Details:", errTxt);
      throw new Error(`Groq API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw new Error("Failed to generate AI brief.");
  }
}
