> tree -I "node_modules|.git|.next"
.
├── db.md
├── implementation_plan.md
├── remote_database_dump.md
├── setuu_complete_analysis.md
├── setuu_design_analysis.md
├── setuu-prototype
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── openapi.json
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── src
│   │   ├── app
│   │   │   ├── (auth)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login
│   │   │   │   │   └── page.tsx
│   │   │   │   └── signup
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)
│   │   │   │   ├── client
│   │   │   │   │   ├── approvals
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── financials
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── meetings
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── projects
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── engineer
│   │   │   │   │   ├── assets
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── collaboration
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── docs
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── drawings
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── issues
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── logs
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── projects
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── reviews
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── settings
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tasks
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── timesheet
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── timesheets
│   │   │   │   │       └── page.tsx
│   │   │   │   └── vendor
│   │   │   │       ├── defects
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── deliveries
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── invoices
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── layout.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── actions
│   │   │   │   ├── auditActions.ts
│   │   │   │   ├── changeRequestActions.ts
│   │   │   │   ├── clientActions.ts
│   │   │   │   ├── drawingActions.ts
│   │   │   │   ├── financialActions.ts
│   │   │   │   ├── handoverActions.ts
│   │   │   │   ├── invoiceActions.ts
│   │   │   │   ├── issueActions.ts
│   │   │   │   ├── lessonsLearnedActions.ts
│   │   │   │   ├── materialActions.ts
│   │   │   │   ├── meetingActions.ts
│   │   │   │   ├── milestoneActions.ts
│   │   │   │   ├── notificationActions.ts
│   │   │   │   ├── platformActions.ts
│   │   │   │   ├── projectActions.ts
│   │   │   │   ├── reportActions.ts
│   │   │   │   ├── resourceActions.ts
│   │   │   │   ├── supportActions.ts
│   │   │   │   ├── timesheetActions.ts
│   │   │   │   ├── updateActions.ts
│   │   │   │   ├── userActions.ts
│   │   │   │   └── vendorActions.ts
│   │   │   ├── admin
│   │   │   │   ├── archive
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── broadcasts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── changes
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── clients
│   │   │   │   │   ├── approvals
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── onboarding
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── drawings
│   │   │   │   │   ├── compare
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── financials
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── issues
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── materials
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── moderation
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── projects
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── config
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── flags
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── new
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── resources
│   │   │   │   │   ├── analytics
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── security
│   │   │   │   │   ├── audit
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── dropzone
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── duplicates
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── logout
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── threats
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── settings
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── status
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── support
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── users
│   │   │   │   │   ├── invite
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── roles
│   │   │   │   │       └── page.tsx
│   │   │   │   └── vendors
│   │   │   │       ├── page.tsx
│   │   │   │       └── performance
│   │   │   │           └── page.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── fonts
│   │   │   │   ├── GeistMonoVF.woff
│   │   │   │   └── GeistVF.woff
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── pm
│   │   │   │   ├── drawings
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── handovers
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── inventory
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── issues
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── lessons
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── milestones
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── more
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── projects
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── changes
│   │   │   │   │   │   │   └── new
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   ├── collaboration
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── drawings
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── handover
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── issues
│   │   │   │   │   │   │   ├── new
│   │   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   ├── materials
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   └── receipt
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   ├── milestones
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── team
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── timeline
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── update
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── support
│   │   │   │   │   └── page.tsx
│   │   │   │   └── sync
│   │   │   │       └── page.tsx
│   │   │   └── superadmin
│   │   │       ├── audit
│   │   │       │   └── page.tsx
│   │   │       ├── infrastructure
│   │   │       │   └── page.tsx
│   │   │       ├── invite
│   │   │       │   └── page.tsx
│   │   │       ├── layout.tsx
│   │   │       ├── organizations
│   │   │       │   └── page.tsx
│   │   │       ├── page.tsx
│   │   │       ├── platform
│   │   │       │   └── page.tsx
│   │   │       ├── security
│   │   │       │   ├── logs
│   │   │       │   │   └── page.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── storage
│   │   │       │   └── page.tsx
│   │   │       ├── subscriptions
│   │   │       │   └── page.tsx
│   │   │       ├── support
│   │   │       │   └── page.tsx
│   │   │       ├── telemetry
│   │   │       │   └── page.tsx
│   │   │       └── users
│   │   │           └── page.tsx
│   │   ├── components
│   │   │   ├── navigation
│   │   │   │   ├── AdminMobileBottomNav.tsx
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   ├── DashboardShell.tsx
│   │   │   │   ├── LogoutButton.tsx
│   │   │   │   ├── MobileBottomNav.tsx
│   │   │   │   ├── roles
│   │   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   │   ├── AdminTopbar.tsx
│   │   │   │   │   ├── ClientSidebar.tsx
│   │   │   │   │   ├── ClientTopbar.tsx
│   │   │   │   │   ├── EngineerSidebar.tsx
│   │   │   │   │   ├── EngineerTopbar.tsx
│   │   │   │   │   ├── PMMobileNav.tsx
│   │   │   │   │   ├── PMSidebar.tsx
│   │   │   │   │   ├── PMTopbar.tsx
│   │   │   │   │   ├── SuperadminSidebar.tsx
│   │   │   │   │   ├── SuperadminTopbar.tsx
│   │   │   │   │   ├── VendorSidebar.tsx
│   │   │   │   │   └── VendorTopbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── SuperadminSidebar.tsx
│   │   │   │   └── Topbar.tsx
│   │   │   ├── project
│   │   │   │   ├── ProjectConfigForm.tsx
│   │   │   │   └── ProjectWizard.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ui
│   │   │       ├── ActivityFeed.tsx
│   │   │       ├── Alert.tsx
│   │   │       ├── AvatarGroup.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── BarChart.tsx
│   │   │       ├── BottomSheet.tsx
│   │   │       ├── Breadcrumb.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── CalendarView.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Checkbox.tsx
│   │   │       ├── ConfirmDialog.tsx
│   │   │       ├── DataTable.tsx
│   │   │       ├── DatePicker.tsx
│   │   │       ├── DonutChart.tsx
│   │   │       ├── Drawer.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── FileDropzone.tsx
│   │   │       ├── FilterBar.tsx
│   │   │       ├── FormField.tsx
│   │   │       ├── KanbanCard.tsx
│   │   │       ├── KanbanColumn.tsx
│   │   │       ├── KPICard.tsx
│   │   │       ├── LoadingSkeleton.tsx
│   │   │       ├── MapView.tsx
│   │   │       ├── MediaGallery.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── OnlineOfflineBanner.tsx
│   │   │       ├── PageHeader.tsx
│   │   │       ├── Pagination.tsx
│   │   │       ├── ProgressBar.tsx
│   │   │       ├── Radio.tsx
│   │   │       ├── SearchInput.tsx
│   │   │       ├── SectionHeader.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── SeverityIndicator.tsx
│   │   │       ├── Spinner.tsx
│   │   │       ├── StatusBadge.tsx
│   │   │       ├── SyncBanner.tsx
│   │   │       ├── SyncIndicator.tsx
│   │   │       ├── TabBar.tsx
│   │   │       ├── TerminalWindow.tsx
│   │   │       ├── TextArea.tsx
│   │   │       ├── TextInput.tsx
│   │   │       ├── TimelineEntry.tsx
│   │   │       ├── TimePicker.tsx
│   │   │       ├── Toast.tsx
│   │   │       ├── Toggle.tsx
│   │   │       ├── Tooltip.tsx
│   │   │       └── WizardStepper.tsx
│   │   ├── contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── OfflineSyncContext.tsx
│   │   │   └── PMContext.tsx
│   │   ├── lib
│   │   │   ├── supabase
│   │   │   │   ├── client.ts
│   │   │   │   ├── middleware.ts
│   │   │   │   └── server.ts
│   │   │   └── utils.ts
│   │   ├── proxy.ts
│   │   └── types
│   │       └── database.ts
│   ├── supabase
│   │   ├── auth_seed.sql
│   │   ├── config.toml
│   │   ├── migrations
│   │   └── seed.sql
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── stitch_concept_design
│   ├── db.md
│   ├── desktop
│   │   ├── admin
│   │   │   ├── code
│   │   │   │   ├── admin_settings_org_configuration.html
│   │   │   │   ├── admin_sidebar_component_reference_extracted.html
│   │   │   │   ├── admin_topbar_component_reference_extracted.html
│   │   │   │   ├── advanced_resource_blockers_allocation_analytics_hub.html
│   │   │   │   ├── archive_data_retention_manager.html
│   │   │   │   ├── automated_reporting_engine.html
│   │   │   │   ├── bulk_notification_broadcast_center.html
│   │   │   │   ├── change_request_approval_queue_1.html
│   │   │   │   ├── change_request_approval_queue_2.html
│   │   │   │   ├── clamav_upload_dropzone_states.html
│   │   │   │   ├── client_approvals_tracker.html
│   │   │   │   ├── client_meeting_registry.html
│   │   │   │   ├── client_onboarding_wizard_1.html
│   │   │   │   ├── client_onboarding_wizard_2.html
│   │   │   │   ├── drawing_media_hub_project_oversight.html
│   │   │   │   ├── drawing_media_hub.html
│   │   │   │   ├── duplicate_file_resolution_center.html
│   │   │   │   ├── executive_admin_dashboard_1.html
│   │   │   │   ├── executive_admin_dashboard_2.html
│   │   │   │   ├── invite_user_wizard.html
│   │   │   │   ├── labor_timesheet_management_console.html
│   │   │   │   ├── master_material_tracking_1.html
│   │   │   │   ├── master_material_tracking_2.html
│   │   │   │   ├── org_threat_virus_scan_dashboard.html
│   │   │   │   ├── organizational_audit_log.html
│   │   │   │   ├── pm_mobile_sidebar_component_reference.html
│   │   │   │   ├── progress_update_moderation_feed.html
│   │   │   │   ├── project_configuration_hub.html
│   │   │   │   ├── project_configuration_module_flags.html
│   │   │   │   ├── project_creation_wizard_step_1.html
│   │   │   │   ├── project_creation_wizard.html
│   │   │   │   ├── project_handover_console.html
│   │   │   │   ├── project_issues_blockers_console.html
│   │   │   │   ├── project_module_flags_granular_controls_console.html
│   │   │   │   ├── project_module_flags.html
│   │   │   │   ├── project_tracking_hub_1.html
│   │   │   │   ├── project_tracking_hub_2.html
│   │   │   │   ├── resource_timesheet_management_hub.html
│   │   │   │   ├── support_ticket_triage.html
│   │   │   │   ├── user_vendor_directory.html
│   │   │   │   └── vendor_performance_audit.html
│   │   │   └── image
│   │   │       ├── admin_settings_org_configuration.png
│   │   │       ├── admin_sidebar_component_reference_extracted.png
│   │   │       ├── admin_topbar_component_reference_extracted.png
│   │   │       ├── advanced_resource_blockers_allocation_analytics_hub.png
│   │   │       ├── archive_data_retention_manager.png
│   │   │       ├── automated_reporting_engine.png
│   │   │       ├── bulk_notification_broadcast_center.png
│   │   │       ├── change_request_approval_queue_1.png
│   │   │       ├── change_request_approval_queue_2.png
│   │   │       ├── clamav_upload_dropzone_states.png
│   │   │       ├── client_approvals_tracker.png
│   │   │       ├── client_meeting_registry.png
│   │   │       ├── client_onboarding_wizard_1.png
│   │   │       ├── client_onboarding_wizard_2.png
│   │   │       ├── drawing_media_hub_project_oversight.png
│   │   │       ├── drawing_media_hub.png
│   │   │       ├── duplicate_file_resolution_center.png
│   │   │       ├── executive_admin_dashboard_1.png
│   │   │       ├── executive_admin_dashboard_2.png
│   │   │       ├── high_fidelity_ui_component_design_for_an_admin_sidebar_in_the_setuu_enterprise.png
│   │   │       ├── invite_user_wizard.png
│   │   │       ├── labor_timesheet_management_console.png
│   │   │       ├── master_material_tracking_1.png
│   │   │       ├── master_material_tracking_2.png
│   │   │       ├── org_threat_virus_scan_dashboard.png
│   │   │       ├── organizational_audit_log.png
│   │   │       ├── pm_mobile_sidebar_component_reference.png
│   │   │       ├── progress_update_moderation_feed.png
│   │   │       ├── project_configuration_hub.png
│   │   │       ├── project_configuration_module_flags.png
│   │   │       ├── project_creation_wizard_step_1.png
│   │   │       ├── project_creation_wizard.png
│   │   │       ├── project_handover_console.png
│   │   │       ├── project_issues_blockers_console.png
│   │   │       ├── project_module_flags_granular_controls_console.png
│   │   │       ├── project_module_flags.png
│   │   │       ├── project_tracking_hub_1.png
│   │   │       ├── project_tracking_hub_2.png
│   │   │       ├── resource_timesheet_management_hub.png
│   │   │       ├── support_ticket_triage.png
│   │   │       ├── user_vendor_directory.png
│   │   │       └── vendor_performance_audit.png
│   │   ├── client
│   │   │   ├── code
│   │   │   │   ├── asset_deliverables_presentation_room.html
│   │   │   │   ├── client_meeting_agenda_hub_refined.html
│   │   │   │   ├── financials_billing_change_request_board.html
│   │   │   │   ├── global_executive_portfolio_dashboard.html
│   │   │   │   ├── handover_compliance_vault.html
│   │   │   │   ├── project_briefing_transparency_hub.html
│   │   │   │   └── verified_progress_site_update_feed_corrected.html
│   │   │   └── image
│   │   │       ├── asset_deliverables_presentation_room.png
│   │   │       ├── client_meeting_agenda_hub_refined.png
│   │   │       ├── financials_billing_change_request_board.png
│   │   │       ├── global_executive_portfolio_dashboard.png
│   │   │       ├── handover_compliance_vault.png
│   │   │       ├── project_briefing_transparency_hub.png
│   │   │       └── verified_progress_site_update_feed_corrected.png
│   │   ├── desktop-design-dark.md
│   │   ├── desktop-design-light.md
│   │   ├── engineer
│   │   │   ├── code
│   │   │   │   ├── engineer_preferences_integrations_mobile.html
│   │   │   │   ├── engineer_preferences_integrations.html
│   │   │   │   ├── engineer_s_master_workbench.html
│   │   │   │   ├── engineer_sidebar_reference.html
│   │   │   │   ├── engineer_topbar_reference.html
│   │   │   │   ├── engineering_team_docs_wiki_1.html
│   │   │   │   ├── engineering_team_docs_wiki_2.html
│   │   │   │   ├── issue_bug_blocker_console.html
│   │   │   │   ├── labor_timesheet_logging_console_project_wise.html
│   │   │   │   ├── multidisciplinary_task_kanban_execution_board.html
│   │   │   │   ├── peer_review_design_approvals.html
│   │   │   │   └── project_collaboration_hub_mentions.html
│   │   │   └── image
│   │   │       ├── engineer_preferences_integrations_mobile.png
│   │   │       ├── engineer_preferences_integrations.png
│   │   │       ├── engineer_s_master_workbench.png
│   │   │       ├── engineer_sidebar_reference.png
│   │   │       ├── engineer_topbar_reference.png
│   │   │       ├── engineering_team_docs_wiki_1.png
│   │   │       ├── engineering_team_docs_wiki_2.png
│   │   │       ├── issue_bug_blocker_console.png
│   │   │       ├── labor_timesheet_logging_console_project_wise.png
│   │   │       ├── multidisciplinary_task_kanban_execution_board.png
│   │   │       ├── peer_review_design_approvals.png
│   │   │       └── project_collaboration_hub_mentions.png
│   │   ├── project_manager
│   │   │   ├── code
│   │   │   │   ├── change_requests_client_approvals_hub.html
│   │   │   │   ├── client_desktop_sidebar_reference.html
│   │   │   │   ├── client_global_topbar_reference.html
│   │   │   │   ├── client_meeting_registry.html
│   │   │   │   ├── desktop_draft_change_request_form.html
│   │   │   │   ├── fullscreen_drawing_media_hub_refined.html
│   │   │   │   ├── handovers_client_meetings_hub.html
│   │   │   │   ├── lessons_learned_repository_1.html
│   │   │   │   ├── lessons_learned_repository_2.html
│   │   │   │   ├── milestone_task_management_hub.html
│   │   │   │   ├── offline_sync_queue_manager.html
│   │   │   │   ├── pm_desktop_sidebar_reference.html
│   │   │   │   ├── pm_global_topbar_reference_isolated.html
│   │   │   │   ├── pm_project_dashboard_command_center.html
│   │   │   │   ├── pm_project_reporting_export_engine.html
│   │   │   │   ├── pm_support_help_desk_portal.html
│   │   │   │   ├── project_collaboration_hub.html
│   │   │   │   ├── project_handover_console.html
│   │   │   │   ├── project_materials_log_tracking.html
│   │   │   │   ├── project_team_vendor_directory.html
│   │   │   │   ├── project_timeline_progress_feed_1.html
│   │   │   │   ├── project_timeline_progress_feed_2.html
│   │   │   │   ├── project_timeline_progress_feed_refined.html
│   │   │   │   └── resource_allocation_productivity_matrix.html
│   │   │   └── image
│   │   │       ├── change_requests_client_approvals_hub.png
│   │   │       ├── client_desktop_sidebar_reference.png
│   │   │       ├── client_global_topbar_reference.png
│   │   │       ├── client_meeting_registry.png
│   │   │       ├── desktop_draft_change_request_form.png
│   │   │       ├── fullscreen_drawing_media_hub_refined.png
│   │   │       ├── handovers_client_meetings_hub.png
│   │   │       ├── lessons_learned_repository_1.png
│   │   │       ├── lessons_learned_repository_2.png
│   │   │       ├── milestone_task_management_hub.png
│   │   │       ├── offline_sync_queue_manager.png
│   │   │       ├── pm_desktop_sidebar_reference.png
│   │   │       ├── pm_global_topbar_reference_isolated.png
│   │   │       ├── pm_project_dashboard_command_center.png
│   │   │       ├── pm_project_reporting_export_engine.png
│   │   │       ├── pm_support_help_desk_portal.png
│   │   │       ├── project_collaboration_hub.png
│   │   │       ├── project_handover_console.png
│   │   │       ├── project_materials_log_tracking.png
│   │   │       ├── project_team_vendor_directory.png
│   │   │       ├── project_timeline_progress_feed_1.png
│   │   │       ├── project_timeline_progress_feed_2.png
│   │   │       ├── project_timeline_progress_feed_refined.png
│   │   │       └── resource_allocation_productivity_matrix.png
│   │   ├── superadmin
│   │   │   ├── code
│   │   │   │   ├── audit_log_explorer_1.html
│   │   │   │   ├── audit_log_explorer_2.html
│   │   │   │   ├── audit_log_explorer_3.html
│   │   │   │   ├── break_glass_log_review.html
│   │   │   │   ├── break_glass_security_console_1.html
│   │   │   │   ├── break_glass_security_console_2.html
│   │   │   │   ├── global_security_storage_telemetry.html
│   │   │   │   ├── global_support_ticket_triage_1.html
│   │   │   │   ├── global_support_ticket_triage_2.html
│   │   │   │   ├── infrastructure_command_dashboard.html
│   │   │   │   ├── invite_org_admin_with_subscription_permissions.html
│   │   │   │   ├── organization_subscription_hub_1.html
│   │   │   │   ├── organization_subscription_hub_2.html
│   │   │   │   ├── platform_configuration_manager.html
│   │   │   │   ├── refined_global_storage_monitoring_dashboard.html
│   │   │   │   └── super_admin_control_center.html
│   │   │   └── image
│   │   │       ├── audit_log_explorer_1.png
│   │   │       ├── audit_log_explorer_2.png
│   │   │       ├── audit_log_explorer_3.png
│   │   │       ├── break_glass_log_review.png
│   │   │       ├── break_glass_security_console_1.png
│   │   │       ├── break_glass_security_console_2.png
│   │   │       ├── global_security_storage_telemetry.png
│   │   │       ├── global_support_ticket_triage_1.png
│   │   │       ├── global_support_ticket_triage_2.png
│   │   │       ├── high_fidelity_ui_component_design_for_a_super_admin_topbar_in_the_setuu.png
│   │   │       ├── infrastructure_command_dashboard.png
│   │   │       ├── invite_org_admin_with_subscription_permissions.png
│   │   │       ├── organization_subscription_hub_1.png
│   │   │       ├── organization_subscription_hub_2.png
│   │   │       ├── platform_configuration_manager.png
│   │   │       ├── refined_global_storage_monitoring_dashboard.png
│   │   │       └── super_admin_control_center.png
│   │   └── vendor
│   │       ├── code
│   │       │   ├── defect_rework_remediation_console_unified.html
│   │       │   ├── delivery_proof_upload_dropzone_recreated.html
│   │       │   ├── material_po_delivery_logistics_hub_unified.html
│   │       │   ├── subcontracted_task_execution_board_unified.html
│   │       │   ├── vendor_dispatch_dashboard.html
│   │       │   ├── vendor_invoicing_payment_tracking_refined.html
│   │       │   └── vendor_navigation_shell_sidebar_topbar.html
│   │       └── image
│   │           ├── defect_rework_remediation_console_unified.png
│   │           ├── delivery_proof_upload_dropzone_recreated.png
│   │           ├── material_po_delivery_logistics_hub_unified.png
│   │           ├── subcontracted_task_execution_board_unified.png
│   │           ├── vendor_dispatch_dashboard.png
│   │           ├── vendor_invoicing_payment_tracking_refined.png
│   │           └── vendor_navigation_shell_sidebar_topbar.png
│   ├── implementation_plan.md
│   ├── mobile
│   │   ├── admin
│   │   │   ├── code
│   │   │   │   ├── admin_mobile_sidebar_reference.html
│   │   │   │   ├── admin_settings_org_configuration_mobile.html
│   │   │   │   ├── advanced_resource_allocation_analytics_mobile.html
│   │   │   │   ├── archive_data_retention_mobile.html
│   │   │   │   ├── automated_reporting_engine_mobile.html
│   │   │   │   ├── bulk_notification_broadcast_center_mobile.html
│   │   │   │   ├── clamav_upload_dropzone_states_mobile.html
│   │   │   │   ├── client_approvals_tracker_mobile.html
│   │   │   │   ├── client_onboarding_configuration_mobile.html
│   │   │   │   ├── client_onboarding_industrial_sector_mobile.html
│   │   │   │   ├── client_onboarding_wizard_mobile_1.html
│   │   │   │   ├── duplicate_resolution_mobile.html
│   │   │   │   ├── executive_admin_dashboard_mobile.html
│   │   │   │   ├── force_logout_security_modal_admin_action.html
│   │   │   │   ├── force_logout_security_modal_mobile.html
│   │   │   │   ├── handover_meeting_registry_mobile.html
│   │   │   │   ├── lessons_learned_repository_mobile.html
│   │   │   │   ├── mobile_user_vendor_directory.html
│   │   │   │   ├── moderation_feed_mobile.html
│   │   │   │   ├── org_threat_dashboard_mobile.html
│   │   │   │   ├── project_issues_blockers_mobile.html
│   │   │   │   ├── resource_allocation_analytics_mobile.html
│   │   │   │   ├── resource_timesheet_hub.html
│   │   │   │   ├── support_ticket_triage_mobile.html
│   │   │   │   └── vendor_performance_audit_mobile.html
│   │   │   └── image
│   │   │       ├── admin_mobile_sidebar_reference.png
│   │   │       ├── admin_settings_org_configuration_mobile.png
│   │   │       ├── advanced_resource_allocation_analytics_mobile.png
│   │   │       ├── archive_data_retention_mobile.png
│   │   │       ├── automated_reporting_engine_mobile.png
│   │   │       ├── bulk_notification_broadcast_center_mobile.png
│   │   │       ├── clamav_upload_dropzone_states_mobile.png
│   │   │       ├── client_approvals_tracker_mobile.png
│   │   │       ├── client_onboarding_configuration_mobile.png
│   │   │       ├── client_onboarding_industrial_sector_mobile.png
│   │   │       ├── client_onboarding_wizard_mobile_1.png
│   │   │       ├── duplicate_resolution_mobile.png
│   │   │       ├── executive_admin_dashboard_mobile.png
│   │   │       ├── force_logout_security_modal_admin_action.png
│   │   │       ├── force_logout_security_modal_mobile.png
│   │   │       ├── handover_meeting_registry_mobile.png
│   │   │       ├── lessons_learned_repository_mobile.png
│   │   │       ├── mobile_user_vendor_directory.png
│   │   │       ├── moderation_feed_mobile.png
│   │   │       ├── org_threat_dashboard_mobile.png
│   │   │       ├── project_issues_blockers_mobile.png
│   │   │       ├── resource_allocation_analytics_mobile.png
│   │   │       ├── resource_timesheet_hub.png
│   │   │       ├── support_ticket_triage_mobile.png
│   │   │       └── vendor_performance_audit_mobile.png
│   │   ├── client
│   │   │   ├── code
│   │   │   │   ├── asset_deliverables_room_mobile.html
│   │   │   │   ├── client_portal_initial_configuration_mobile.html
│   │   │   │   ├── client_portal_initial_configuration_state.html
│   │   │   │   ├── drawing_version_comparison_diff_engine.html
│   │   │   │   ├── drawing_version_comparison_mobile.html
│   │   │   │   ├── executive_portfolio_dashboard_mobile.html
│   │   │   │   ├── financials_change_requests_mobile.html
│   │   │   │   ├── handover_compliance_vault_mobile.html
│   │   │   │   ├── meeting_agenda_hub_mobile.html
│   │   │   │   ├── project_briefing_hub_mobile.html
│   │   │   │   └── verified_progress_feed_mobile.html
│   │   │   └── image
│   │   │       ├── asset_deliverables_room_mobile.png
│   │   │       ├── client_portal_initial_configuration_mobile.png
│   │   │       ├── client_portal_initial_configuration_state.png
│   │   │       ├── drawing_version_comparison_diff_engine.png
│   │   │       ├── drawing_version_comparison_mobile.png
│   │   │       ├── executive_portfolio_dashboard_mobile.png
│   │   │       ├── financials_change_requests_mobile.png
│   │   │       ├── handover_compliance_vault_mobile.png
│   │   │       ├── meeting_agenda_hub_mobile.png
│   │   │       ├── project_briefing_hub_mobile.png
│   │   │       └── verified_progress_feed_mobile.png
│   │   ├── engineer
│   │   │   ├── code
│   │   │   │   ├── collaboration_hub_mentions_mobile_recreated.html
│   │   │   │   ├── engineer_mobile_navigation_reference.html
│   │   │   │   ├── engineer_s_master_workbench_mobile.html
│   │   │   │   ├── engineering_asset_hub_cad_schematics_viewer.html
│   │   │   │   ├── engineering_asset_hub_mobile.html
│   │   │   │   ├── issue_blocker_console_mobile.html
│   │   │   │   ├── mobile_labor_timesheet_logger_1.html
│   │   │   │   ├── mobile_labor_timesheet_logger_2.html
│   │   │   │   ├── mobile_log_peek_developer_utility.html
│   │   │   │   ├── multidisciplinary_task_checklist_mobile.html
│   │   │   │   └── peer_review_approvals_mobile.html
│   │   │   └── image
│   │   │       ├── collaboration_hub_mentions_mobile_recreated.png
│   │   │       ├── engineer_mobile_navigation_reference.png
│   │   │       ├── engineer_s_master_workbench_mobile.png
│   │   │       ├── engineering_asset_hub_cad_schematics_viewer.png
│   │   │       ├── engineering_asset_hub_mobile.png
│   │   │       ├── issue_blocker_console_mobile.png
│   │   │       ├── mobile_labor_timesheet_logger_1.png
│   │   │       ├── mobile_labor_timesheet_logger_2.png
│   │   │       ├── mobile_log_peek_developer_utility.png
│   │   │       ├── multidisciplinary_task_checklist_mobile.png
│   │   │       └── peer_review_approvals_mobile.png
│   │   ├── mobile-design-dark.md
│   │   ├── mobile-design-light.md
│   │   ├── project_manager
│   │   │   ├── code
│   │   │   │   ├── camera_first_progress_update_creator.html
│   │   │   │   ├── mobile_collaboration_mentions.html
│   │   │   │   ├── mobile_draft_change_request_form.html
│   │   │   │   ├── mobile_drawing_viewer_annotations.html
│   │   │   │   ├── mobile_material_receipt_verification.html
│   │   │   │   ├── mobile_milestone_task_checklist.html
│   │   │   │   ├── mobile_offline_sync_queue_manager.html
│   │   │   │   ├── mobile_project_timeline_feed.html
│   │   │   │   ├── pm_mobile_dashboard_sync_wrapper.html
│   │   │   │   └── project_issues_logger_field_form.html
│   │   │   └── image
│   │   │       ├── camera_first_progress_update_creator.png
│   │   │       ├── mobile_collaboration_mentions.png
│   │   │       ├── mobile_draft_change_request_form.png
│   │   │       ├── mobile_drawing_viewer_annotations.png
│   │   │       ├── mobile_material_receipt_verification.png
│   │   │       ├── mobile_milestone_task_checklist.png
│   │   │       ├── mobile_offline_sync_queue_manager.png
│   │   │       ├── mobile_project_timeline_feed.png
│   │   │       ├── pm_mobile_dashboard_sync_wrapper.png
│   │   │       └── project_issues_logger_field_form.png
│   │   ├── superadmin
│   │   │   ├── code
│   │   │   │   ├── break_glass_log_review_mobile.html
│   │   │   │   ├── global_storage_monitoring_mobile.html
│   │   │   │   ├── global_telemetry_mobile.html
│   │   │   │   ├── invite_org_admin_mobile.html
│   │   │   │   ├── invite_user_admin_suite.html
│   │   │   │   ├── platform_configuration_mobile.html
│   │   │   │   └── super_admin_sidebar_reference.html
│   │   │   └── image
│   │   │       ├── break_glass_log_review_mobile.png
│   │   │       ├── global_storage_monitoring_mobile.png
│   │   │       ├── global_telemetry_mobile.png
│   │   │       ├── invite_org_admin_mobile.png
│   │   │       ├── invite_user_admin_suite.png
│   │   │       ├── platform_configuration_mobile.png
│   │   │       └── super_admin_sidebar_reference.png
│   │   └── vendor
│   │       ├── code
│   │       │   ├── defect_rework_console_mobile.html
│   │       │   ├── delivery_proof_upload_mobile.html
│   │       │   ├── driver_delivery_capture.html
│   │       │   ├── material_po_delivery_hub_mobile.html
│   │       │   ├── proof_of_delivery_capture_mobile.html
│   │       │   ├── subcontracted_task_execution_mobile.html
│   │       │   ├── vendor_dispatch_dashboard_mobile_1.html
│   │       │   ├── vendor_dispatch_dashboard_mobile_2.html
│   │       │   ├── vendor_dispatch_fulfillment_dashboard_unified.html
│   │       │   └── vendor_invoicing_payment_tracking_mobile.html
│   │       └── image
│   │           ├── defect_rework_console_mobile.png
│   │           ├── delivery_proof_upload_mobile.png
│   │           ├── driver_delivery_capture.png
│   │           ├── material_po_delivery_hub_mobile.png
│   │           ├── proof_of_delivery_capture_mobile.png
│   │           ├── subcontracted_task_execution_mobile.png
│   │           ├── vendor_dispatch_dashboard_mobile_1.png
│   │           ├── vendor_dispatch_dashboard_mobile_2.png
│   │           ├── vendor_dispatch_fulfillment_dashboard_unified.png
│   │           └── vendor_invoicing_payment_tracking_mobile.png
│   ├── setuu_architecture_updated.md
│   ├── setuu_complete_analysis.md
│   ├── srs_updated.md
│   └── unified_screen_registry_audit.md
└──task.md


156 directories, 613 files

╭- 🤖  ~/Documents/Praimo/setuu/stitch/setuu_design  main ?1                                                                                 ok  base py  2.32 cpu  97% disk  4.07G ram  80% battery  05:13:31 PM -╮
╰->                                                                                                                                                                                                               -╯
