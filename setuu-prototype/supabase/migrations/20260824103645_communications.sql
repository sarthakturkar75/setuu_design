-- ==========================================
-- MODULE 8: COLLABORATION (SITE COMMUNICATIONS)
-- ==========================================

-- 1. Project Communications (The main Chat table)
CREATE TABLE IF NOT EXISTS public.project_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Content
    message TEXT NOT NULL,
    translated_message_es TEXT, -- AI Translation (Spanish)
    audio_url TEXT, -- Field Voice Notes
    
    -- Context / Flags
    is_transmittal BOOLEAN DEFAULT false,
    is_broadcast BOOLEAN DEFAULT false,
    
    -- Linked Entities (Optional)
    drawing_id UUID REFERENCES public.drawing_versions(id) ON DELETE SET NULL,
    issue_id UUID REFERENCES public.project_issues(id) ON DELETE SET NULL,
    
    custom_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Communication Mentions (RBAC-Aware @Mentions)
CREATE TABLE IF NOT EXISTS public.communication_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_id UUID NOT NULL REFERENCES public.project_communications(id) ON DELETE CASCADE,
    mentioned_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Communication Reads (Read-Receipt & Acknowledgment Matrix)
CREATE TABLE IF NOT EXISTS public.communication_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_id UUID NOT NULL REFERENCES public.project_communications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(communication_id, user_id)
);

-- Turn on Realtime for the new communications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'project_communications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE project_communications;
  END IF;
END $$;
