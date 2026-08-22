-- Module 2: Timeline Enhancements
ALTER TABLE milestones
ADD COLUMN IF NOT EXISTS baseline_start_date DATE,
ADD COLUMN IF NOT EXISTS baseline_end_date DATE,
ADD COLUMN IF NOT EXISTS is_exterior BOOLEAN DEFAULT false;

-- Update existing records to baseline
UPDATE milestones
SET baseline_start_date = CURRENT_DATE, baseline_end_date = target_date
WHERE baseline_start_date IS NULL AND target_date IS NOT NULL;

-- Add payload to timeline_scenarios for Sandbox Mode
ALTER TABLE timeline_scenarios
ADD COLUMN IF NOT EXISTS payload JSONB;