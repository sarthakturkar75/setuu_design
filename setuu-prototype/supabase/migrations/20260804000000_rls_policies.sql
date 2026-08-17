ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full project access" ON projects FOR ALL TO public USING (is_admin()) ;
CREATE POLICY "Clients can view org projects" ON projects FOR SELECT TO public USING (((client_org_id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))) OR is_admin())) ;
CREATE POLICY "Employees can view all projects" ON projects FOR SELECT TO public USING (is_employee()) ;
CREATE POLICY "PMs can view assigned projects" ON projects FOR SELECT TO public USING (((auth.uid() = assigned_pm_id) OR is_admin())) ;
CREATE POLICY "Vendors can view assigned projects" ON projects FOR SELECT TO public USING (((EXISTS ( SELECT 1    FROM project_vendors   WHERE ((project_vendors.project_id = projects.id) AND (project_vendors.vendor_id = auth.uid())))) OR (EXISTS ( SELECT 1    FROM org_vendors   WHERE ((org_vendors.organization_id = projects.client_org_id) AND (org_vendors.vendor_id = auth.uid())))))) ;

ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authors and Admins can update" ON updates FOR UPDATE TO public USING (((auth.uid() = author_id) OR is_admin())) ;
CREATE POLICY "Employees can create updates" ON updates FOR INSERT TO public WITH CHECK (((auth.uid() = author_id) AND is_employee())) ;
CREATE POLICY "PMs can create updates for assigned projects" ON updates FOR INSERT TO public WITH CHECK (((auth.uid() = author_id) AND (EXISTS ( SELECT 1    FROM projects   WHERE ((projects.id = updates.project_id) AND (projects.assigned_pm_id = auth.uid())))))) ;
CREATE POLICY "Users can view updates for visible projects" ON updates FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = updates.project_id)))) ;
CREATE POLICY "Vendors can manage own updates" ON updates FOR ALL TO public USING (((author_id = auth.uid()) AND is_vendor())) ;

ALTER TABLE user_actor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can modify all profiles" ON user_actor FOR ALL TO public USING (is_admin()) ;
CREATE POLICY "Admins can view all profiles" ON user_actor FOR SELECT TO public USING (is_admin()) ;
CREATE POLICY "Super Admins can view all profiles for billing" ON user_actor FOR SELECT TO public USING (is_super_admin()) ;
CREATE POLICY "Users can view own profile" ON user_actor FOR SELECT TO public USING ((id = auth.uid())) ;

ALTER TABLE media_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authors can add attachments" ON media_attachments FOR INSERT TO public WITH CHECK (((auth.uid() = uploaded_by) AND (EXISTS ( SELECT 1    FROM updates   WHERE ((updates.id = media_attachments.update_id) AND (updates.author_id = auth.uid())))))) ;
CREATE POLICY "Users can view attachments of visible updates" ON media_attachments FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = media_attachments.update_id)))) ;

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tiers" ON subscription_tiers FOR SELECT TO public USING (true) ;
CREATE POLICY "Super Admins can manage tiers" ON subscription_tiers FOR ALL TO public USING (is_super_admin()) ;

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings" ON platform_settings FOR SELECT TO public USING (true) ;
CREATE POLICY "Super Admins can manage settings" ON platform_settings FOR ALL TO public USING (is_super_admin()) ;

ALTER TABLE break_glass_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their orgs break glass logs" ON break_glass_logs FOR SELECT TO public USING (((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text) AND (target_org_id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))))) ;
CREATE POLICY "Super Admins can insert" ON break_glass_logs FOR INSERT TO public WITH CHECK (is_super_admin()) ;
CREATE POLICY "Super admins can view break glass logs" ON break_glass_logs FOR SELECT TO public USING (is_super_admin()) ;

ALTER TABLE org_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage org vendors" ON org_vendors FOR ALL TO public USING (((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text) AND (organization_id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))))) ;
CREATE POLICY "Vendors can view their org assignments" ON org_vendors FOR SELECT TO public USING ((vendor_id = auth.uid())) ;

