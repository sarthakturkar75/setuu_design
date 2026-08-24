

-- 1. Extend user_actor for Personnel Tracking
ALTER TABLE user_actor
ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'External Vendor',
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS rfid_badge_id TEXT;

-- 2. Personnel Certifications Table (Compliance)
CREATE TABLE IF NOT EXISTS personnel_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_actor(id) ON DELETE CASCADE NOT NULL,
    cert_name TEXT NOT NULL,
    expiry_date TIMESTAMPTZ NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Granular Access Control Matrix
CREATE TABLE IF NOT EXISTS project_granular_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES user_actor(id) ON DELETE CASCADE NOT NULL,
    can_view_drawings BOOLEAN DEFAULT FALSE,
    can_view_financials BOOLEAN DEFAULT FALSE,
    UNIQUE(project_id, user_id)
);

-- 4. Site Access & Turnstile Logs
CREATE TABLE IF NOT EXISTS turnstile_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_actor(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    entry_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exit_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Emergency Muster Roll Tracking
CREATE TABLE IF NOT EXISTS muster_roll_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    initiated_by UUID REFERENCES user_actor(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Active', -- 'Active' or 'Resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS muster_roll_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES muster_roll_events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES user_actor(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'UNKNOWN', -- 'UNKNOWN' or 'SAFE'
    responded_at TIMESTAMPTZ,
    UNIQUE(event_id, user_id)
);
