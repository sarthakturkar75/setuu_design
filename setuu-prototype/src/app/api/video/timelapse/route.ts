import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();
    if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

    const supabase = await createClient();
    const { data: userAuth } = await supabase.auth.getUser();
    if (!userAuth?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch all media attachments for updates belonging to the project
    const { data: updates, error } = await supabase
      .from("updates")
      .select("id, created_at, media_attachments(url)")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error || !updates) throw new Error("Failed to fetch updates");

    const imageUrls: string[] = [];
    for (const update of updates) {
      if (update.media_attachments && update.media_attachments.length > 0) {
        imageUrls.push(...update.media_attachments.map((m: any) => m.url));
      }
    }

    if (imageUrls.length < 2) {
      return NextResponse.json({ error: "Need at least 2 images to create a time-lapse." }, { status: 400 });
    }

    // Since we are running in a serverless environment (or node locally), 
    // full fluent-ffmpeg might be heavy. We'll download files to a temp dir and run ffmpeg-static directly.
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "timelapse-"));
    
    // Download images
    let index = 0;
    for (const url of imageUrls) {
      if (index >= 100) break; // Cap at 100 images for performance/demo
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = `img${index.toString().padStart(3, '0')}.jpg`;
        fs.writeFileSync(path.join(tempDir, filename), buffer);
        index++;
      } catch (e) {
        console.error("Failed to download image:", url);
      }
    }

    const outputPath = path.join(tempDir, 'output.mp4');
    const ffmpegPath = require('ffmpeg-static');
    
    // Stitch images (10 fps)
    await execPromise(`"${ffmpegPath}" -framerate 10 -i "${tempDir}/img%03d.jpg" -c:v libx264 -pix_fmt yuv420p "${outputPath}"`);

    // Upload back to Supabase
    const fileBuffer = fs.readFileSync(outputPath);
    const outputFilename = `timelapse-${Date.now()}.mp4`;
    const storagePath = `${projectId}/${outputFilename}`;
    
    const { error: uploadError } = await supabase.storage
      .from("updates")
      .upload(storagePath, fileBuffer, { contentType: 'video/mp4' });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from("updates").getPublicUrl(storagePath);

    // Save metadata to DB
    const { data: record, error: dbError } = await supabase.from("time_lapse_videos").insert({
      project_id: projectId,
      video_url: publicUrlData.publicUrl,
      start_date: updates[0].created_at.split('T')[0],
      end_date: updates[updates.length - 1].created_at.split('T')[0],
      created_by: userAuth.user.id
    }).select().single();

    if (dbError) throw dbError;

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });

    return NextResponse.json({ success: true, data: record });
  } catch (err: any) {
    console.error("Timelapse error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
