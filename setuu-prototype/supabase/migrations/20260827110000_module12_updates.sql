-- Module 12: Updates & Site Camera Migration

-- 1. Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weather_summary_json JSONB DEFAULT '{}'::jsonb,
    labor_hours_total NUMERIC(10, 2) DEFAULT 0,
    ai_generated_report TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create time_lapse_videos table
CREATE TABLE IF NOT EXISTS time_lapse_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enhance updates table for Module 12 requirements
ALTER TABLE updates 
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS location_name TEXT,
ADD COLUMN IF NOT EXISTS weather_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_watermarked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_analysis_flags JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;


-- ==========================================
-- 4. CLEANUP OLD / PERMISSIVE POLICIES
-- ==========================================
-- If you ran the initial version of this script, it created overly permissive policies.
-- We MUST drop them, because Postgres combines policies using OR. If a "USING (true)" policy remains, the table remains insecure.
DROP POLICY IF EXISTS "Enable read access for all project users" ON daily_logs;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON daily_logs;
DROP POLICY IF EXISTS "Enable read access for all project users" ON time_lapse_videos;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON time_lapse_videos;

-- Drop the new restrictive policies before recreating them so the script is 100% idempotent and can be run multiple times.
DROP POLICY IF EXISTS "Internal staff view daily logs" ON daily_logs;
DROP POLICY IF EXISTS "Internal staff insert daily logs" ON daily_logs;
DROP POLICY IF EXISTS "Assigned personnel view time lapses" ON time_lapse_videos;
DROP POLICY IF EXISTS "Management insert time lapses" ON time_lapse_videos;


-- ==========================================
-- 5. Strict RLS Policies for daily_logs
-- ==========================================
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Block clients and vendors. Only allow Superadmins, or internal staff (PM, Admin, Engineer) actively linked to the project.
CREATE POLICY "Internal staff view daily logs" ON daily_logs 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin'
        )
        OR (
            EXISTS (
                SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role IN ('admin', 'pm', 'engineer')
            )
            AND EXISTS (
                SELECT 1 FROM project_granular_permissions pgp 
                WHERE pgp.project_id = daily_logs.project_id AND pgp.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Internal staff insert daily logs" ON daily_logs 
    FOR INSERT WITH CHECK (auth.uid() = created_by);


-- ==========================================
-- 6. Strict RLS Policies for time_lapse_videos
-- ==========================================
ALTER TABLE time_lapse_videos ENABLE ROW LEVEL SECURITY;

-- Time lapses are general progress. Allow any assigned personnel (including clients/vendors if linked to the project) to view.
CREATE POLICY "Assigned personnel view time lapses" ON time_lapse_videos 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_actor ua WHERE ua.id = auth.uid() AND ua.role = 'superadmin'
        )
        OR EXISTS (
            SELECT 1 FROM project_granular_permissions pgp 
            WHERE pgp.project_id = time_lapse_videos.project_id AND pgp.user_id = auth.uid()
        )
    );

-- Only PMs, Admins, and Superadmins can generate/insert time lapses
CREATE POLICY "Management insert time lapses" ON time_lapse_videos 
    FOR INSERT WITH CHECK (
        auth.uid() = created_by 
        AND EXISTS (
            SELECT 1 FROM user_actor ua 
            WHERE ua.id = auth.uid() AND ua.role IN ('superadmin', 'admin', 'pm')
        )
    );
