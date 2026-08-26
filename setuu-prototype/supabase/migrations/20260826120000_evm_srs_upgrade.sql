-- ============================================================================
-- MIGRATION: 20260826120000_evm_srs_upgrade.sql
-- DESCRIPTION: Upgrades `tasks` for EVM scheduling and creates `project_requirements` (SRS).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: UPGRADE TASKS TABLE WITH QUANTITATIVE TEMPORAL & EVM COLUMNS
-- ----------------------------------------------------------------------------
DO $$ 
BEGIN
  -- Display ID (human readable task ID e.g. TSK-101)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='display_id') THEN
    ALTER TABLE public.tasks ADD COLUMN display_id VARCHAR(50);
    ALTER TABLE public.tasks ADD CONSTRAINT tasks_display_id_key UNIQUE (display_id);
  END IF;

  -- Department Type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='department') THEN
    ALTER TABLE public.tasks ADD COLUMN department public.department_type;
  END IF;

  -- Planned Start & Finish Dates
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='planned_start_date') THEN
    ALTER TABLE public.tasks ADD COLUMN planned_start_date DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='planned_finish_date') THEN
    ALTER TABLE public.tasks ADD COLUMN planned_finish_date DATE;
  END IF;

  -- Actual Start & Finish Dates
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='actual_start_date') THEN
    ALTER TABLE public.tasks ADD COLUMN actual_start_date DATE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='actual_finish_date') THEN
    ALTER TABLE public.tasks ADD COLUMN actual_finish_date DATE;
  END IF;

  -- Duration
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='duration_days') THEN
    ALTER TABLE public.tasks ADD COLUMN duration_days INT;
  END IF;

  -- Progress Percentages
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='planned_percent_complete') THEN
    ALTER TABLE public.tasks ADD COLUMN planned_percent_complete INT DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='actual_percent_complete') THEN
    ALTER TABLE public.tasks ADD COLUMN actual_percent_complete INT DEFAULT 0;
  END IF;

  -- Remarks
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='remarks') THEN
    ALTER TABLE public.tasks ADD COLUMN remarks TEXT;
  END IF;

  -- Computed Column: Delay Days
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tasks' AND column_name='delay_days') THEN
    ALTER TABLE public.tasks 
    ADD COLUMN delay_days INT GENERATED ALWAYS AS (
      CASE 
        WHEN actual_finish_date IS NOT NULL AND planned_finish_date IS NOT NULL 
        THEN (actual_finish_date - planned_finish_date) 
        ELSE NULL 
      END
    ) STORED;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- STEP 2: CREATE PROJECT REQUIREMENTS (SRS TRACEABILITY MATRIX) TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  display_id VARCHAR(50) UNIQUE,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  specification_value TEXT,
  customer_requirement TEXT,
  priority public.severity_level DEFAULT 'Medium'::public.severity_level,
  source_document TEXT,
  responsible_id UUID REFERENCES public.user_actor(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Draft',
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for high-performance project lookups
CREATE INDEX IF NOT EXISTS idx_project_requirements_project_id 
  ON public.project_requirements(project_id);

-- ----------------------------------------------------------------------------
-- STEP 3: ROW LEVEL SECURITY (RLS) POLICIES FOR PROJECT REQUIREMENTS
-- ----------------------------------------------------------------------------
ALTER TABLE public.project_requirements ENABLE ROW LEVEL SECURITY;

-- 1. View Access: Users can view requirements for visible projects
CREATE POLICY "Users can view requirements for visible projects"
  ON public.project_requirements FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_requirements.project_id
    )
  );

-- 2. Insert Access: PMs and Admins can insert requirements
CREATE POLICY "PMs and Admins can insert requirements"
  ON public.project_requirements FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_actor u
      WHERE u.id = auth.uid() 
        AND u.role = ANY (ARRAY['pm'::text, 'admin'::text, 'superadmin'::text])
    )
  );

-- 3. Update Access: PMs, Admins, and Assigned Responsibles can update requirements
CREATE POLICY "PMs, Admins, and Responsibles can update requirements"
  ON public.project_requirements FOR UPDATE TO public
  USING (
    auth.uid() = responsible_id OR
    EXISTS (
      SELECT 1 FROM public.user_actor u
      WHERE u.id = auth.uid() 
        AND u.role = ANY (ARRAY['pm'::text, 'admin'::text, 'superadmin'::text])
    )
  );

-- 4. Delete Access: Admins and PMs can delete requirements
CREATE POLICY "Admins and PMs can delete requirements"
  ON public.project_requirements FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.user_actor u
      WHERE u.id = auth.uid() 
        AND u.role = ANY (ARRAY['pm'::text, 'admin'::text, 'superadmin'::text])
    )
  );