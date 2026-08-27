-- Module 13: Project Configuration & Settings Migration

-- ==========================================
-- 1. Table Creations
-- ==========================================

CREATE TABLE IF NOT EXISTS project_module_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    custom_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, module_id)
);

CREATE TABLE IF NOT EXISTS project_role_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    default_landing_page TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, role)
);

-- DROP the legacy prototype table to replace it with the correct architecture
DROP TABLE IF EXISTS custom_fields_schema CASCADE;
CREATE TABLE custom_fields_schema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL,
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, entity_type, field_name)
);

ALTER TABLE project_issues ADD COLUMN IF NOT EXISTS custom_attributes JSONB DEFAULT '{}'::jsonb;
ALTER TABLE project_materials ADD COLUMN IF NOT EXISTS custom_attributes JSONB DEFAULT '{}'::jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS custom_attributes JSONB DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS project_retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    retain_days INT NOT NULL,
    action TEXT NOT NULL DEFAULT 'delete',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, entity_type)
);

-- ==========================================
-- 2. RLS Policies
-- ==========================================

ALTER TABLE project_module_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_role_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields_schema ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_retention_policies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone assigned can view module config" ON project_module_config;
DROP POLICY IF EXISTS "Admins can manage module config" ON project_module_config;
DROP POLICY IF EXISTS "Anyone assigned can view role settings" ON project_role_settings;
DROP POLICY IF EXISTS "Admins can manage role settings" ON project_role_settings;
DROP POLICY IF EXISTS "Anyone assigned can view custom fields" ON custom_fields_schema;
DROP POLICY IF EXISTS "Admins can manage custom fields" ON custom_fields_schema;
DROP POLICY IF EXISTS "Anyone assigned can view retention policies" ON project_retention_policies;
DROP POLICY IF EXISTS "Admins can manage retention policies" ON project_retention_policies;

CREATE POLICY "Anyone assigned can view module config" ON project_module_config
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM project_granular_permissions pgp WHERE pgp.project_id = project_module_config.project_id AND pgp.user_id = auth.uid())
    );

CREATE POLICY "Admins can manage module config" ON project_module_config
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role IN ('admin', 'pm'))
    );

CREATE POLICY "Anyone assigned can view role settings" ON project_role_settings
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM project_granular_permissions pgp WHERE pgp.project_id = project_role_settings.project_id AND pgp.user_id = auth.uid())
    );

CREATE POLICY "Admins can manage role settings" ON project_role_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role IN ('admin', 'pm'))
    );

CREATE POLICY "Anyone assigned can view custom fields" ON custom_fields_schema
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM project_granular_permissions pgp WHERE pgp.project_id = custom_fields_schema.project_id AND pgp.user_id = auth.uid())
    );

CREATE POLICY "Admins can manage custom fields" ON custom_fields_schema
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role IN ('admin', 'pm'))
    );

CREATE POLICY "Anyone assigned can view retention policies" ON project_retention_policies
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM project_granular_permissions pgp WHERE pgp.project_id = project_retention_policies.project_id AND pgp.user_id = auth.uid())
    );

CREATE POLICY "Admins can manage retention policies" ON project_retention_policies
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin')
        OR EXISTS (SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role IN ('admin', 'pm'))
    );