import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qrUuid = searchParams.get('qr');

    if (!qrUuid) {
      return NextResponse.json({ success: false, error: "Missing QR Code UUID" }, { status: 400 });
    }

    const { data: material, error } = await supabase
      .from('project_materials')
      .select('id, item_name, status')
      .eq('qr_uuid', qrUuid)
      .single();

    if (error || !material) {
      return NextResponse.json({ success: false, error: "Invalid QR or Material not found" }, { status: 404 });
    }

    if (material.status === 'On Site') {
        return new NextResponse(
            `<html>
              <head><meta name="viewport" content="width=device-width, initial-scale=1"><style>body { font-family: sans-serif; text-align: center; padding: 20px; }</style></head>
              <body><h1>Already Received</h1><p>${escapeHtml(material.item_name)} is already logged as On Site.</p></body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    }

    return new NextResponse(
      `<html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Receive ${escapeHtml(material.item_name)}</title>
          <style>
             body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f8fafc; color: #0f172a; text-align: center; padding: 20px; }
             h1 { font-size: 24px; margin-bottom: 10px; }
             button { background-color: #0284c7; color: white; border: none; padding: 12px 24px; font-size: 16px; border-radius: 8px; cursor: pointer; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div>
            <h1>Confirm Material Receipt</h1>
            <p><strong>${escapeHtml(material.item_name)}</strong></p>
            <form method="POST" action="">
                <button type="submit">Mark as Received On Site</button>
            </form>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { createClient as createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const serverSupabase = await createServerClient();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized. Must be logged in to receive materials." }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const qrUuid = searchParams.get('qr');

    if (!qrUuid) {
      return NextResponse.json({ success: false, error: "Missing QR Code UUID" }, { status: 400 });
    }

    const { data: material, error } = await supabase
      .from('project_materials')
      .update({ status: 'On Site', actual_delivery: new Date().toISOString() })
      .eq('qr_uuid', qrUuid)
      .select('id, item_name')
      .single();

    if (error || !material) {
      return NextResponse.json({ success: false, error: "Invalid QR or Material not found" }, { status: 404 });
    }

    return new NextResponse(
      `<html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Received ${escapeHtml(material.item_name)}</title>
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
            <p><strong>${escapeHtml(material.item_name)}</strong> has been officially logged as "On Site" in the system.</p>
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
