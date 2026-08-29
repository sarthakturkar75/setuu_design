import { createClient } from "@/lib/supabase/server";

export async function analyzeUpdatePhoto(projectId: string, authorId: string, imageBuffer: Buffer, updateId: string, imageUrl: string, captionText: string = "") {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY missing. Skipping AI analysis.");
    return { hasViolation: false, aiData: null };
  }

  const base64Image = imageBuffer.toString('base64');

  const prompt = `You are a professional Project Management AI. 
  Your task is to summarize the provided project update based on the image and the user's caption.
  User's Caption: "${captionText}"
  
  Provide a clean, concise, 1-2 sentence professional summary of what was accomplished or what is shown.
  Output a raw JSON object only, matching exactly this structure:
  {
    "progress_summary": "The concise professional summary."
  }`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 150
      })
    });

    if (!response.ok) return { hasViolation: false, aiData: null };

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const result = JSON.parse(jsonStr);

    const supabase = await createClient();

    // Simply update the update record with the summary
    await supabase.from("updates").update({
      ai_analysis_flags: result
    }).eq("id", updateId);

    return { hasViolation: false, aiData: result };
  } catch (err) {
    return { hasViolation: false, aiData: null };
  }
}
