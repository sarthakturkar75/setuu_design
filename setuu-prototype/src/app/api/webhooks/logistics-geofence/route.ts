import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { materialId, lat, lng, eventType } = payload; // eventType e.g., "ENTERED_GEOFENCE"

    if (!materialId || eventType !== 'ENTERED_GEOFENCE') {
      return NextResponse.json({ success: false, message: "Ignored event" });
    }

    // 1. Get Material & PM
    const { data: material } = await supabase
      .from('project_materials')
      .select('id, item_name, project_id, tracking_timeline')
      .eq('id', materialId)
      .single();

    if (!material) return NextResponse.json({ success: false, error: "Material not found" });

    const { data: project } = await supabase
      .from('projects')
      .select('assigned_pm_id')
      .eq('id', material.project_id)
      .single();

    // 2. Append to tracking_timeline
    const currentTimeline = Array.isArray(material.tracking_timeline) ? material.tracking_timeline : [];
    const newEvent = {
      event: "Truck entered 5-mile geofence",
      timestamp: new Date().toISOString(),
      location: { lat, lng }
    };
    
    await supabase.from('project_materials').update({
      tracking_timeline: [...currentTimeline, newEvent]
    }).eq('id', materialId);

    // 3. Notify Site Manager (PM)
    if (project?.assigned_pm_id) {
      await supabase.from('notifications').insert({
        user_id: project.assigned_pm_id,
        reference_id: material.project_id,
        title: "Delivery Approaching!",
        body: `Logistics alert: The delivery truck for ${material.item_name} has entered the 5-mile site geofence. Prepare laydown yard.`,
        is_read: false,
        type: "system"
      });
    }

    return NextResponse.json({ success: true, message: "Geofence event logged" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
