## Table `user_identity`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `actor_id` | `uuid` | Primary |
| `email` | `varchar` | Nullable Unique |
| `phone` | `varchar` | Nullable |
| `full_name` | `varchar` | |
| `password_hash` | `varchar` | |
| `biometric_enabled` | `bool` | Nullable |

## Table `organizations`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `name` | `text` | |
| `type` | `text` | |
| `created_at` | `timestamptz` | Nullable |
| `max_projects` | `int4` | |
| `subscription_tier` | `text` | |
| `status` | `text` | Nullable |

## Table `user_actor`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `role` | `text` | |
| `organization_id` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `display_name` | `text` | Nullable |
| `is_active` | `bool` | Nullable |
| `failed_login_attempts` | `int4` | Nullable |
| `lockout_until` | `timestamptz` | Nullable |
| `bio` | `text` | Nullable |
| `avatar_url` | `text` | Nullable |

## Table `projects`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `name` | `text` | |
| `description` | `text` | Nullable |
| `client_org_id` | `uuid` | Nullable |
| `assigned_pm_id` | `uuid` | Nullable |
| `status` | `text` | |
| `created_at` | `timestamptz` | Nullable |
| `start_date` | `date` | Nullable |
| `type` | `project_type` | Nullable |
| `tags` | `_text` | Nullable |
| `is_archived` | `bool` | Nullable |
| `contract_value` | `numeric` | Nullable |
| `client_visibility` | `text` | Nullable |
| `po_reference` | `text` | Nullable |
| `target_date` | `date` | Nullable |

## Table `milestones`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `title` | `text` | |
| `description` | `text` | Nullable |
| `target_date` | `timestamptz` | Nullable |
| `completion_status` | `bool` | Nullable |
| `weight_percent` | `int4` | Nullable |
| `department` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `display_order` | `int4` | Nullable |

## Table `updates`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `milestone_id` | `uuid` | Nullable |
| `author_id` | `uuid` | |
| `caption` | `text` | Nullable |
| `location_name` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `latitude` | `numeric` | Nullable |
| `longitude` | `numeric` | Nullable |
| `is_watermarked` | `bool` | Nullable |
| `approval_status` | `text` | Nullable |

## Table `media_attachments`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `update_id` | `uuid` | |
| `type` | `media_type` | |
| `url` | `text` | |
| `file_name` | `text` | |
| `file_size_bytes` | `int8` | Nullable |
| `mime_type` | `text` | Nullable |
| `uploaded_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | |

## Table `comments`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `update_id` | `uuid` |  |
| `author_id` | `uuid` |  |
| `content` | `text` |  |
| `created_at` | `timestamptz` |  |

## Table `comment_mentions`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `comment_id` | `uuid` |  |
| `mentioned_user_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

## Table `acknowledgements`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `update_id` | `uuid` |  |
| `client_id` | `uuid` |  |
| `status` | `ack_status` |  |
| `notes` | `text` |  Nullable |
| `created_at` | `timestamptz` |  |

## Table `push_tokens`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `user_id` | `uuid` | |
| `token` | `text` | |
| `platform` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

## Table `notifications`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `user_id` | `uuid` | |
| `title` | `text` | |
| `body` | `text` | |
| `type` | `notification_type` | |
| `reference_id` | `uuid` | Nullable |
| `is_read` | `bool` | |
| `created_at` | `timestamptz` | |

## Table `project_materials`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `item_name` | `text` | |
| `quantity` | `numeric` | |
| `status` | `text` | |
| `estimated_delivery` | `date` | Nullable |
| `actual_delivery` | `date` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `po_number` | `text` | Nullable |
| `spec_id` | `text` | Nullable |
| `supplier_name` | `text` | Nullable |
| `lead_time` | `text` | Nullable |
| `tracking_timeline` | `jsonb` | Nullable |
| `expected_arrival_date` | `timestamptz` | Nullable |
| `vendor_id` | `uuid` | Nullable |

## Table `project_issues`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `title` | `text` | |
| `description` | `text` | Nullable |
| `severity` | `text` | |
| `status` | `text` | |
| `assigned_to` | `uuid` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `resolved_at` | `timestamptz` | Nullable |
| `display_id` | `text` | Nullable |
| `root_cause` | `text` | Nullable |
| `timeline_impact` | `text` | Nullable |
| `cost_impact` | `text` | Nullable |
| `resolution_plan` | `jsonb` | Nullable |
| `linked_milestones` | `jsonb` | Nullable |

