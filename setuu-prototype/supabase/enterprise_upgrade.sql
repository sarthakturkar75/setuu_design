-- ==========================================
-- PHASE 1: Preparation & Base Types
-- ==========================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'severity_level') THEN
        CREATE TYPE severity_level AS ENUM ('Low', 'Medium', 'High', 'Critical');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dependency_type') THEN
        CREATE TYPE dependency_type AS ENUM ('FS', 'SS', 'FF', 'SF');
    END IF;
END $$;

-- ==========================================
-- PHASE 2: Alter Existing Tables
-- ==========================================

-- users/user_actor
ALTER TABLE user_actor ADD COLUMN IF NOT EXISTS user_preferences JSONB DEFAULT '{}'::jsonb;

-- milestones
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS wbs_code TEXT;
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS sov_value NUMERIC(15,2);
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}'::jsonb;

-- project_budgets (Wait, there is no project_budgets table in the list! Is it under projects?)
-- Let's check projects table.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contingency_amount NUMERIC(15,2);

-- project_materials
ALTER TABLE project_materials ADD COLUMN IF NOT EXISTS location_id UUID; -- Will add FK later when site_locations is created
ALTER TABLE project_materials ADD COLUMN IF NOT EXISTS qr_uuid UUID UNIQUE;
ALTER TABLE project_materials ADD COLUMN IF NOT EXISTS submittal_id UUID;
ALTER TABLE project_materials ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}'::jsonb;

-- project_issues
ALTER TABLE project_issues ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ;
ALTER TABLE project_issues ADD COLUMN IF NOT EXISTS severity severity_level DEFAULT 'Medium';
ALTER TABLE project_issues ADD COLUMN IF NOT EXISTS root_cause_id UUID;
ALTER TABLE project_issues ADD COLUMN IF NOT EXISTS estimated_rework_cost NUMERIC(15,2);
ALTER TABLE project_issues ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}'::jsonb;

-- updates
ALTER TABLE updates ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,7);
ALTER TABLE updates ADD COLUMN IF NOT EXISTS longitude NUMERIC(10,7);
ALTER TABLE updates ADD COLUMN IF NOT EXISTS weather_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE updates ADD COLUMN IF NOT EXISTS ai_analysis_flags JSONB DEFAULT '{}'::jsonb;

-- change_requests
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}'::jsonb;

-- drawing_versions
ALTER TABLE drawing_versions ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}'::jsonb;

-- ==========================================
-- PHASE 3: Create New Tables
-- ==========================================

-- 1. Overview
CREATE TABLE IF NOT EXISTS public_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    secure_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES user_actor(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Timeline
CREATE TABLE IF NOT EXISTS timeline_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    predecessor_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    successor_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    dep_type dependency_type DEFAULT 'FS',
    lag_days INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS timeline_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weather_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    precipitation_mm NUMERIC(5,2),
    delay_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Milestones
CREATE TABLE IF NOT EXISTS milestone_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
    status_name TEXT NOT NULL,
    entered_at TIMESTAMPTZ DEFAULT NOW(),
    exited_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS workflow_automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    trigger_event TEXT NOT NULL,
    action_type TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Changes
CREATE TABLE IF NOT EXISTS change_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
    signer_id UUID REFERENCES user_actor(id),
    role TEXT,
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    esign_envelope_id TEXT
);

