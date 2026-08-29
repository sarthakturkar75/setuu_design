-- Add missing granular permission columns to support the UI checkboxes
ALTER TABLE project_granular_permissions
  ADD COLUMN IF NOT EXISTS can_edit_timeline BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS can_manage_issues BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS can_approve_changes BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS can_manage_materials BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS can_manage_labor BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS can_view_reports BOOLEAN DEFAULT FALSE;

-- Ensure RLS allows the service_role to insert (if RLS was enabled via dashboard)
-- We don't necessarily need a policy for service_role as it bypasses RLS anyway,
-- but we'll ensure PMs and Admins can view it.
ALTER TABLE project_granular_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone assigned can view granular permissions" ON project_granular_permissions;
CREATE POLICY "Anyone assigned can view granular permissions" ON project_granular_permissions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM project_vendors pv WHERE pv.project_id = project_granular_permissions.project_id AND pv.vendor_id = auth.uid())
        OR user_id = auth.uid()
    );