## Table `change_requests`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `title` | `text` | |
| `description` | `text` | Nullable |
| `cost_impact` | `numeric` | Nullable |
| `time_impact_days` | `int4` | Nullable |
| `status` | `text` | |
| `approved_by` | `uuid` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `display_id` | `text` | Nullable |
| `approval_workflow` | `jsonb` | Nullable |

## Table `project_resources`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `resource_type` | `text` | |
| `name` | `text` | |
| `allocated_hours` | `numeric` | Nullable |
| `productivity_score` | `int4` | Nullable |
| `notes` | `text` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `actual_hours` | `numeric` | Nullable |
| `current_assignment` | `text` | Nullable |

## Table `client_approvals`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `document_title` | `text` | |
| `document_url` | `text` | Nullable |
| `status` | `text` | |
| `comments` | `text` | Nullable |
| `approved_by` | `uuid` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `actioned_at` | `timestamptz` | Nullable |
| `display_id` | `text` | Nullable |
| `milestone_name` | `text` | Nullable |
| `final_authority` | `jsonb` | Nullable |
| `attached_documents` | `jsonb` | Nullable |
| `approval_timeline` | `jsonb` | Nullable |

## Table `lessons_learned`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `category` | `text` | |
| `description` | `text` | |
| `impact` | `text` | Nullable |
| `recommendation` | `text` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `display_id` | `text` | Nullable |
| `title` | `text` | Nullable |
| `root_cause` | `text` | Nullable |
| `related_media` | `jsonb` | Nullable |

## Table `project_handovers`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `package_name` | `text` | |
| `document_url` | `text` | Nullable |
| `warranty_expiry` | `date` | Nullable |
| `status` | `text` | |
| `client_signature_url` | `text` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `display_id` | `text` | Nullable |
| `description` | `text` | Nullable |
| `key_attributes` | `jsonb` | Nullable |
| `package_contents` | `jsonb` | Nullable |
| `sign_off_status` | `jsonb` | Nullable |

## Table `client_meetings`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `title` | `text` | |
| `meeting_date` | `timestamptz` | |
| `attendees` | `text` | Nullable |
| `minutes_url` | `text` | Nullable |
| `action_items` | `text` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `status` | `text` | Nullable |
| `description` | `text` | Nullable |
| `key_attributes` | `jsonb` | Nullable |
| `attendees_list` | `jsonb` | Nullable |
| `agenda_minutes` | `jsonb` | Nullable |
| `action_items_list` | `jsonb` | Nullable |

## Table `audit_log`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `user_id` | `uuid` | Nullable |
| `event_type` | `text` | |
| `table_name` | `text` | |
| `resource_id` | `uuid` | |
| `old_data` | `jsonb` | Nullable |
| `new_data` | `jsonb` | Nullable |
| `ip_address` | `text` | Nullable |
| `created_at` | `timestamptz` | |

## Table `milestone_checklist_items`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `milestone_id` | `uuid` | |
| `title` | `text` | |
| `is_complete` | `bool` | |
| `display_order` | `int4` | |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

