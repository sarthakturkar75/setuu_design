import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { text, targetLang = "es" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // Fallback if no key (graceful degradation)
      return NextResponse.json({ translatedText: text, isFallback: true });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional construction translator. Translate the following text into ${targetLang}. Return ONLY the translated text, nothing else. Preserve formatting.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI Translation Error:", errorData);
      return NextResponse.json({ translatedText: text, error: "Translation API failed" });
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim() || text;

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error("Translation Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
