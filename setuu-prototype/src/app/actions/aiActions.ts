"use server";

import { createClient } from "@/lib/supabase/server";

export async function generateWelcomeBrief(projectId: string, metrics: any) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error("Unauthorized");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable. AI features require a valid OpenAI key to function without mocks.");
  }

  const prompt = `
    You are an AI Construction Project Manager assistant for the "Setuu" platform. 
    Write a concise, professional 2-3 sentence morning briefing for the project manager of "${metrics.name}".
    
    Current Metrics:
    - Completion: ${metrics.progress}%
    - Critical Blockers: ${metrics.criticalIssues}
    - Budget Variance: ${metrics.budgetVar > 0 ? `+${metrics.budgetVar.toFixed(1)}%` : 'On track'}
    - Pending Action Items: ${metrics.actionItemCount}
    
    Tone: Professional, direct, actionable.
    Do not use generic greetings like "Dear PM". Start directly with "Good morning," or a similar professional greeting.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // using gpt-4o as the fastest capable model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw new Error("Failed to generate AI brief.");
  }
}
