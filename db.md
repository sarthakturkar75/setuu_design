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
| `user_preferences` | `jsonb` | Nullable |
| `employment_type` | `text` | Nullable |
| `skills` | `_text` | Nullable |
| `hourly_rate` | `numeric` | Nullable |
| `phone_number` | `text` | Nullable |
| `rfid_badge_id` | `text` | Nullable |

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
| `contingency_amount` | `numeric` | Nullable |
| `display_id` | `varchar` | Nullable Unique |
| `product_name` | `varchar` | Nullable |
| `lead_engineer_id` | `uuid` | Nullable |
| `executive_remarks` | `text` | Nullable |
| `cached_completion_percent` | `numeric` | Nullable |

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
| `wbs_code` | `text` | Nullable |
| `sov_value` | `numeric` | Nullable |
| `custom_data` | `jsonb` | Nullable |
| `baseline_start_date` | `date` | Nullable |
| `baseline_end_date` | `date` | Nullable |
| `is_exterior` | `bool` | Nullable |

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
| `weather_data` | `jsonb` | Nullable |
| `ai_analysis_flags` | `jsonb` | Nullable |

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
| `location_id` | `uuid` | Nullable |
| `qr_uuid` | `uuid` | Nullable Unique |
| `submittal_id` | `uuid` | Nullable |
| `custom_data` | `jsonb` | Nullable |
| `current_stock` | `numeric` | Nullable |
| `reorder_threshold` | `numeric` | Nullable |
| `unit_cost` | `numeric` | Nullable |

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
| `sla_deadline` | `timestamptz` | Nullable |
| `root_cause_id` | `uuid` | Nullable |
| `estimated_rework_cost` | `numeric` | Nullable |
| `custom_data` | `jsonb` | Nullable |
| `item_type` | `varchar` | Nullable |
| `closure_remarks` | `text` | Nullable |

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
| `custom_data` | `jsonb` | Nullable |

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
| `custom_data` | `jsonb` | Nullable |

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
| `display_id` | `varchar` | Nullable Unique |
| `department` | `department_type` | Nullable |
| `planned_start_date` | `date` | Nullable |
| `planned_finish_date` | `date` | Nullable |
| `actual_start_date` | `date` | Nullable |
| `actual_finish_date` | `date` | Nullable |
| `duration_days` | `int4` | Nullable |
| `planned_percent_complete` | `int4` | Nullable |
| `actual_percent_complete` | `int4` | Nullable |
| `remarks` | `text` | Nullable |
| `delay_days` | `int4` | Nullable |

## Table `employee_timesheets`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `user_id` | `uuid` | |
| `project_id` | `uuid` | |
| `organization_id` | `uuid` | |
| `work_date` | `date` | |
| `start_time` | `time` | |
| `end_time` | `time` | |
| `hours_logged` | `numeric` | |
| `status` | `text` | Nullable |
| `notes` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `updated_at` | `timestamptz` | Nullable |

## Table `client_meeting_agendas`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `meeting_id` | `uuid` | |
| `topic` | `text` | |
| `duration` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `updated_at` | `timestamptz` | Nullable |

## Table `scheduled_reports`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `name` | `text` | |
| `format` | `text` | |
| `schedule` | `text` | |
| `next_run` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `created_by` | `uuid` | Nullable |
| `project_id` | `uuid` | Nullable |
| `parameters` | `jsonb` | Nullable |

## Table `invoices`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `vendor_id` | `uuid` | |
| `project_id` | `uuid` | |
| `invoice_number` | `text` | |
| `amount` | `numeric` | |
| `currency` | `text` | Nullable |
| `status` | `text` | |
| `due_date` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `updated_at` | `timestamptz` | Nullable |

## Table `public_shares`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `secure_token` | `text` | Unique |
| `expires_at` | `timestamptz` | Nullable |
| `created_by` | `uuid` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `timeline_dependencies`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `predecessor_id` | `uuid` | Nullable |
| `successor_id` | `uuid` | Nullable |
| `dep_type` | `dependency_type` | Nullable |
| `lag_days` | `int4` | Nullable |