## Table `drawing_versions`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `drawing_name` | `text` | |
| `version_number` | `int4` | |
| `file_url` | `text` | |
| `file_size_bytes` | `int8` | Nullable |
| `description` | `text` | Nullable |
| `status` | `text` | |
| `uploaded_by` | `uuid` | Nullable |
| `approved_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | |
| `drawing_id` | `uuid` | Nullable |

## Table `project_config`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `module_name` | `text` | |
| `is_enabled` | `bool` | |
| `updated_by` | `uuid` | Nullable |
| `updated_at` | `timestamptz` | |

## Table `project_reports`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `project_id` | `uuid` |  Nullable |
| `report_data` | `text` |  |
| `generated_at` | `timestamptz` |  Nullable |

## Table `duplicate_files`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `original_file_id` | `uuid` |  |
| `duplicate_file_id` | `uuid` |  |
| `similarity_score` | `numeric` |  |
| `status` | `text` |  |

## Table `virus_scan_results`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `file_id` | `uuid` | |
| `is_clean` | `bool` | |
| `threats_found` | `text` | Nullable |
| `scanned_at` | `timestamptz` | Nullable |

## Table `support_tickets`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `title` | `text` | |
| `description` | `text` | |
| `priority` | `text` | |
| `user_id` | `uuid` | Nullable |
| `created_at` | `timestamptz` | |
| `status` | `text` | |
| `resolution_notes` | `text` | Nullable |
| `updated_at` | `timestamptz` | |

## Table `subscription_tiers`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `tier_name` | `text` | Primary |
| `max_storage_gb` | `int4` |  |
| `max_projects` | `int4` |  |

## Table `platform_settings`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `maintenance_mode` | `bool` | |
| `min_android_version` | `text` | Nullable |
| `global_announcement` | `text` | Nullable |

## Table `break_glass_logs`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `super_admin_id` | `uuid` |  |
| `target_org_id` | `uuid` |  |
| `reason` | `text` |  |
| `created_at` | `timestamptz` |  |

## Table `org_vendors`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `organization_id` | `uuid` |  |
| `vendor_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

## Table `project_vendors`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `project_id` | `uuid` |  |
| `vendor_id` | `uuid` |  |
| `created_at` | `timestamptz` |  |

## Table `tasks`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `assignee_id` | `uuid` | Nullable |
| `created_by` | `uuid` | |
| `title` | `text` | |
| `description` | `text` | Nullable |
| `status` | `text` | |
| `priority` | `text` | |
| `due_date` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

## Table timesheets

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `user_id` | `uuid` | |
| `date` | `date` | |
| `hours` | `numeric` | |
| `description` | `text` | Nullable |
| `status` | `text` | |
| `created_at` | `timestamptz` | |

## Table invoices

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `vendor_id` | `uuid` | |
| `amount` | `numeric` | |
| `status` | `text` | |
| `invoice_url` | `text` | Nullable |
| `due_date` | `date` | Nullable |
| `created_at` | `timestamptz` | |

## Table wiki_docs

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `title` | `text` | |
| `content` | `text` | |
| `created_by` | `uuid` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Nullable |

## Custom Types / Enums

### `project_type`

`Mechanical` | `Electrical` | `Software` | `Combined`

### `project_status`

`Not Started` | `In Progress` | `On Hold` | `Completed` | `Delivered`

### `department_type`

`Mechanical` | `Electrical` | `Software` | `General`

### `media_type`

`image` | `video` | `document`

### `ack_status`

`Acknowledged` | `Needs Discussion`

### `notification_type`

`update` | `comment` | `mention` | `project` | `system`

## RLS Policies

### `projects`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins have full project access` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Clients can view org projects` | SELECT | public | PERMISSIVE | `((client_org_id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))) OR is_admin())` | — |
| `Employees can view all projects` | SELECT | public | PERMISSIVE | `is_employee()` | — |
| `PMs can view assigned projects` | SELECT | public | PERMISSIVE | `((auth.uid() = assigned_pm_id) OR is_admin())` | — |
| `Vendors can view assigned projects` | SELECT | public | PERMISSIVE | `((EXISTS ( SELECT 1    FROM project_vendors   WHERE ((project_vendors.project_id = projects.id) AND (project_vendors.vendor_id = auth.uid())))) OR (EXISTS ( SELECT 1    FROM org_vendors   WHERE ((org_vendors.organization_id = projects.client_org_id) AND (org_vendors.vendor_id = auth.uid())))))` | — |

### `updates`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Authors and Admins can update` | UPDATE | public | PERMISSIVE | `((auth.uid() = author_id) OR is_admin())` | — |
| `Employees can create updates` | INSERT | public | PERMISSIVE | — | `((auth.uid() = author_id) AND is_employee())` |
| `PMs can create updates for assigned projects` | INSERT | public | PERMISSIVE | — | `((auth.uid() = author_id) AND (EXISTS ( SELECT 1    FROM projects   WHERE ((projects.id = updates.project_id) AND (projects.assigned_pm_id = auth.uid())))))` |
| `Users can view updates for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = updates.project_id)))` | — |
| `Vendors can manage own updates` | ALL | public | PERMISSIVE | `((author_id = auth.uid()) AND (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'vendor'::text))` | — |

