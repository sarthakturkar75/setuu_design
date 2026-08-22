-- ==========================================
-- PHASE 4: Security (Row Level Security)
-- ==========================================

DO $$ 
DECLARE
    new_tables text[] := ARRAY[
        'public_shares', 'timeline_dependencies', 'timeline_scenarios', 'weather_logs',
        'milestone_status_history', 'workflow_automations', 'change_signatures',
        'change_requests_history', 'site_locations', 'material_waste_logs',
        'issue_root_causes', 'bim_clashes', 'issue_inspections', 'drawing_hyperlinks',
        'drawing_pins', 'batch_upload_jobs', 'transmittals', 'meeting_minutes',
        'user_certifications', 'user_billing_rates', 'site_access_logs',
        'muster_events', 'equipment_telemetry', 'union_compliance_rules',
        'vendor_invoices', 'project_assets', 'financial_retentions', 'video_exports',
        'custom_fields_schema', 'data_retention_policies'
    ];
    t_name text;
    has_project_id boolean;
BEGIN
    -- Enable RLS for all newly created tables
    FOREACH t_name IN ARRAY new_tables
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t_name);
        
        -- Check if table has a project_id column
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = t_name AND column_name = 'project_id'
        ) INTO has_project_id;
        
        -- Apply Standard Admin Policy
        EXECUTE format('
            CREATE POLICY "Admins have full access to %I" 
            ON %I FOR ALL TO public 
            USING (is_admin());
        ', t_name, t_name);
        
        -- Apply Project Visibility Policy if applicable
        IF has_project_id THEN
            EXECUTE format('
                CREATE POLICY "Users can view %I for visible projects" 
                ON %I FOR SELECT TO public 
                USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = %I.project_id));
            ', t_name, t_name, t_name);
        END IF;
    END LOOP;
    
    -- Specific complex policies (Muster responses, Transmittal Recipients)
    ALTER TABLE muster_responses ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Admins have full access to muster_responses" ON muster_responses FOR ALL TO public USING (is_admin());
    CREATE POLICY "Users can insert own muster_response" ON muster_responses FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
    
    ALTER TABLE transmittal_recipients ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Admins have full access to transmittal_recipients" ON transmittal_recipients FOR ALL TO public USING (is_admin());
    CREATE POLICY "Users can update own transmittal receipt" ON transmittal_recipients FOR UPDATE TO public USING (auth.uid() = recipient_id);
    CREATE POLICY "Users can view transmittals sent to them" ON transmittal_recipients FOR SELECT TO public USING (auth.uid() = recipient_id OR is_admin());
    
END $$;