## Table `timeline_scenarios`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `name` | `text` | |
| `created_at` | `timestamptz` | Nullable |
| `payload` | `jsonb` | Nullable |

## Table `weather_logs`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `log_date` | `date` | |
| `precipitation_mm` | `numeric` | Nullable |
| `delay_triggered` | `bool` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `milestone_status_history`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `milestone_id` | `uuid` | Nullable |
| `status_name` | `text` | |
| `entered_at` | `timestamptz` | Nullable |
| `exited_at` | `timestamptz` | Nullable |

## Table `workflow_automations`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `trigger_event` | `text` | |
| `action_type` | `text` | |
| `payload` | `jsonb` | Nullable |
| `is_active` | `bool` | Nullable |

## Table `change_signatures`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `change_id` | `uuid` | Nullable |
| `signer_id` | `uuid` | Nullable |
| `role` | `text` | Nullable |
| `signed_at` | `timestamptz` | Nullable |
| `ip_address` | `text` | Nullable |
| `esign_envelope_id` | `text` | Nullable |

## Table `change_requests_history`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `change_id` | `uuid` | Nullable |
| `snapshot_data` | `jsonb` | |
| `changed_by` | `uuid` | Nullable |
| `changed_at` | `timestamptz` | Nullable |

## Table `site_locations`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `name` | `text` | |
| `zone` | `text` | Nullable |

## Table `material_waste_logs`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `material_id` | `uuid` | Nullable |
| `quantity_wasted` | `numeric` | |
| `financial_loss` | `numeric` | Nullable |
| `reason` | `text` | Nullable |
| `logged_at` | `timestamptz` | Nullable |

## Table `issue_root_causes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  |
| `category` | `text` |  Nullable |

## Table `bim_clashes`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `project_id` | `uuid` |  Nullable |
| `issue_id` | `uuid` |  Nullable |
| `model_urn` | `text` |  |
| `clash_xyz` | `jsonb` |  |

## Table `issue_inspections`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `issue_id` | `uuid` | Nullable |
| `checklist_json` | `jsonb` | |
| `inspector_id` | `uuid` | Nullable |
| `conducted_at` | `timestamptz` | Nullable |

## Table `drawing_hyperlinks`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `source_drawing_id` | `uuid` | Nullable |
| `target_drawing_id` | `uuid` | Nullable |
| `bounding_box_json` | `jsonb` | |

## Table `drawing_pins`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `drawing_id` | `uuid` | Nullable |
| `x_coord` | `numeric` | |
| `y_coord` | `numeric` | |
| `linked_entity_type` | `text` | Nullable |
| `linked_entity_id` | `uuid` | Nullable |

## Table `batch_upload_jobs`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `status` | `text` | Nullable |
| `total_pages` | `int4` | Nullable |
| `processed_pages` | `int4` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `transmittals`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `sender_id` | `uuid` | Nullable |
| `subject` | `text` | |
| `payload` | `jsonb` | Nullable |
| `sent_at` | `timestamptz` | Nullable |

## Table `transmittal_recipients`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `transmittal_id` | `uuid` | Primary |
| `recipient_id` | `uuid` | Primary |
| `read_at` | `timestamptz` | Nullable |
| `legally_binding` | `bool` | Nullable |

## Table `meeting_minutes`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `audio_url` | `text` | Nullable |
| `ai_transcript` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `user_certifications`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `user_id` | `uuid` | Nullable |
| `cert_type` | `text` | |
| `expiry_date` | `date` | Nullable |
| `file_url` | `text` | Nullable |

## Table `user_billing_rates`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable |
| `hourly_rate` | `numeric` |  |
| `effective_date` | `date` |  |

## Table `site_access_logs`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `user_id` | `uuid` | Nullable |
| `project_id` | `uuid` | Nullable |
| `scanned_at` | `timestamptz` | Nullable |
| `direction` | `text` | Nullable |

## Table `muster_events`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `initiated_by` | `uuid` | Nullable |
| `started_at` | `timestamptz` | Nullable |

