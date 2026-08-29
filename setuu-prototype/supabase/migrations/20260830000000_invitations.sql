-- Create Invitations Table
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    target_user_id UUID REFERENCES public.user_actor(id) ON DELETE CASCADE,
    target_org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES public.user_actor(id) ON DELETE CASCADE,
    invite_type TEXT NOT NULL CHECK (invite_type IN ('platform', 'organization', 'project')),
    role_offered TEXT NOT NULL,
    resource_id UUID, -- Can be project_id or organization_id depending on type
    token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Admins and PMs can view invitations they created or for their org/projects
CREATE POLICY "Users can view invitations they sent or for their org"
ON public.invitations
FOR SELECT
USING (
    inviter_id = auth.uid() OR 
    target_user_id = auth.uid()
);

-- Service role will handle inserts/updates via backend
