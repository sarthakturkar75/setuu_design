import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
// Using Service Role Key because physical turnstiles do not have user browser sessions
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rfid_badge_id, project_id, direction } = body;

    if (!rfid_badge_id || !project_id || !direction) {
      return NextResponse.json({ access: "DENIED", reason: "Missing parameters (rfid_badge_id, project_id, direction)" }, { status: 400 });
    }

    // 1. Find User by RFID
    const { data: user, error: userErr } = await supabase
      .from('user_actor')
      .select('id, first_name, last_name, role')
      .eq('rfid_badge_id', rfid_badge_id)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ access: "DENIED", reason: "Unknown RFID Badge. Please contact Site Admin." }, { status: 403 });
    }

    if (direction === 'IN') {
      // 2. Strict Compliance Check: Deny entry if ANY certification is expired
      const { data: expiredCerts, error: certErr } = await supabase
        .from('personnel_certifications')
        .select('cert_name')
        .eq('user_id', user.id)
        .lt('expiry_date', new Date().toISOString());

      if (expiredCerts && expiredCerts.length > 0) {
        const certNames = expiredCerts.map((c: any) => c.cert_name).join(', ');
        return NextResponse.json({
          access: "DENIED",
          reason: `Access Blocked: Expired Safety Certification (${certNames})`
        }, { status: 403 });
      }

      // 3. Log Physical Entry
      const { error: insertErr } = await supabase
        .from('turnstile_logs')
        .insert({
          user_id: user.id,
          project_id,
          entry_time: new Date().toISOString()
        });

      if (insertErr) throw insertErr;

    } else if (direction === 'OUT') {
      // 4. Log Physical Exit (Find the currently open shift and close it)
      const { error: updateErr } = await supabase
        .from('turnstile_logs')
        .update({ exit_time: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('project_id', project_id)
        .is('exit_time', null);

      if (updateErr) throw updateErr;
    } else {
      return NextResponse.json({ access: "DENIED", reason: "Invalid direction (must be IN or OUT)" }, { status: 400 });
    }

    // 5. Grant access to the physical gate hardware
    return NextResponse.json({
      access: "GRANTED",
      user: `${user.first_name} ${user.last_name}`,
      message: direction === 'IN' ? "Welcome to the site." : "Goodbye. Shift logged."
    }, { status: 200 });

  } catch (err: any) {
    console.error("Turnstile API Error:", err);
    return NextResponse.json({ access: "DENIED", reason: "Internal Server Error" }, { status: 500 });
  }
}