## Table `muster_responses`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `event_id` | `uuid` | Primary |
| `user_id` | `uuid` | Primary |
| `status` | `text` | Nullable |
| `responded_at` | `timestamptz` | Nullable |

## Table `equipment_telemetry`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `equipment_id` | `uuid` | Nullable |
| `engine_hours` | `numeric` | Nullable |
| `lat` | `numeric` | Nullable |
| `lng` | `numeric` | Nullable |
| `last_ping` | `timestamptz` | Nullable |

## Table `union_compliance_rules`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `trade_name` | `text` |  |
| `max_hours` | `int4` |  Nullable |
| `required_break_mins` | `int4` |  Nullable |

## Table `vendor_invoices`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `vendor_id` | `uuid` | Nullable |
| `project_id` | `uuid` | Nullable |
| `billed_hours` | `numeric` | Nullable |
| `amount` | `numeric` | Nullable |
| `status` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `project_assets`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `asset_tag` | `text` | Unique |
| `name` | `text` | |
| `warranty_end` | `date` | Nullable |
| `om_manual_url` | `text` | Nullable |

## Table `financial_retentions`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `vendor_id` | `uuid` | Nullable |
| `retention_percentage` | `numeric` | Nullable |
| `status` | `text` | Nullable |

## Table `video_exports`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `status` | `text` | Nullable |
| `file_url` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `role_default_views`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `role_name` | `text` | Primary |
| `default_module_path` | `text` |  |

## Table `custom_fields_schema`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `entity_type` | `text` |  |
| `field_name` | `text` |  |
| `field_type` | `text` |  |

## Table `data_retention_policies`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `entity_type` | `text` |  |
| `days_to_keep` | `int4` |  |
| `action` | `text` |  Nullable |

## Table `project_communications`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `sender_id` | `uuid` | |
| `message` | `text` | |
| `translated_message_es` | `text` | Nullable |
| `audio_url` | `text` | Nullable |
| `is_transmittal` | `bool` | Nullable |
| `is_broadcast` | `bool` | Nullable |
| `drawing_id` | `uuid` | Nullable |
| `issue_id` | `uuid` | Nullable |
| `custom_data` | `jsonb` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `communication_mentions`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `communication_id` | `uuid` | |
| `mentioned_user_id` | `uuid` | |
| `is_read` | `bool` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `communication_reads`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `communication_id` | `uuid` |  |
| `user_id` | `uuid` |  |
| `read_at` | `timestamptz` |  Nullable |

## Table `project_submittals`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `title` | `text` | |
| `spec_section` | `text` | Nullable |
| `status` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |
| `planned_submission_date` | `date` | Nullable |
| `actual_submission_date` | `date` | Nullable |
| `revision_number` | `int4` | Nullable |
| `remarks` | `text` | Nullable |

## Table `purchase_orders`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `material_id` | `uuid` | Nullable |
| `po_number` | `text` | Nullable |
| `status` | `text` | Nullable |
| `total_amount` | `numeric` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `personnel_certifications`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `user_id` | `uuid` | |
| `cert_name` | `text` | |
| `expiry_date` | `timestamptz` | |
| `is_verified` | `bool` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `project_granular_permissions`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `user_id` | `uuid` | |
| `can_view_drawings` | `bool` | Nullable |
| `can_view_financials` | `bool` | Nullable |
| `can_edit_timeline` | `bool` | Nullable |
| `can_manage_issues` | `bool` | Nullable |
| `can_approve_changes` | `bool` | Nullable |
| `can_manage_materials` | `bool` | Nullable |
| `can_manage_labor` | `bool` | Nullable |
| `can_view_reports` | `bool` | Nullable |

## Table `turnstile_logs`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `user_id` | `uuid` | |
| `project_id` | `uuid` | |
| `entry_time` | `timestamptz` | |
| `exit_time` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `muster_roll_events`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | |
| `initiated_by` | `uuid` | Nullable |
| `status` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |

## Table `muster_roll_responses`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `event_id` | `uuid` | |
| `user_id` | `uuid` | |
| `status` | `text` | Nullable |
| `responded_at` | `timestamptz` | Nullable |

