import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { drawingId, projectId } = await request.json();
    if (!drawingId || !projectId) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    const { data: drawing } = await adminSupabase.from("drawing_versions").select("file_url").eq("id", drawingId).single();
    if (!drawing) throw new Error("Drawing not found");

    const { data: allDrawings } = await adminSupabase.from("drawing_versions").select("id, drawing_name").eq("project_id", projectId);
    
    // Actually invoke GPT-4o for physical Vision OCR
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Physical OCR Engine requires OPENAI_API_KEY to scan blueprints.");
    }

    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a Blueprint OCR engine. You will receive an image of a blueprint and a list of target drawing names: ${JSON.stringify(allDrawings?.map(d => d.drawing_name))}. If you see text referring to these targets (e.g. "See A-102"), output a JSON array 'hyperlinks' with 'target_name', 'x', 'y', 'width', 'height' (as percentage 0-100 of the image dimensions). If none found, return empty array.`
        },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: drawing.file_url, detail: "low" } }
          ]
        }
      ]
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "{}");
    const foundLinks = parsed.hyperlinks || [];

    const newLinks = [];
    if (allDrawings) {
      for (const link of foundLinks) {
        const targetDrawing = allDrawings.find(d => d.drawing_name === link.target_name);
        if (targetDrawing) {
           newLinks.push({
             source_drawing_id: drawingId,
             target_drawing_id: targetDrawing.id,
             bounding_box_json: { x: link.x, y: link.y, width: link.width, height: link.height, text: `See ${link.target_name}` }
           });
        }
      }
    }

    if (newLinks.length > 0) {
      const { error } = await adminSupabase.from("drawing_hyperlinks").insert(newLinks);
      if (error) throw error;
    }

    return NextResponse.json({ success: true, linksCreated: newLinks.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
