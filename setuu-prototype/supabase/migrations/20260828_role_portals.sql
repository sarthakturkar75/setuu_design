-- Design Reviews (Peer Review & Design Approval System)
CREATE TABLE IF NOT EXISTS design_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  review_type TEXT NOT NULL DEFAULT 'design', -- design | code | document | inspection
  author_id UUID NOT NULL REFERENCES user_actor(id),
  reviewer_id UUID REFERENCES user_actor(id), -- assigned reviewer (role above author)
  author_role TEXT NOT NULL, -- engineer | pm (tracks who submitted for review)
  status TEXT NOT NULL DEFAULT 'pending', -- pending | in_review | approved | changes_requested | closed
  linked_entity_type TEXT, -- task | drawing | milestone | issue
  linked_entity_id UUID,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Design Review Comments (Review Actions & Comments)
CREATE TABLE IF NOT EXISTS design_review_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES design_reviews(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES user_actor(id),
  content TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'comment', -- comment | approve | request_changes
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Team Documents (Team Docs & Knowledge Base)
CREATE TABLE IF NOT EXISTS team_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- NULL = org-wide doc
  category TEXT NOT NULL DEFAULT 'general', -- standards | sops | protocols | onboarding | general
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- markdown
  parent_id UUID REFERENCES team_documents(id) ON DELETE CASCADE, -- tree structure
  author_id UUID NOT NULL REFERENCES user_actor(id),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Delivery Proofs (Vendor Delivery Proof Uploads)
CREATE TABLE IF NOT EXISTS delivery_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES project_materials(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT, -- image | document | photo
  notes TEXT,
  uploaded_by UUID NOT NULL REFERENCES user_actor(id),
  verified_by UUID REFERENCES user_actor(id),
  verified_at TIMESTAMPTZ,
  status TEXT DEFAULT 'submitted', -- submitted | verified | rejected
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE design_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_proofs ENABLE ROW LEVEL SECURITY;

-- Policies for design_reviews
CREATE POLICY "Users can view design reviews for their projects"
  ON design_reviews FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM tasks WHERE assignee_id = auth.uid() UNION SELECT id FROM projects WHERE assigned_pm_id = auth.uid() OR lead_engineer_id = auth.uid()
      UNION
      SELECT project_id FROM project_vendors WHERE vendor_id IN (
        SELECT id FROM org_vendors WHERE created_by = auth.uid() OR id IN (
          SELECT vendor_id FROM project_materials WHERE vendor_id IS NOT NULL
        ) -- approximate access, actual vendors table design might vary
      )
    ) OR
    EXISTS (SELECT 1 FROM user_actor WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'pm'))
  );

CREATE POLICY "Users can insert design reviews"
  ON design_reviews FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update design reviews"
  ON design_reviews FOR UPDATE
  USING (author_id = auth.uid() OR reviewer_id = auth.uid() OR EXISTS (SELECT 1 FROM user_actor WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'pm')));

-- Policies for design_review_comments
CREATE POLICY "Users can view comments for reviews they can see"
  ON design_review_comments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM design_reviews WHERE id = design_review_comments.review_id)
  );

CREATE POLICY "Users can insert comments"
  ON design_review_comments FOR INSERT
  WITH CHECK (author_id = auth.uid());

-- Policies for team_documents
CREATE POLICY "Users can view team documents"
  ON team_documents FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM user_actor WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM user_actor WHERE id = auth.uid() AND role IN ('superadmin', 'admin'))
  );

CREATE POLICY "Admins and PMs can manage team documents"
  ON team_documents FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_actor WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'pm'))
  );
  
CREATE POLICY "Engineers can manage team documents"
  ON team_documents FOR ALL
  USING (
    author_id = auth.uid() OR EXISTS (SELECT 1 FROM user_actor WHERE id = auth.uid() AND role = 'engineer')
  );

-- Policies for delivery_proofs
CREATE POLICY "Users can view delivery proofs for their projects"
  ON delivery_proofs FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM tasks WHERE assignee_id = auth.uid() UNION SELECT id FROM projects WHERE assigned_pm_id = auth.uid() OR lead_engineer_id = auth.uid()
    ) OR
    uploaded_by = auth.uid() OR
    EXISTS (SELECT 1 FROM user_actor WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'pm'))
  );

CREATE POLICY "Users can insert delivery proofs"
  ON delivery_proofs FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update their own delivery proofs"
  ON delivery_proofs FOR UPDATE
  USING (uploaded_by = auth.uid() OR EXISTS (SELECT 1 FROM user_actor WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'pm')));

