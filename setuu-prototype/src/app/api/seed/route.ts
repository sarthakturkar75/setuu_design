import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  const causes = [
    { name: 'Design Clash', category: 'Engineering' },
    { name: 'Missing Specification', category: 'Engineering' },
    { name: 'Poor Workmanship', category: 'Execution' },
    { name: 'Out of Sequence Work', category: 'Execution' },
    { name: 'Material Defect', category: 'Supply Chain' },
    { name: 'Late Delivery', category: 'Supply Chain' },
    { name: 'Weather Delay', category: 'Act of God' },
    { name: 'Site Access Blocked', category: 'Logistics' },
    { name: 'Safety Violation', category: 'Compliance' }
  ];

  for (const c of causes) {
    await supabase.from('issue_root_causes').insert(c);
  }
  
  return NextResponse.json({ success: true, message: "Seeded" });
}
