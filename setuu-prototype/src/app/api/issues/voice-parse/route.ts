import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ success: false, error: "Missing transcript" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY environment variable. Voice-to-Issue NLP requires a valid OpenAI key to function without mocks.");
    }

    const prompt = `
      You are a structural engineering NLP processor. Extract the intent from this dictated text into a JSON object matching this strict schema:
      {
        "title": "Short concise title (max 5 words)",
        "description": "Full detailed description based on transcript",
        "severity": "Critical" | "High" | "Medium" | "Low" (Guess based on urgency words like 'cracked', 'falling', 'leaking' = Critical/High),
        "location": "Any location mentioned",
        "estimated_rework_cost": "Extract numeric cost if mentioned, else 0"
      }
      
      Transcript: "${transcript}"
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      throw new Error(`Groq API failed: ${errTxt}`);
    }

    const data = await response.json();
    const parsedIssue = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ success: true, parsedData: parsedIssue });
  } catch (error: any) {
    console.error("Voice parsing failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
