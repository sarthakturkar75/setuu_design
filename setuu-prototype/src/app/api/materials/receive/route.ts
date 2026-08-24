import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qrUuid = searchParams.get('qr');

    if (!qrUuid) {
      return NextResponse.json({ success: false, error: "Missing QR Code UUID" }, { status: 400 });
    }

    // Mark as delivered/on site
    const { data: material, error } = await supabase
      .from('project_materials')
      .update({ status: 'On Site', actual_delivery: new Date().toISOString() })
      .eq('qr_uuid', qrUuid)
      .select('id, item_name')
      .single();

    if (error || !material) {
      return NextResponse.json({ success: false, error: "Invalid QR or Material not found" }, { status: 404 });
    }

    // Return a nice HTML success page
    return new NextResponse(
      `<html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Received ${material.item_name}</title>
          <style>
             body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f0fdf4; color: #166534; text-align: center; padding: 20px; }
             h1 { font-size: 24px; margin-bottom: 10px; }
             .success-icon { font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div>
            <div class="success-icon">✅</div>
            <h1>Material Received!</h1>
            <p><strong>${material.item_name}</strong> has been officially logged as "On Site" in the system.</p>
            <p style="margin-top: 30px; font-size: 14px; opacity: 0.8;">You can close this window.</p>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