## Table `company_skills_tags`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Unique |

## Table `project_requirements`

### Columns

| Name | Type | Constraints |
| ------ | ------ | ------------- |
| `id` | `uuid` | Primary |
| `project_id` | `uuid` | Nullable |
| `display_id` | `varchar` | Nullable Unique |
| `title` | `text` | Nullable |
| `category` | `text` | Nullable |
| `description` | `text` | Nullable |
| `specification_value` | `text` | Nullable |
| `customer_requirement` | `text` | Nullable |
| `priority` | `severity_level` | Nullable |
| `source_document` | `text` | Nullable |
| `responsible_id` | `uuid` | Nullable |
| `status` | `text` | Nullable |
| `remarks` | `text` | Nullable |
| `created_at` | `timestamptz` | Nullable |

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

### `severity_level`

`Low` | `Medium` | `High` | `Critical`

### `dependency_type`

`FS` | `SS` | `FF` | `SF`

## RLS Policies

### `drawing_hyperlinks`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to drawing_hyperlinks` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `batch_upload_jobs`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to batch_upload_jobs` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view batch_upload_jobs for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = batch_upload_jobs.project_id)))` | — |

### `media_attachments`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Authors can add attachments` | INSERT | public | PERMISSIVE | — | `((auth.uid() = uploaded_by) AND (EXISTS ( SELECT 1    FROM updates   WHERE ((updates.id = media_attachments.update_id) AND (updates.author_id = auth.uid())))))` |
| `Users can view attachments of visible updates` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = media_attachments.update_id)))` | — |

### `subscription_tiers`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Anyone can view tiers` | SELECT | public | PERMISSIVE | `true` | — |
| `Super Admins can manage tiers` | ALL | public | PERMISSIVE | `is_super_admin()` | — |

### `platform_settings`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Anyone can view settings` | SELECT | public | PERMISSIVE | `true` | — |
| `Super Admins can manage settings` | ALL | public | PERMISSIVE | `is_super_admin()` | — |

### `break_glass_logs`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins can view their orgs break glass logs` | SELECT | public | PERMISSIVE | `((( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text) AND (target_org_id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))))` | — |
| `Super Admins can insert` | INSERT | public | PERMISSIVE | — | `is_super_admin()` |
| `Super admins can view break glass logs` | SELECT | public | PERMISSIVE | `is_super_admin()` | — |

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
| `Super Admins can view organizations for billing` | SELECT | public | PERMISSIVE | `is_super_admin()` | — |
| `Users can view their organization` | SELECT | public | PERMISSIVE | `((id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |

### `employee_timesheets`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins and PMs can update org timesheets` | UPDATE | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND ((u.role = ANY (ARRAY['admin'::text, 'super_admin'::text])) OR ((u.role = 'pm'::text) AND (u.organization_id = employee_timesheets.organization_id))))))` | — |
| `Admins and PMs can view org timesheets` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND ((u.role = ANY (ARRAY['admin'::text, 'super_admin'::text])) OR ((u.role = 'pm'::text) AND (u.organization_id = employee_timesheets.organization_id))))))` | — |
| `Employees can insert own timesheets` | INSERT | public | PERMISSIVE | — | `(auth.uid() = user_id)` |
| `Employees can update own pending timesheets` | UPDATE | public | PERMISSIVE | `((auth.uid() = user_id) AND (status = 'pending'::text))` | — |
| `Employees can view own timesheets` | SELECT | public | PERMISSIVE | `(auth.uid() = user_id)` | — |

### `transmittals`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to transmittals` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view transmittals for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = transmittals.project_id)))` | — |

### `transmittal_recipients`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins have full access to transmittal_recipients` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can update own transmittal receipt` | UPDATE | public | PERMISSIVE | `(auth.uid() = recipient_id)` | — |
| `Users can view transmittals sent to them` | SELECT | public | PERMISSIVE | `((auth.uid() = recipient_id) OR is_admin())` | — |

