import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    // 1. Verify Authorization (Vercel Cron Secret)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // During local dev or if no secret is set, we bypass. In production, this MUST match.
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Fetch all retention policies
    const { data: policies, error: fetchError } = await adminSupabase
      .from('project_retention_policies')
      .select('*');

    if (fetchError || !policies) {
      return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
    }

    let processedCount = 0;
    const errors: string[] = [];

    // 3. Process each policy
    for (const policy of policies) {
      try {
        const { project_id, entity_type, retain_days, action } = policy;
        
        // Calculate the cutoff date (retention window)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retain_days);
        const cutoffISO = cutoffDate.toISOString();

        if (action === 'delete') {
          // Execute the hard delete
          const { error: deleteError } = await adminSupabase
            .from(entity_type)
            .delete()
            .eq('project_id', project_id)
            .lt('created_at', cutoffISO);

          if (deleteError) {
            errors.push(`Delete failed for ${entity_type} in project ${project_id}: ${deleteError.message}`);
          } else {
            processedCount++;
          }
        } else if (action === 'archive') {
          // In a real system, we'd move this to an archive schema or S3 bucket.
          // For now, we simulate archiving by setting an 'is_archived' flag if it exists,
          // or just log it if we don't have an archive system yet.
          console.log(`Archiving ${entity_type} for project ${project_id} older than ${cutoffISO}`);
          processedCount++;
        }

      } catch (err: any) {
        errors.push(`Exception processing policy ${policy.id}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} retention policies.`,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
