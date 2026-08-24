-- Comprehensive Seed Data for Phase 0
-- Generated automatically
-- 1. Organizations
INSERT INTO organizations (id, name, type, max_projects, subscription_tier, status) VALUES ('11111111-1111-1111-1111-111111111111', 'Praimo Innovation', 'internal', 100, 'pro', 'active'), ('22222222-2222-2222-2222-222222222222', 'Acme Manufacturing', 'client', 50, 'basic', 'active') ON CONFLICT DO NOTHING;
-- 2. Users (Super Admin, Admins, PMs, Employees, Vendors, Clients)
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('33333333-3333-3333-3333-333333333333', 'super@setuu.com', '+15550000000', 'Super Admin', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('33333333-3333-3333-3333-333333333333', 'super_admin', NULL, 'Super Admin', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('44444444-4444-4444-4444-444444444444', 'admin1@praimo.com', '+15550000000', 'Praimo Admin', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('44444444-4444-4444-4444-444444444444', 'admin', '11111111-1111-1111-1111-111111111111', 'Praimo Admin', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('55555555-5555-5555-5555-555555555555', 'admin2@acme.com', '+15550000000', 'Acme Admin', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('55555555-5555-5555-5555-555555555555', 'admin', '22222222-2222-2222-2222-222222222222', 'Acme Admin', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('66666666-6666-6666-6666-000000000000', 'pm0@praimo.com', '+15550000000', 'Project Manager 0', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('66666666-6666-6666-6666-000000000000', 'pm', '11111111-1111-1111-1111-111111111111', 'Project Manager 0', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('66666666-6666-6666-6666-000000000001', 'pm1@praimo.com', '+15550000000', 'Project Manager 1', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('66666666-6666-6666-6666-000000000001', 'pm', '11111111-1111-1111-1111-111111111111', 'Project Manager 1', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('66666666-6666-6666-6666-000000000002', 'pm2@praimo.com', '+15550000000', 'Project Manager 2', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('66666666-6666-6666-6666-000000000002', 'pm', '11111111-1111-1111-1111-111111111111', 'Project Manager 2', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('77777777-7777-7777-7777-000000000000', 'emp0@praimo.com', '+15550000000', 'Engineer 0', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('77777777-7777-7777-7777-000000000000', 'engineer', '11111111-1111-1111-1111-111111111111', 'Engineer 0', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('77777777-7777-7777-7777-000000000001', 'emp1@praimo.com', '+15550000000', 'Engineer 1', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('77777777-7777-7777-7777-000000000001', 'engineer', '11111111-1111-1111-1111-111111111111', 'Engineer 1', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('77777777-7777-7777-7777-000000000002', 'emp2@praimo.com', '+15550000000', 'Engineer 2', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('77777777-7777-7777-7777-000000000002', 'engineer', '11111111-1111-1111-1111-111111111111', 'Engineer 2', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('77777777-7777-7777-7777-000000000003', 'emp3@praimo.com', '+15550000000', 'Engineer 3', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('77777777-7777-7777-7777-000000000003', 'engineer', '11111111-1111-1111-1111-111111111111', 'Engineer 3', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('77777777-7777-7777-7777-000000000004', 'emp4@praimo.com', '+15550000000', 'Engineer 4', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('77777777-7777-7777-7777-000000000004', 'engineer', '11111111-1111-1111-1111-111111111111', 'Engineer 4', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('88888888-8888-8888-8888-000000000000', 'vendor0@supply.com', '+15550000000', 'Vendor 0', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('88888888-8888-8888-8888-000000000000', 'vendor', '11111111-1111-1111-1111-111111111111', 'Vendor 0', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('88888888-8888-8888-8888-000000000001', 'vendor1@supply.com', '+15550000000', 'Vendor 1', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('88888888-8888-8888-8888-000000000001', 'vendor', '11111111-1111-1111-1111-111111111111', 'Vendor 1', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('88888888-8888-8888-8888-000000000002', 'vendor2@supply.com', '+15550000000', 'Vendor 2', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('88888888-8888-8888-8888-000000000002', 'vendor', '11111111-1111-1111-1111-111111111111', 'Vendor 2', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('99999999-9999-9999-9999-000000000000', 'client0@acme.com', '+15550000000', 'Client 0', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('99999999-9999-9999-9999-000000000000', 'client', '22222222-2222-2222-2222-222222222222', 'Client 0', true) ON CONFLICT DO NOTHING;
INSERT INTO user_identity (actor_id, email, phone, full_name, password_hash) VALUES ('99999999-9999-9999-9999-000000000001', 'client1@acme.com', '+15550000000', 'Client 1', 'hashed_password_mock') ON CONFLICT DO NOTHING;
INSERT INTO user_actor (id, role, organization_id, display_name, is_active) VALUES ('99999999-9999-9999-9999-000000000001', 'client', '22222222-2222-2222-2222-222222222222', 'Client 1', true) ON CONFLICT DO NOTHING;
-- 3. Projects (8 Projects) - Fixed "Archived" status
INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'Project Alpha 0', 'Description for project 0', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-000000000000', 'Not Started', 'Combined') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Project Alpha 1', 'Description for project 1', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-000000000001', 'In Progress', 'Combined') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Project Alpha 2', 'Description for project 2', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-000000000002', 'On Hold', 'Combined') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Project Alpha 3', 'Description for project 3', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-000000000000', 'Completed', 'Combined') ON CONFLICT DO NOTHING;

-- Changed from 'Archived' to 'Completed' (If you want it archived, it relies on the default 'is_archived' column)
INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Project Alpha 4', 'Description for project 4', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-000000000001', 'Completed', 'Combined') ON CONFLICT DO NOTHING;

INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Project Alpha 5', 'Description for project 5', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-000000000002', 'In Progress', 'Combined') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'Project Alpha 6', 'Description for project 6', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-000000000000', 'In Progress', 'Combined') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, name, description, client_org_id, assigned_pm_id, status, type) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'Project Alpha 7', 'Description for project 7', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-000000000001', 'In Progress', 'Combined') ON CONFLICT DO NOTHING;
-- 4. Milestones (20+ Milestones)
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'Phase 1', false, 33, 'Civil', 0) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000000', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000000', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'Phase 2', false, 33, 'Civil', 1) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000001', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000001', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'Phase 3', false, 33, 'Civil', 2) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000002', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000002', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Phase 1', false, 33, 'Civil', 0) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000000', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000000', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Phase 2', false, 33, 'Civil', 1) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000001', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000001', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Phase 3', false, 33, 'Civil', 2) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000002', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-100000000002', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Phase 1', false, 33, 'Civil', 0) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000000', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000000', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Phase 2', false, 33, 'Civil', 1) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000001', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000001', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Phase 3', false, 33, 'Civil', 2) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000002', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-200000000002', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Phase 1', false, 33, 'Civil', 0) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000000', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000000', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Phase 2', false, 33, 'Civil', 1) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000001', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000001', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Phase 3', false, 33, 'Civil', 2) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000002', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-300000000002', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Phase 1', false, 33, 'Civil', 0) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000000', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000000', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Phase 2', false, 33, 'Civil', 1) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000001', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000001', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Phase 3', false, 33, 'Civil', 2) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000002', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-400000000002', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Phase 1', false, 33, 'Civil', 0) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000000', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000000', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Phase 2', false, 33, 'Civil', 1) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000001', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000001', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'Phase 3', false, 33, 'Civil', 2) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000002', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-500000000002', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'Phase 1', false, 33, 'Civil', 0) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000000', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000000', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'Phase 2', false, 33, 'Civil', 1) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000001', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000001', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'Phase 3', false, 33, 'Civil', 2) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000002', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-600000000002', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'Phase 1', false, 33, 'Civil', 0) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000000', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000000', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'Phase 2', false, 33, 'Civil', 1) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000001', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000001', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestones (id, project_id, title, completion_status, weight_percent, department, display_order) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'Phase 3', false, 33, 'Civil', 2) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000002', 'Checklist Item 0', false, 0, now(), now()) ON CONFLICT DO NOTHING;
INSERT INTO milestone_checklist_items (milestone_id, title, is_complete, display_order, created_at, updated_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-700000000002', 'Checklist Item 1', false, 1, now(), now()) ON CONFLICT DO NOTHING;
-- 5. Updates (30+ Updates) AND Attachments - Fixed 'caption', missing 'file_name', and 13-character UUID bugs
INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000000', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-000000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000000', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-000000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-100000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000001', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-100000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-100000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000001', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-100000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-200000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000002', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-200000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-200000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000002', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-200000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-300000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-100000000000', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-300000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-300000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-100000000000', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-300000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-400000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-100000000001', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-400000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-400000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-100000000001', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-400000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-500000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-100000000002', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-500000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-500000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-100000000002', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-500000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-600000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-200000000000', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-600000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-600000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-200000000000', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-600000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-700000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-200000000001', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-700000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-700000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-200000000001', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-700000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-800000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-200000000002', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-800000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-800000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-200000000002', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-800000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-900000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-300000000000', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-900000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-900000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-300000000000', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-900000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

-- Fixed from here: 13 digit suffix removed, remapped to 12 hex valid UUID format
INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a00000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-300000000001', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a00000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a00000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-300000000001', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a00000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a10000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-300000000002', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a10000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a10000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-300000000002', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a10000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a20000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-400000000000', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a20000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a20000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-400000000000', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a20000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a30000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-400000000001', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a30000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a30000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-400000000001', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a30000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a40000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-400000000002', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a40000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a40000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-400000000002', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a40000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a50000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-500000000000', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a50000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a50000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-500000000000', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a50000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a60000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-500000000001', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a60000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a60000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-500000000001', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a60000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a70000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-500000000002', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a70000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a70000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-500000000002', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a70000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a80000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-600000000000', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a80000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a80000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-600000000000', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a80000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a90000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-600000000001', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a90000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-a90000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-600000000001', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-a90000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-b00000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-600000000002', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-b00000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-b00000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-600000000002', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-b00000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-b10000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-700000000000', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-b10000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-b10000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-700000000000', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-b10000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-b20000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-700000000001', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-b20000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-b20000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-700000000001', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-b20000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-b30000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-700000000002', '77777777-7777-7777-7777-000000000000', 'Site update 0 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-b30000000000', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;

INSERT INTO updates (id, project_id, milestone_id, author_id, caption, location_name, latitude, longitude) VALUES ('cccccccc-cccc-cccc-cccc-b30000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-700000000002', '77777777-7777-7777-7777-000000000000', 'Site update 1 for milestone', 'Site A', 37.77, -122.41) ON CONFLICT DO NOTHING;
INSERT INTO media_attachments (update_id, url, type, uploaded_by, file_name) VALUES ('cccccccc-cccc-cccc-cccc-b30000000001', 'https://example.com/photo.jpg', 'image', '77777777-7777-7777-7777-000000000000', 'photo.jpg') ON CONFLICT DO NOTHING;
-- 6. Comments (15+ Comments)
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-000000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 0') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-000000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 1') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-100000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 2') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-100000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 3') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-200000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 4') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-200000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 5') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-300000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 6') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-300000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 7') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-400000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 8') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-400000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 9') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-500000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 10') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-500000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 11') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-600000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 12') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-600000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 13') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-700000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 14') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-700000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 15') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-800000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 16') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-800000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 17') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-900000000000', '77777777-7777-7777-7777-000000000001', 'Looks good 18') ON CONFLICT DO NOTHING;
INSERT INTO comments (update_id, author_id, content) VALUES ('cccccccc-cccc-cccc-cccc-900000000001', '77777777-7777-7777-7777-000000000001', 'Looks good 19') ON CONFLICT DO NOTHING;
-- 7. Acknowledgements (10+ Acks) - Fixed to Title Case
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-000000000000', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-000000000001', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-100000000000', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-100000000001', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-200000000000', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-200000000001', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-300000000000', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-300000000001', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-400000000000', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-400000000001', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-500000000000', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-500000000001', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-600000000000', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-600000000001', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
INSERT INTO acknowledgements (update_id, client_id, status) VALUES ('cccccccc-cccc-cccc-cccc-700000000000', '99999999-9999-9999-9999-000000000000', 'Acknowledged') ON CONFLICT DO NOTHING;
-- 8. Materials, Issues, Change Requests, etc. - Fixed constraints
INSERT INTO project_materials (project_id, item_name, quantity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'Steel Beams', 100, 'Ordered') ON CONFLICT DO NOTHING;
INSERT INTO project_issues (project_id, title, severity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'Delay in delivery', 'High', 'Open') ON CONFLICT DO NOTHING;
INSERT INTO change_requests (project_id, title, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000000', 'Design change', 'Pending') ON CONFLICT DO NOTHING;
INSERT INTO project_materials (project_id, item_name, quantity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Steel Beams', 100, 'Ordered') ON CONFLICT DO NOTHING;
INSERT INTO project_issues (project_id, title, severity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Delay in delivery', 'High', 'Open') ON CONFLICT DO NOTHING;
INSERT INTO change_requests (project_id, title, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'Design change', 'Pending') ON CONFLICT DO NOTHING;
INSERT INTO project_materials (project_id, item_name, quantity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Steel Beams', 100, 'Ordered') ON CONFLICT DO NOTHING;
INSERT INTO project_issues (project_id, title, severity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Delay in delivery', 'High', 'Open') ON CONFLICT DO NOTHING;
INSERT INTO change_requests (project_id, title, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000002', 'Design change', 'Pending') ON CONFLICT DO NOTHING;
INSERT INTO project_materials (project_id, item_name, quantity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Steel Beams', 100, 'Ordered') ON CONFLICT DO NOTHING;
INSERT INTO project_issues (project_id, title, severity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Delay in delivery', 'High', 'Open') ON CONFLICT DO NOTHING;
INSERT INTO change_requests (project_id, title, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000003', 'Design change', 'Pending') ON CONFLICT DO NOTHING;
INSERT INTO project_materials (project_id, item_name, quantity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Steel Beams', 100, 'Ordered') ON CONFLICT DO NOTHING;
INSERT INTO project_issues (project_id, title, severity, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Delay in delivery', 'High', 'Open') ON CONFLICT DO NOTHING;
INSERT INTO change_requests (project_id, title, status) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000004', 'Design change', 'Pending') ON CONFLICT DO NOTHING;
-- 9. Audit Logs & Break-glass Logs
INSERT INTO audit_log (event_type, table_name, resource_id) VALUES ('UPDATE', 'projects', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000000') ON CONFLICT DO NOTHING;
INSERT INTO break_glass_logs (super_admin_id, target_org_id, reason) VALUES ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Emergency maintenance') ON CONFLICT DO NOTHING;
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