### `client_meeting_agendas`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins/PMs can insert meeting agendas` | INSERT | public | PERMISSIVE | — | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'pm'::text, 'super_admin'::text])))))` |
| `Users can view meeting agendas` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM client_meetings cm   WHERE (cm.id = client_meeting_agendas.meeting_id)))` | — |

### `comments`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can create comments` | INSERT | public | PERMISSIVE | — | `((auth.uid() = author_id) AND (EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = comments.update_id))))` |
| `Users can view comments of visible updates` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = comments.update_id)))` | — |

### `meeting_minutes`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to meeting_minutes` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view meeting_minutes for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = meeting_minutes.project_id)))` | — |

### `user_certifications`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to user_certifications` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `push_tokens`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can manage their own tokens` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

### `notifications`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Users can manage their own notifications` | ALL | public | PERMISSIVE | `(auth.uid() = user_id)` | `(auth.uid() = user_id)` |

### `project_resources`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify project_resources` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert project_resources` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view project_resources for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_resources.project_id)))` | — |

### `client_approvals`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Clients/Admins can update approvals` | UPDATE | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['client'::text, 'admin'::text, 'pm'::text, 'super_admin'::text])))))` | — |
| `Creators and Admins can modify client_approvals` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert client_approvals` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view client_approvals for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = client_approvals.project_id)))` | — |

### `project_issues`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins/PMs can update issues` | UPDATE | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'pm'::text, 'super_admin'::text])))))` | — |
| `Creators and Admins can modify project_issues` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert project_issues` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view project_issues for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_issues.project_id)))` | — |

### `change_requests`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify change_requests` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert change_requests` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view change_requests for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = change_requests.project_id)))` | — |

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
| `Admins/PMs can update handover packages` | UPDATE | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'pm'::text, 'super_admin'::text])))))` | — |
| `Creators and Admins can modify project_handovers` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert project_handovers` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view project_handovers for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_handovers.project_id)))` | — |

### `client_meetings`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins/PMs can update client meetings` | UPDATE | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['admin'::text, 'pm'::text, 'super_admin'::text])))))` | — |
| `Creators and Admins can modify client_meetings` | ALL | public | PERMISSIVE | `((auth.uid() = created_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can insert client_meetings` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view client_meetings for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = client_meetings.project_id)))` | — |

### `tasks`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `PMs and Admins have full access to tasks` | ALL | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['pm'::text, 'admin'::text, 'superadmin'::text])))))` | — |
| `PMs can manage tasks` | ALL | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects p   WHERE ((p.id = tasks.project_id) AND ((p.assigned_pm_id = auth.uid()) OR (( SELECT user_actor.role            FROM user_actor           WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['admin'::text, 'super_admin'::text]))))))` | — |
| `Users can view tasks` | SELECT | public | PERMISSIVE | `((assignee_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM projects p   WHERE ((p.id = tasks.project_id) AND ((p.assigned_pm_id = auth.uid()) OR (( SELECT user_actor.role            FROM user_actor           WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['admin'::text, 'super_admin'::text])))))))` | — |
| `Vendors can only update their assigned tasks` | UPDATE | public | PERMISSIVE | `(assignee_id = auth.uid())` | `(assignee_id = auth.uid())` |
| `Vendors can update assigned task status` | UPDATE | public | PERMISSIVE | `(assignee_id = auth.uid())` | — |
| `Vendors can view project tasks` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM project_vendors pv   WHERE ((pv.project_id = tasks.project_id) AND (pv.vendor_id = auth.uid()))))` | — |

### `user_billing_rates`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to user_billing_rates` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `site_access_logs`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to site_access_logs` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view site_access_logs for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = site_access_logs.project_id)))` | — |

### `muster_events`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to muster_events` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view muster_events for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = muster_events.project_id)))` | — |

### `audit_log`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins can view audit logs` | SELECT | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `Deny all manual modifications to audit logs` | ALL | public | PERMISSIVE | `false` | — |

### `equipment_telemetry`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to equipment_telemetry` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `union_compliance_rules`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to union_compliance_rules` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `vendor_invoices`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to vendor_invoices` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view vendor_invoices for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = vendor_invoices.project_id)))` | — |

