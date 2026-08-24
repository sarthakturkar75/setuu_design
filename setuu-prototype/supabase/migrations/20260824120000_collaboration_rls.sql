-- Enable RLS
ALTER TABLE public.project_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_reads ENABLE ROW LEVEL SECURITY;

-- Project Communications Policies
CREATE POLICY "Users can view communications in their projects"
    ON public.project_communications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.project_members pm
            WHERE pm.project_id = project_communications.project_id
            AND pm.user_id = auth.uid()
        )
        OR 
        public.is_super_admin()
        OR
        public.is_admin()
    );

CREATE POLICY "Users can insert communications in their projects"
    ON public.project_communications FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.project_members pm
            WHERE pm.project_id = project_communications.project_id
            AND pm.user_id = auth.uid()
        )
        OR 
        public.is_super_admin()
        OR
        public.is_admin()
    );

-- Mentions Policies
CREATE POLICY "Users can view mentions in their projects"
    ON public.communication_mentions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.project_communications pc
            JOIN public.project_members pm ON pm.project_id = pc.project_id
            WHERE pc.id = communication_mentions.communication_id
            AND pm.user_id = auth.uid()
        )
        OR public.is_super_admin() OR public.is_admin()
    );

CREATE POLICY "Users can insert mentions"
    ON public.communication_mentions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.project_communications pc
            JOIN public.project_members pm ON pm.project_id = pc.project_id
            WHERE pc.id = communication_mentions.communication_id
            AND pm.user_id = auth.uid()
        )
        OR public.is_super_admin() OR public.is_admin()
    );

-- Reads Policies
CREATE POLICY "Users can view reads in their projects"
    ON public.communication_reads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.project_communications pc
            JOIN public.project_members pm ON pm.project_id = pc.project_id
            WHERE pc.id = communication_reads.communication_id
            AND pm.user_id = auth.uid()
        )
        OR public.is_super_admin() OR public.is_admin()
    );

CREATE POLICY "Users can mark messages as read"
    ON public.communication_reads FOR INSERT
    WITH CHECK (user_id = auth.uid());