ALTER TABLE project_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and PMs can manage project vendors" ON project_vendors FOR ALL TO public USING ((EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = ANY (ARRAY['admin'::text, 'pm'::text])))))) ;
CREATE POLICY "Vendors can view their project assignments" ON project_vendors FOR SELECT TO public USING ((vendor_id = auth.uid())) ;

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to organizations" ON organizations FOR ALL TO public USING ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)) ;
CREATE POLICY "Super Admins can view organizations for billing" ON organizations FOR SELECT TO public USING (is_super_admin()) ;
CREATE POLICY "Users can view their organization" ON organizations FOR SELECT TO public USING (((id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;

ALTER TABLE employee_timesheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and PMs can update org timesheets" ON employee_timesheets FOR UPDATE TO public USING ((EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND ((u.role = ANY (ARRAY['admin'::text, 'super_admin'::text])) OR ((u.role = 'pm'::text) AND (u.organization_id = employee_timesheets.organization_id))))))) ;
CREATE POLICY "Admins and PMs can view org timesheets" ON employee_timesheets FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND ((u.role = ANY (ARRAY['admin'::text, 'super_admin'::text])) OR ((u.role = 'pm'::text) AND (u.organization_id = employee_timesheets.organization_id))))))) ;
CREATE POLICY "Employees can insert own timesheets" ON employee_timesheets FOR INSERT TO public WITH CHECK ((auth.uid() = user_id)) ;
CREATE POLICY "Employees can update own pending timesheets" ON employee_timesheets FOR UPDATE TO public USING (((auth.uid() = user_id) AND (status = 'pending'::text))) ;
CREATE POLICY "Employees can view own timesheets" ON employee_timesheets FOR SELECT TO public USING ((auth.uid() = user_id)) ;

ALTER TABLE client_meeting_agendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins/PMs can insert meeting agendas" ON client_meeting_agendas FOR INSERT TO public WITH CHECK ((EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'pm'::text, 'super_admin'::text])))))) ;
CREATE POLICY "Users can view meeting agendas" ON client_meeting_agendas FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM client_meetings cm   WHERE (cm.id = client_meeting_agendas.meeting_id)))) ;

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create comments" ON comments FOR INSERT TO public WITH CHECK (((auth.uid() = author_id) AND (EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = comments.update_id))))) ;
CREATE POLICY "Users can view comments of visible updates" ON comments FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = comments.update_id)))) ;

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tokens" ON push_tokens FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id)) ;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications" ON notifications FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id)) ;

ALTER TABLE project_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins/PMs can update issues" ON project_issues FOR UPDATE TO public USING ((EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'pm'::text, 'super_admin'::text])))))) ;
CREATE POLICY "Creators and Admins can modify project_issues" ON project_issues FOR ALL TO public USING (((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can insert project_issues" ON project_issues FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view project_issues for visible projects" ON project_issues FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_issues.project_id)))) ;

ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators and Admins can modify change_requests" ON change_requests FOR ALL TO public USING (((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can insert change_requests" ON change_requests FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view change_requests for visible projects" ON change_requests FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = change_requests.project_id)))) ;

ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators and Admins can modify project_resources" ON project_resources FOR ALL TO public USING (((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can insert project_resources" ON project_resources FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view project_resources for visible projects" ON project_resources FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_resources.project_id)))) ;

ALTER TABLE client_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients/Admins can update approvals" ON client_approvals FOR UPDATE TO public USING ((EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['client'::text, 'admin'::text, 'pm'::text, 'super_admin'::text])))))) ;
CREATE POLICY "Creators and Admins can modify client_approvals" ON client_approvals FOR ALL TO public USING (((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can insert client_approvals" ON client_approvals FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view client_approvals for visible projects" ON client_approvals FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = client_approvals.project_id)))) ;

ALTER TABLE project_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators and Admins can modify project_materials" ON project_materials FOR ALL TO public USING (((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can insert project_materials" ON project_materials FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view project_materials for visible projects" ON project_materials FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_materials.project_id)))) ;
CREATE POLICY "Vendors can manage assigned materials" ON project_materials FOR ALL TO public USING ((vendor_id = auth.uid())) ;

ALTER TABLE lessons_learned ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators and Admins can modify lessons_learned" ON lessons_learned FOR ALL TO public USING (((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can insert lessons_learned" ON lessons_learned FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view lessons_learned for visible projects" ON lessons_learned FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = lessons_learned.project_id)))) ;

ALTER TABLE project_handovers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins/PMs can update handover packages" ON project_handovers FOR UPDATE TO public USING ((EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'pm'::text, 'super_admin'::text])))))) ;
CREATE POLICY "Creators and Admins can modify project_handovers" ON project_handovers FOR ALL TO public USING (((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can insert project_handovers" ON project_handovers FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view project_handovers for visible projects" ON project_handovers FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_handovers.project_id)))) ;