### `muster_responses`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to muster_responses` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can insert own muster_response` | INSERT | public | PERMISSIVE | — | `(auth.uid() = user_id)` |

### `project_config`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins can manage project config` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text)` | — |
| `Users can view config for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_config.project_id)))` | — |

### `updates`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Authors and Admins can update` | UPDATE | public | PERMISSIVE | `((auth.uid() = author_id) OR is_admin())` | — |
| `Employees can create updates` | INSERT | public | PERMISSIVE | — | `((auth.uid() = author_id) AND is_employee())` |
| `PMs can create updates for assigned projects` | INSERT | public | PERMISSIVE | — | `((auth.uid() = author_id) AND (EXISTS ( SELECT 1    FROM projects   WHERE ((projects.id = updates.project_id) AND (projects.assigned_pm_id = auth.uid())))))` |
| `Users can view updates for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = updates.project_id)))` | — |
| `Vendors can manage own updates` | ALL | public | PERMISSIVE | `((author_id = auth.uid()) AND is_vendor())` | — |

### `drawing_versions`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Creators and Admins can modify drawings` | ALL | public | PERMISSIVE | `((auth.uid() = uploaded_by) OR (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'admin'::text))` | — |
| `PMs and Admins can manage drawings` | INSERT | public | PERMISSIVE | — | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` |
| `Users can view drawings for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = drawing_versions.project_id)))` | — |

### `timeline_dependencies`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to timeline_dependencies` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `weather_logs`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to weather_logs` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view weather_logs for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = weather_logs.project_id)))` | — |

### `timeline_scenarios`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to timeline_scenarios` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view timeline_scenarios for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = timeline_scenarios.project_id)))` | — |

### `public_shares`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins have full access to public_shares` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Allow anon and authenticated to read share links` | SELECT | public | PERMISSIVE | `true` | — |
| `Allow authenticated users to create share links` | INSERT | authenticated | PERMISSIVE | — | `true` |
| `Users can view public_shares for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = public_shares.project_id)))` | — |

### `milestone_checklist_items`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `PMs and Admins can manage checklist items` | ALL | public | PERMISSIVE | `(( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = ANY (ARRAY['pm'::text, 'admin'::text]))` | — |
| `Users can view checklist items for visible milestones` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM (milestones m      JOIN projects p ON ((p.id = m.project_id)))   WHERE (m.id = milestone_checklist_items.milestone_id)))` | — |

### `milestone_status_history`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to milestone_status_history` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `acknowledgements`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Clients can acknowledge` | INSERT | public | PERMISSIVE | — | `((auth.uid() = client_id) AND (( SELECT user_actor.role    FROM user_actor   WHERE (user_actor.id = auth.uid())) = 'client'::text) AND (EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = acknowledgements.update_id))))` |
| `Clients can update own acks` | UPDATE | public | PERMISSIVE | `(auth.uid() = client_id)` | — |
| `Users can view acks of visible updates` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM updates   WHERE (updates.id = acknowledgements.update_id)))` | — |

### `workflow_automations`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to workflow_automations` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view workflow_automations for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = workflow_automations.project_id)))` | — |

### `change_signatures`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to change_signatures` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `change_requests_history`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to change_requests_history` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `site_locations`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to site_locations` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view site_locations for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = site_locations.project_id)))` | — |

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

### `material_waste_logs`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to material_waste_logs` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `issue_root_causes`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to issue_root_causes` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `support_tickets`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins and Super Admins can update tickets` | UPDATE | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))` | — |
| `Admins and Super Admins can view all tickets` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = ANY (ARRAY['admin'::text, 'super_admin'::text])))))` | — |
| `Admins can view all tickets` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor   WHERE ((user_actor.id = auth.uid()) AND (user_actor.role = 'admin'::text))))` | — |
| `Users can create their own tickets` | INSERT | public | PERMISSIVE | — | `(auth.uid() = user_id)` |
| `Users can view their own tickets` | SELECT | public | PERMISSIVE | `(auth.uid() = user_id)` | — |

