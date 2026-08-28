-- Migration: 20260828110000_role_portals.sql
-- Description: Schema extensions for Engineer, Vendor, and Client portals

-- 1. design_reviews
CREATE TABLE IF NOT EXISTS public.design_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  review_type TEXT NOT NULL DEFAULT 'design',
  author_id UUID NOT NULL REFERENCES public.user_actor(id),
  reviewer_id UUID REFERENCES public.user_actor(id),
  author_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  linked_entity_type TEXT,
  linked_entity_id UUID,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. design_review_comments
CREATE TABLE IF NOT EXISTS public.design_review_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.design_reviews(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.user_actor(id),
  content TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'comment',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. team_documents
CREATE TABLE IF NOT EXISTS public.team_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.team_documents(id),
  author_id UUID NOT NULL REFERENCES public.user_actor(id),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. delivery_proofs
CREATE TABLE IF NOT EXISTS public.delivery_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.project_materials(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  notes TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.user_actor(id),
  verified_by UUID REFERENCES public.user_actor(id),
  verified_at TIMESTAMPTZ,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.design_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_proofs ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allows full access for authenticated users in prototype)
CREATE POLICY "Enable read access for all authenticated users" ON public.design_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.design_reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.design_reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.design_reviews FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON public.design_review_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.design_review_comments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.design_review_comments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.design_review_comments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON public.team_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.team_documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.team_documents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.team_documents FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" ON public.delivery_proofs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.delivery_proofs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.delivery_proofs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.delivery_proofs FOR DELETE TO authenticated USING (true);
