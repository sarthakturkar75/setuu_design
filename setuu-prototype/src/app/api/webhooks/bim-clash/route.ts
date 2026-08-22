import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { projectId, clashName, description, modelUrn, clashCoordinates } = payload; 
    
    // Validate payload
    if (!projectId || !clashName || !clashCoordinates) {
      return NextResponse.json({ success: false, error: "Invalid BIM clash payload" }, { status: 400 });
    }

    // A. Generate the Issue directly
    const slaDeadline = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
    
    const { data: issue, error: issueError } = await supabase.from('project_issues').insert({
      project_id: projectId,
      title: `BIM Clash: ${clashName}`,
      description: description || "Navisworks automated clash detection",
      severity: "High",
      status: "Open",
      sla_deadline: slaDeadline,
      custom_data: { source: "BIM_Integration" }
    }).select('id').single();

    if (issueError) throw issueError;

    // B. Physically map the geometric xyz into the bim_clashes table
    const { error: clashError } = await supabase.from('bim_clashes').insert({
      issue_id: issue.id,
      project_id: projectId,
      model_urn: modelUrn || "urn:adsk.objects:os.object:bucket/model.rvt",
      clash_xyz: clashCoordinates // JSON containing { x, y, z, tolerance }
    });

    if (clashError) throw clashError;

    // Notify Project Manager
    const { data: project } = await supabase.from('projects').select('assigned_pm_id').eq('id', projectId).single();
    if (project?.assigned_pm_id) {
      await supabase.from('notifications').insert({
        user_id: project.assigned_pm_id,
        reference_id: projectId,
        title: "BIM Clash Detected",
        body: `A spatial clash (${clashName}) was detected in the model and automatically logged as an issue.`,
        is_read: false,
        type: "system"
      });
    }

    return NextResponse.json({ success: true, issueId: issue.id, message: "Clash logged successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