### `bim_clashes`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to bim_clashes` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view bim_clashes for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = bim_clashes.project_id)))` | — |

### `issue_inspections`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to issue_inspections` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `project_assets`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to project_assets` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view project_assets for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_assets.project_id)))` | — |

### `financial_retentions`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to financial_retentions` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view financial_retentions for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = financial_retentions.project_id)))` | — |

### `video_exports`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to video_exports` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Users can view video_exports for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = video_exports.project_id)))` | — |

### `custom_fields_schema`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to custom_fields_schema` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `drawing_pins`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to drawing_pins` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `data_retention_policies`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Admins have full access to data_retention_policies` | ALL | public | PERMISSIVE | `is_admin()` | — |

### `project_communications`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Allow insert access for authenticated users` | INSERT | public | PERMISSIVE | — | `(auth.role() = 'authenticated'::text)` |
| `Allow read access for authenticated users` | SELECT | public | PERMISSIVE | `(auth.role() = 'authenticated'::text)` | — |

### `communication_mentions`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Allow insert mentions` | INSERT | public | PERMISSIVE | — | `(auth.role() = 'authenticated'::text)` |
| `Allow read mentions` | SELECT | public | PERMISSIVE | `(auth.role() = 'authenticated'::text)` | — |

### `communication_reads`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `Allow read reads` | SELECT | public | PERMISSIVE | `(auth.role() = 'authenticated'::text)` | — |
| `Users can mark messages as read` | INSERT | public | PERMISSIVE | — | `(user_id = auth.uid())` |

### `user_actor`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins can modify all profiles` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Admins can view all profiles` | SELECT | public | PERMISSIVE | `is_admin()` | — |
| `Super Admins can view all profiles for billing` | SELECT | public | PERMISSIVE | `is_super_admin()` | — |
| `Users can view own profile` | SELECT | public | PERMISSIVE | `(id = auth.uid())` | — |

### `projects`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins have full project access` | ALL | public | PERMISSIVE | `is_admin()` | — |
| `Clients can view org projects` | SELECT | public | PERMISSIVE | `((client_org_id = ( SELECT user_actor.organization_id    FROM user_actor   WHERE (user_actor.id = auth.uid()))) OR is_admin())` | — |
| `Employees can view all projects` | SELECT | public | PERMISSIVE | `is_employee()` | — |
| `PMs can view assigned projects` | SELECT | public | PERMISSIVE | `((auth.uid() = assigned_pm_id) OR is_admin())` | — |
| `Vendors can view assigned projects` | SELECT | public | PERMISSIVE | `((EXISTS ( SELECT 1    FROM project_vendors   WHERE ((project_vendors.project_id = projects.id) AND (project_vendors.vendor_id = auth.uid())))) OR (EXISTS ( SELECT 1    FROM org_vendors   WHERE ((org_vendors.organization_id = projects.client_org_id) AND (org_vendors.vendor_id = auth.uid())))))` | — |

### `project_requirements`

| Policy | Command | Roles | Action | USING | WITH CHECK |
| -------- | --------- | ------- | -------- | ------- | ------------ |
| `Admins and PMs can delete requirements` | DELETE | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['pm'::text, 'admin'::text, 'superadmin'::text])))))` | — |
| `PMs and Admins can insert requirements` | INSERT | public | PERMISSIVE | — | `(EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['pm'::text, 'admin'::text, 'superadmin'::text])))))` |
| `PMs, Admins, and Responsibles can update requirements` | UPDATE | public | PERMISSIVE | `((auth.uid() = responsible_id) OR (EXISTS ( SELECT 1    FROM user_actor u   WHERE ((u.id = auth.uid()) AND (u.role = ANY (ARRAY['pm'::text, 'admin'::text, 'superadmin'::text]))))))` | — |
| `Users can view requirements for visible projects` | SELECT | public | PERMISSIVE | `(EXISTS ( SELECT 1    FROM projects   WHERE (projects.id = project_requirements.project_id)))` | — |