ALTER TABLE client_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins/PMs can update client meetings" ON client_meetings FOR UPDATE TO public USING ((EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'pm'::text, 'super_admin'::text])))))) ;
CREATE POLICY "Creators and Admins can modify client_meetings" ON client_meetings FOR ALL TO public USING (((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can insert client_meetings" ON client_meetings FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view client_meetings for visible projects" ON client_meetings FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = client_meetings.project_id)))) ;

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PMs can manage tasks" ON tasks FOR ALL TO public USING ((EXISTS ( SELECT 1    FROM projects p   WHERE ((p.id = tasks.project_id) AND ((p.assigned_pm_id = auth.uid()) OR (( SELECT user_actor.role            FROM user_actor           WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['admin'::text, 'super_admin'::text]))))))) ;
CREATE POLICY "Users can view tasks" ON tasks FOR SELECT TO public USING (((assignee_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM projects p   WHERE ((p.id = tasks.project_id) AND ((p.assigned_pm_id = auth.uid()) OR (( SELECT user_actor.role            FROM user_actor           WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['admin'::text, 'super_admin'::text])))))))) ;
CREATE POLICY "Vendors can update assigned task status" ON tasks FOR UPDATE TO public USING ((assignee_id = auth.uid())) ;

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_log FOR SELECT TO public USING ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)) ;
CREATE POLICY "Deny all manual modifications to audit logs" ON audit_log FOR ALL TO public USING (false) ;

ALTER TABLE drawing_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators and Admins can modify drawings" ON drawing_versions FOR ALL TO public USING (((auth.uid() = uploaded_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))) ;
CREATE POLICY "PMs and Admins can manage drawings" ON drawing_versions FOR INSERT TO public WITH CHECK ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view drawings for visible projects" ON drawing_versions FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = drawing_versions.project_id)))) ;

ALTER TABLE project_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project config" ON project_config FOR ALL TO public USING ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)) ;
CREATE POLICY "Users can view config for visible projects" ON project_config FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_config.project_id)))) ;

ALTER TABLE milestone_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PMs and Admins can manage checklist items" ON milestone_checklist_items FOR ALL TO public USING ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))) ;
CREATE POLICY "Users can view checklist items for visible milestones" ON milestone_checklist_items FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM (milestones m      JOIN projects p ON ((p.id = m.project_id)))   WHERE (m.id = milestone_checklist_items.milestone_id)))) ;

ALTER TABLE acknowledgements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can acknowledge" ON acknowledgements FOR INSERT TO public WITH CHECK (((auth.uid() = client_id) AND (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'client'::text) AND (EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = acknowledgements.update_id))))) ;
CREATE POLICY "Clients can update own acks" ON acknowledgements FOR UPDATE TO public USING ((auth.uid() = client_id)) ;
CREATE POLICY "Users can view acks of visible updates" ON acknowledgements FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = acknowledgements.update_id)))) ;

ALTER TABLE user_identity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update own identity" ON user_identity FOR UPDATE TO public USING ((actor_id = auth.uid())) ;
CREATE POLICY "Users can view own identity" ON user_identity FOR SELECT TO public USING ((actor_id = auth.uid())) ;

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to milestones" ON milestones FOR ALL TO public USING ((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)) ;
CREATE POLICY "PMs can create and modify milestones for assigned projects" ON milestones FOR ALL TO public USING ((EXISTS ( SELECT 1    FROM projects   WHERE ((projects.id = milestones.project_id) AND (projects.assigned_pm_id = auth.uid()))))) ;
CREATE POLICY "Users can view milestones for visible projects" ON milestones FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM projects p   WHERE ((p.id = milestones.project_id) AND ((p.assigned_pm_id = auth.uid()) OR (p.client_org_id = ( SELECT user_actor.organization_id            FROM user_actor           WHERE (user_actor.id = auth.uid()))) OR (( SELECT user_actor.role            FROM user_actor           WHERE (user_actor.id = auth.uid())) = 'admin'::text)))))) ;

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and Super Admins can update tickets" ON support_tickets FOR UPDATE TO public USING ((EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))) ;
CREATE POLICY "Admins and Super Admins can view all tickets" ON support_tickets FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))) ;
CREATE POLICY "Admins can view all tickets" ON support_tickets FOR SELECT TO public USING ((EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = 'admin'::text))))) ;
CREATE POLICY "Users can create their own tickets" ON support_tickets FOR INSERT TO public WITH CHECK ((auth.uid() = user_id)) ;
CREATE POLICY "Users can view their own tickets" ON support_tickets FOR SELECT TO public USING ((auth.uid() = user_id)) ;

