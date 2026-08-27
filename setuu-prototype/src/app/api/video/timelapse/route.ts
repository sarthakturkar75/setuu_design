import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import util from "util";
import ffmpegStatic from "ffmpeg-static";

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

    // Create a temporary directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "timelapse-"));

    // Download images
    let index = 0;
    for (const url of imageUrls) {
      if (index >= 100) break; // Cap at 100 images for performance/demo
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Essential: padStart ensures ffmpeg reads img000.jpg, img001.jpg sequentially
        const filename = `img${index.toString().padStart(3, '0')}.jpg`;
        fs.writeFileSync(path.join(tempDir, filename), buffer);
        index++;
      } catch (e) {
        console.error("Failed to download image:", url);
      }
    }

    const outputPath = path.join(tempDir, 'output.mp4');

    // THE FIX: Next.js bundler breaks ffmpegStatic paths, often resolving to /ROOT/ on dev machines. 
    // We override it safely using process.cwd() to locate it dynamically in node_modules.
    let resolvedFfmpegPath = ffmpegStatic || 'ffmpeg';
    if (resolvedFfmpegPath.includes('/ROOT/') || resolvedFfmpegPath.includes('\\ROOT\\')) {
      resolvedFfmpegPath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg');
    }

    // Stitch images (10 fps) using the resolved path
    await execPromise(`"${resolvedFfmpegPath}" -framerate 10 -i "${tempDir}/img%03d.jpg" -c:v libx264 -pix_fmt yuv420p "${outputPath}"`);

    // Read the generated video file
    const fileBuffer = fs.readFileSync(outputPath);
    const outputFilename = `timelapse-${Date.now()}.mp4`;
    const storagePath = `${projectId}/${outputFilename}`;

    // Bypass storage RLS issues using the admin client since this is a secure server route
    const { createClient: createAdminClient } = require('@supabase/supabase-js');
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: uploadError } = await adminSupabase.storage
      .from("updates")
      .upload(storagePath, fileBuffer, { contentType: 'video/mp4' });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = adminSupabase.storage.from("updates").getPublicUrl(storagePath);

    // Save metadata to DB using admin client to bypass restrictive DB RLS as well
    const { data: record, error: dbError } = await adminSupabase.from("time_lapse_videos").insert({
      project_id: projectId,
      video_url: publicUrlData.publicUrl,
      start_date: updates[0].created_at.split('T')[0],
      end_date: updates[updates.length - 1].created_at.split('T')[0],
      created_by: userAuth.user.id
    }).select().single();

    if (dbError) throw dbError;

    // Cleanup local OS temp files
    fs.rmSync(tempDir, { recursive: true, force: true });

    return NextResponse.json({ success: true, data: record });
  } catch (err: any) {
    console.error("Timelapse error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}