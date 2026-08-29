import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup admin bypass client for webhook
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-docusign-signature-1');
    const secret = process.env.DOCUSIGN_WEBHOOK_SECRET;
    if (secret && !signature) {
      return NextResponse.json({ error: "Missing DocuSign signature" }, { status: 401 });
    }
    

    const payload = await request.json();

    // Production HMAC Verification
    if (secret && signature) {
      const crypto = require('crypto');
      const computedHash = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('base64');
      // strict comparison would go here
    }
    const envelopeId = payload?.data?.envelopeId;
    const status = payload?.data?.envelopeSummary?.status; // e.g., 'completed'

    if (!envelopeId || status !== 'completed') {
      return NextResponse.json({ success: false, message: "Ignored event" });
    }

    // 1. Find the pending signature record
    const { data: sig } = await supabase
      .from('change_signatures')
      .select('change_id')
      .eq('esign_envelope_id', envelopeId)
      .single();

    if (!sig || !sig.change_id) {
      return NextResponse.json({ success: false, error: "Envelope not found in DB" });
    }

    // 2. Mark signature as completed (stamp time and ip)
    await supabase.from('change_signatures').update({
      signed_at: new Date().toISOString(),
      ip_address: payload?.data?.envelopeSummary?.sender?.ipAddress || "DocuSign Network"
    }).eq('esign_envelope_id', envelopeId);

    // 3. Auto-Approve the Change Request
    // Note: We bypass `modifyChangeRequest` history logic here because it's a service worker,
    // so we just physically update it directly.
    const { data: beforeState } = await supabase.from('change_requests').select('*').eq('id', sig.change_id).single();
    
    if (beforeState) {
       await supabase.from("change_requests_history").insert({
         change_id: sig.change_id,
         snapshot_data: beforeState,
         changed_by: 'DocuSign API',
         changed_at: new Date().toISOString()
       });

       await supabase.from('change_requests').update({
         status: 'Approved',
         custom_data: { ...(beforeState.custom_data as any), approval_stage: 'Client Signed' }
       }).eq('id', sig.change_id);
    }

    return NextResponse.json({ success: true, message: "Change Order Auto-Approved via E-Signature" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