### `user_actor`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins can modify all profiles` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Admins can view all profiles` | SELECT | public | PERMISSIVE | `is_admin()` | — |
| `Super Admins can view all profiles for billing` | SELECT | public | PERMISSIVE | `(( SELECT user_actor_1.role    FROM user_actor user_actor_1   WHERE (user_actor_1.id = auth.uid())) = 'super_admin'::text)` | — |
| `Users can view own profile` | SELECT | public | PERMISSIVE | `(id = auth.uid())` | — |

### `media_attachments`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Authors can add attachments` | INSERT | public | PERMISSIVE | — | `((auth.uid() = uploaded_by) AND (EXISTS ( SELECT 1    FROM updates   WHERE ((updates.id = media_attachments.update_id) AND (updates.author_id = auth.uid())))))` |
| `Users can view attachments of visible updates` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = media_attachments.update_id)))` | — |

### `subscription_tiers`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Anyone can view tiers` | SELECT | public | PERMISSIVE | `true` | — |
| `Super Admins can manage tiers` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'super_admin'::text)` | — |

### `platform_settings`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Anyone can view settings` | SELECT | public | PERMISSIVE | `true` | — |
| `Super Admins can manage settings` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'super_admin'::text)` | — |

### `break_glass_logs`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins can view their orgs break glass logs` | SELECT | public | PERMISSIVE | `((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text) AND (target_org_id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))))` | — |
| `Super Admins can insert` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'super_admin'::text)` |
| `Super admins can view break glass logs` | SELECT | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'super_admin'::text)` | — |

### `org_vendors`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins can manage org vendors` | ALL | public | PERMISSIVE | `((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text) AND (organization_id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))))` | — |
| `Vendors can view their org assignments` | SELECT | public | PERMISSIVE | `(vendor_id = auth.uid())` | — |

### `project_vendors`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins and PMs can manage project vendors` | ALL | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = ANY (ARRAY['admin'::text, 'pm'::text])))))` | — |
| `Vendors can view their project assignments` | SELECT | public | PERMISSIVE | `(vendor_id = auth.uid())` | — |

### `organizations`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins have full access to organizations` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `Super Admins can view organizations for billing` | SELECT | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'super_admin'::text)` | — |
| `Users can view their organization` | SELECT | public | PERMISSIVE | `((id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |

### `comments`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can create comments` | INSERT | public | PERMISSIVE | — | `((auth.uid() = author_id) AND (EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = comments.update_id))))` |
| `Users can view comments of visible updates` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = comments.update_id)))` | — |

### `acknowledgements`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Clients can acknowledge` | INSERT | public | PERMISSIVE | — | `((auth.uid() = client_id) AND (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'client'::text) AND (EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = acknowledgements.update_id))))` |
| `Clients can update own acks` | UPDATE | public | PERMISSIVE | `(auth.uid() = client_id)` | — |
| `Users can view acks of visible updates` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = acknowledgements.update_id)))` | — |

### `push_tokens`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can manage their own tokens` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

### `notifications`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can manage their own notifications` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

### `project_issues`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify project_issues` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert project_issues` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view project_issues for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_issues.project_id)))` | — |

### `change_requests`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify change_requests` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert change_requests` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view change_requests for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = change_requests.project_id)))` | — |

### `project_resources`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify project_resources` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert project_resources` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view project_resources for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_resources.project_id)))` | — |

### `client_approvals`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify client_approvals` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert client_approvals` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view client_approvals for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = client_approvals.project_id)))` | — |

### `project_materials`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify project_materials` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert project_materials` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view project_materials for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_materials.project_id)))` | — |
| `Vendors can manage assigned materials` | ALL | public | PERMISSIVE | `(vendor_id = auth.uid())` | — |

### `lessons_learned`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify lessons_learned` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert lessons_learned` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view lessons_learned for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = lessons_learned.project_id)))` | — |

### `project_handovers`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify project_handovers` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert project_handovers` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view project_handovers for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_handovers.project_id)))` | — |

### `client_meetings`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify client_meetings` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert client_meetings` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view client_meetings for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = client_meetings.project_id)))` | — |