CREATE TABLE IF NOT EXISTS change_requests_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    change_id UUID REFERENCES change_requests(id) ON DELETE CASCADE,
    snapshot_data JSONB NOT NULL,
    changed_by UUID REFERENCES user_actor(id),
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Materials
CREATE TABLE IF NOT EXISTS site_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    zone TEXT
);
-- Add the FK from materials to site_locations now that it exists
ALTER TABLE project_materials ADD CONSTRAINT fk_pm_location FOREIGN KEY (location_id) REFERENCES site_locations(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS material_waste_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES project_materials(id) ON DELETE CASCADE,
    quantity_wasted NUMERIC NOT NULL,
    financial_loss NUMERIC(15,2),
    reason TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Issues
CREATE TABLE IF NOT EXISTS issue_root_causes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT
);
ALTER TABLE project_issues ADD CONSTRAINT fk_pi_root_cause FOREIGN KEY (root_cause_id) REFERENCES issue_root_causes(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS bim_clashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES project_issues(id) ON DELETE CASCADE,
    model_urn TEXT NOT NULL,
    clash_xyz JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS issue_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES project_issues(id) ON DELETE CASCADE,
    checklist_json JSONB NOT NULL,
    inspector_id UUID REFERENCES user_actor(id),
    conducted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Drawings
CREATE TABLE IF NOT EXISTS drawing_hyperlinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_drawing_id UUID REFERENCES drawing_versions(id) ON DELETE CASCADE,
    target_drawing_id UUID REFERENCES drawing_versions(id) ON DELETE CASCADE,
    bounding_box_json JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS drawing_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drawing_id UUID REFERENCES drawing_versions(id) ON DELETE CASCADE,
    x_coord NUMERIC(8,4) NOT NULL,
    y_coord NUMERIC(8,4) NOT NULL,
    linked_entity_type TEXT,
    linked_entity_id UUID
);

CREATE TABLE IF NOT EXISTS batch_upload_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    total_pages INT DEFAULT 0,
    processed_pages INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Collaboration
CREATE TABLE IF NOT EXISTS transmittals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES user_actor(id),
    subject TEXT NOT NULL,
    payload JSONB,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transmittal_recipients (
    transmittal_id UUID REFERENCES transmittals(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES user_actor(id),
    read_at TIMESTAMPTZ,
    legally_binding BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (transmittal_id, recipient_id)
);

CREATE TABLE IF NOT EXISTS meeting_minutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    audio_url TEXT,
    ai_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Team
CREATE TABLE IF NOT EXISTS user_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_actor(id) ON DELETE CASCADE,
    cert_type TEXT NOT NULL,
    expiry_date DATE,
    file_url TEXT
);

CREATE TABLE IF NOT EXISTS user_billing_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_actor(id) ON DELETE CASCADE,
    hourly_rate NUMERIC(10,2) NOT NULL,
    effective_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS site_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_actor(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    direction TEXT CHECK (direction IN ('in', 'out'))
);

CREATE TABLE IF NOT EXISTS muster_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    initiated_by UUID REFERENCES user_actor(id),
    started_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS muster_responses (
    event_id UUID REFERENCES muster_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_actor(id) ON DELETE CASCADE,
    status TEXT,
    responded_at TIMESTAMPTZ,
    PRIMARY KEY (event_id, user_id)
);

-- 10. Resources
CREATE TABLE IF NOT EXISTS equipment_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID, -- Assuming resources are mapped by UUID
    engine_hours NUMERIC(10,2),
    lat NUMERIC(10,7),
    lng NUMERIC(10,7),
    last_ping TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS union_compliance_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_name TEXT NOT NULL,
    max_hours INT,
    required_break_mins INT
);

CREATE TABLE IF NOT EXISTS vendor_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES user_actor(id),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    billed_hours NUMERIC(10,2),
    amount NUMERIC(15,2),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Handover
CREATE TABLE IF NOT EXISTS project_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    asset_tag TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    warranty_end DATE,
    om_manual_url TEXT
);

CREATE TABLE IF NOT EXISTS financial_retentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES user_actor(id),
    retention_percentage NUMERIC(5,2) DEFAULT 5.00,
    status TEXT DEFAULT 'held'
);

-- 12. Updates
CREATE TABLE IF NOT EXISTS video_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'processing',
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Module Flags
CREATE TABLE IF NOT EXISTS role_default_views (
    role_name TEXT PRIMARY KEY,
    default_module_path TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS custom_fields_schema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- e.g., 'project_materials'
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    days_to_keep INT NOT NULL,
    action TEXT DEFAULT 'archive'
);

