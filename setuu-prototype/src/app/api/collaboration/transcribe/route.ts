export const maxDuration = 60;
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    
    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    
    if (!groqKey && !openAiKey) {
      return NextResponse.json({ error: "Missing API key (Groq or OpenAI)" }, { status: 500 });
    }

    const isGroq = !!groqKey;
    const apiKey = isGroq ? groqKey : openAiKey;
    const endpoint = isGroq 
      ? "https://api.groq.com/openai/v1/audio/transcriptions" 
      : "https://api.openai.com/v1/audio/transcriptions";
    const modelName = isGroq ? "whisper-large-v3" : "whisper-1";

    const openaiFormData = new FormData();
    const fileName = (file as any).name || "audio.webm";
    openaiFormData.append("file", file, fileName);
    openaiFormData.append("model", modelName);
    openaiFormData.append("response_format", "text");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: openaiFormData as any,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI Whisper Error:", errorData);
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }

    const transcribedText = await response.text();
    return NextResponse.json({ text: transcribedText.trim() });
  } catch (error: any) {
    console.error("Transcription Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