### `tasks`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `PMs can manage tasks` | ALL | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects p   WHERE ((p.id = tasks.project_id) AND ((p.assigned_pm_id = auth.uid()) OR (( SELECT user_actor.role            FROM user_actor           WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['admin'::text, 'super_admin'::text]))))))` | — |
| `Users can view tasks` | SELECT | public | PERMISSIVE | `((assignee_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM projects p   WHERE ((p.id = tasks.project_id) AND ((p.assigned_pm_id = auth.uid()) OR (( SELECT user_actor.role            FROM user_actor           WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['admin'::text, 'super_admin'::text])))))))` | — |
| `Vendors can update assigned task status` | UPDATE | public | PERMISSIVE | `(assignee_id = auth.uid())` | — |

### `audit_log`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins can view audit logs` | SELECT | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `Deny all manual modifications to audit logs` | ALL | public | PERMISSIVE | `false` | — |

### `drawing_versions`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify drawings` | ALL | public | PERMISSIVE | `((auth.uid() = uploaded_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can manage drawings` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view drawings for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = drawing_versions.project_id)))` | — |

### `project_config`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins can manage project config` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `Users can view config for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_config.project_id)))` | — |

### `milestone_checklist_items`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `PMs and Admins can manage checklist items` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` | — |
| `Users can view checklist items for visible milestones` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM (milestones m      JOIN projects p ON ((p.id = m.project_id)))   WHERE (m.id = milestone_checklist_items.milestone_id)))` | — |

### `user_identity`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can update own identity` | UPDATE | public | PERMISSIVE | `(actor_id = auth.uid())` | — |
| `Users can view own identity` | SELECT | public | PERMISSIVE | `(actor_id = auth.uid())` | — |

### `milestones`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins have full access to milestones` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `PMs can create and modify milestones for assigned projects` | ALL | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE ((projects.id = milestones.project_id) AND (projects.assigned_pm_id = auth.uid()))))` | — |
| `Users can view milestones for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects p   WHERE ((p.id = milestones.project_id) AND ((p.assigned_pm_id = auth.uid()) OR (p.client_org_id = ( SELECT user_actor.organization_id            FROM user_actor           WHERE (user_actor.id = auth.uid()))) OR (( SELECT user_actor.role            FROM user_actor           WHERE (user_actor.id = auth.uid())) = 'admin'::text)))))` | — |

### `support_tickets`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins and Super Admins can update tickets` | UPDATE | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))` | — |
| `Admins and Super Admins can view all tickets` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))` | — |
| `Admins can view all tickets` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = 'admin'::text))))` | — |
| `Users can create their own tickets` | INSERT | public | PERMISSIVE | — | `(auth.uid() = user_id)` |
| `Users can view their own tickets` | SELECT | public | PERMISSIVE | `(auth.uid() = user_id)` | — |

### `timesheets`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins can manage timesheets` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role FROM user_actor WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `Users can view and create their own timesheets` | ALL | public | PERMISSIVE | `(user_id = auth.uid())` | `(user_id = auth.uid())` |
| `PMs can view timesheets for assigned projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1 FROM projects WHERE ((projects.id = timesheets.project_id) AND (projects.assigned_pm_id = auth.uid()))))` | — |

### `invoices`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins can manage invoices` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role FROM user_actor WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `Vendors can manage their own invoices` | ALL | public | PERMISSIVE | `(vendor_id = auth.uid())` | `(vendor_id = auth.uid())` |
| `PMs can view invoices for assigned projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1 FROM projects WHERE ((projects.id = invoices.project_id) AND (projects.assigned_pm_id = auth.uid()))))` | — |

### `wiki_docs`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins can manage wiki_docs` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role FROM user_actor WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `Users can view wiki_docs for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1 FROM projects WHERE (projects.id = wiki_docs.project_id)))` | — |
| `Project members can create wiki_docs` | INSERT | public | PERMISSIVE | — | `(EXISTS ( SELECT 1 FROM projects WHERE (projects.id = wiki_docs.project_id)))` |
| `Creators can update their wiki_docs` | UPDATE | public | PERMISSIVE | `(created_by = auth.uid())` | — |
