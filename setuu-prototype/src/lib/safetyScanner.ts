import { createClient } from "@/lib/supabase/server";

export async function scanForSafetyViolations(projectId: string, authorId: string, imageBuffer: Buffer, updateId: string, imageUrl: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("GROQ_API_KEY missing. Skipping safety scan.");
    return false;
  }

  const base64Image = imageBuffer.toString('base64');
  
  const prompt = `Analyze this construction site photo. Output a raw JSON object only.
{
  "has_workers": boolean,
  "missing_ppe": boolean (true if any worker is lacking a hard hat or high-vis vest),
  "description": string (describe the violation briefly if missing_ppe is true, else empty)
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
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

    if (!response.ok) {
      console.error("Groq Vision API error:", await response.text());
      return false;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Safely parse JSON
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const result = JSON.parse(jsonStr);

    if (result.has_workers && result.missing_ppe) {
      const supabase = await createClient();
      
      // Create a safety issue automatically
      await supabase.from("project_issues").insert({
        project_id: projectId,
        title: "⚠️ Automated Safety Violation Detected",
        description: `AI Scanner detected missing PPE (Hard hat / High-vis). Details: ${result.description}\n\nLinked to Update: ${updateId}`,
        severity: "High",
        status: "Open",
        assigned_to: authorId, // Assigning back to the person who took the photo for now
        created_by: authorId,
        sla_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h SLA
      });
      
      // Update the update record with AI flags
      await supabase.from("updates").update({
        ai_analysis_flags: result
      }).eq("id", updateId);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to run safety scanner:", err);
    return false;
  }
}
