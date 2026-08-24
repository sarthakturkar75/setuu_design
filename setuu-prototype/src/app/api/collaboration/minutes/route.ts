export const maxDuration = 60;
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { transcript, projectId } = await request.json();

    if (!transcript || !projectId) {
      return NextResponse.json({ error: "Missing transcript or projectId" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    
    if (!groqKey && !openAiKey) {
      return NextResponse.json({ error: "Missing API key (Groq or OpenAI)" }, { status: 500 });
    }

    const isGroq = !!groqKey;
    const apiKey = isGroq ? groqKey : openAiKey;
    const endpoint = isGroq 
      ? "https://api.groq.com/openai/v1/chat/completions" 
      : "https://api.openai.com/v1/chat/completions";
    const modelName = isGroq ? "llama3-70b-8192" : "gpt-4o-mini";

    const prompt = `
You are a construction project manager. Read the following meeting transcript.
Extract the key action items and decisions.
Return the result strictly as a JSON array of objects with the following schema, and nothing else (no markdown wrapping).
[{
  "title": "Short title of the task",
  "description": "Details of the task",
  "assignee_role": "One of: admin, pm, engineer, vendor, client (infer based on the task nature)"
}]

Transcript:
"${transcript}"
`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Meeting minutes extraction failed" }, { status: 500 });
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content?.trim() || "[]";
    
    // Clean up possible markdown code blocks if the AI ignored the instruction
    const cleanContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
    let actionItems = [];
    
    try {
      actionItems = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse GPT response as JSON", cleanContent);
    }

    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id || null;
    
    // Auto-create these as issues or tasks? We will use project_issues for simplicity in prototype
    for (const item of actionItems) {
      await supabase.from("project_issues").insert({
        project_id: projectId,
        title: `[ACTION ITEM] ${item.title}`,
        description: `${item.description}\n\n(Auto-generated from Meeting Minutes. Suggested Assignee Role: ${item.assignee_role})`,
        status: "Open",
        severity: "Medium",
        created_by: userId
      });
    }

    return NextResponse.json({ success: true, actionItems });
  } catch (error: any) {
    console.error("Minutes Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
