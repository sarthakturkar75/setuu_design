# 26-08-2026

> tree -I "node_modules|.git|.next"
.
├── AGENTS.md
├── CLAUDE.md
├── next-env.d.ts
├── next.config.mjs
├── openapi.json
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   └── sw.js
├── README.md
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── layout.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── signup
│   │   │       └── page.tsx
│   │   ├── actions
│   │   │   ├── aiActions.ts
│   │   │   ├── auditActions.ts
│   │   │   ├── authUtils.ts
│   │   │   ├── changeOrderActions.ts
│   │   │   ├── changeRequestActions.ts
│   │   │   ├── clientActions.ts
│   │   │   ├── communicationActions.ts
│   │   │   ├── dashboardActions.ts
│   │   │   ├── drawingActions.ts
│   │   │   ├── emergencyActions.ts
│   │   │   ├── financialActions.ts
│   │   │   ├── handoverActions.tsx
│   │   │   ├── invoiceActions.ts
│   │   │   ├── issueActions.ts
│   │   │   ├── kanbanAnalyticsActions.ts
│   │   │   ├── lessonsLearnedActions.ts
│   │   │   ├── materialActions.ts
│   │   │   ├── meetingActions.ts
│   │   │   ├── milestoneActions.ts
│   │   │   ├── milestoneModuleActions.ts
│   │   │   ├── notificationActions.ts
│   │   │   ├── organizationActions.ts
│   │   │   ├── permissionActions.ts
│   │   │   ├── platformActions.ts
│   │   │   ├── portfolioActions.ts
│   │   │   ├── projectActions.ts
│   │   │   ├── publicShareActions.ts
│   │   │   ├── reportActions.ts
│   │   │   ├── requirementActions.ts
│   │   │   ├── resourceActions.ts
│   │   │   ├── supportActions.ts
│   │   │   ├── teamActions.ts
│   │   │   ├── timelineActions.ts
│   │   │   ├── timelineLeveling.ts
│   │   │   ├── timesheetActions.ts
│   │   │   ├── updateActions.ts
│   │   │   ├── userActions.ts
│   │   │   └── vendorActions.ts
│   │   ├── admin
│   │   │   ├── archive
│   │   │   │   └── page.tsx
│   │   │   ├── broadcasts
│   │   │   │   └── page.tsx
│   │   │   ├── calendar
│   │   │   │   └── page.tsx
│   │   │   ├── changes
│   │   │   │   └── page.tsx
│   │   │   ├── clients
│   │   │   │   ├── approvals
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── onboarding
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── drawings
│   │   │   │   ├── compare
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── financials
│   │   │   │   └── page.tsx
│   │   │   ├── handovers
│   │   │   │   └── page.tsx
│   │   │   ├── issues
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── lessons
│   │   │   │   └── page.tsx
│   │   │   ├── materials
│   │   │   │   └── page.tsx
│   │   │   ├── moderation
│   │   │   │   └── page.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── personnel
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── projects
│   │   │   │   ├── [id]
│   │   │   │   │   ├── changes
│   │   │   │   │   │   ├── new
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── collaboration
│   │   │   │   │   │   ├── MeetingMinutesWrapper.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── config
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── drawings
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── flags
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── handover
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── issues
│   │   │   │   │   │   ├── new
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── materials
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── receipt
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── milestones
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── muster
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── requirements
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── resources
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── team
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── timeline
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── update
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── reports
│   │   │   │   └── page.tsx
│   │   │   ├── resources
│   │   │   │   ├── analytics
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── security
│   │   │   │   ├── audit
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dropzone
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── duplicates
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── logout
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── threats
│   │   │   │       └── page.tsx
│   │   │   ├── settings
│   │   │   │   └── page.tsx
│   │   │   ├── status
│   │   │   │   └── page.tsx
│   │   │   ├── support
│   │   │   │   └── page.tsx
│   │   │   ├── sync
│   │   │   │   └── page.tsx
│   │   │   ├── users
│   │   │   │   ├── invite
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── roles
│   │   │   │       └── page.tsx
│   │   │   └── vendors
│   │   │       ├── page.tsx
│   │   │       └── performance
│   │   │           └── page.tsx
│   │   ├── api
│   │   │   ├── billing
│   │   │   │   └── aia
│   │   │   │       └── route.ts
│   │   │   ├── collaboration
│   │   │   │   ├── minutes
│   │   │   │   │   └── route.ts
│   │   │   │   ├── transcribe
│   │   │   │   │   └── route.ts
│   │   │   │   └── translate
│   │   │   │       └── route.ts
│   │   │   ├── cron
│   │   │   │   └── weather-check
│   │   │   │       └── route.ts
│   │   │   ├── debug
│   │   │   ├── debug-users
│   │   │   │   └── route.ts
│   │   │   ├── drawings
│   │   │   │   └── ocr-scan
│   │   │   │       └── route.ts
│   │   │   ├── issues
│   │   │   │   └── voice-parse
│   │   │   │       └── route.ts
│   │   │   ├── materials
│   │   │   │   └── receive
│   │   │   │       └── route.ts
│   │   │   ├── seed
│   │   │   │   └── route.ts
│   │   │   ├── sync
│   │   │   │   ├── excel
│   │   │   │   │   └── route.ts
│   │   │   │   └── export
│   │   │   │       └── route.ts
│   │   │   └── webhooks
│   │   │       ├── bim-clash
│   │   │       │   └── route.ts
│   │   │       ├── esignature
│   │   │       │   └── route.ts
│   │   │       ├── logistics-geofence
│   │   │       │   └── route.ts
│   │   │       └── turnstile
│   │   │           └── route.ts
│   │   ├── client
│   │   │   ├── [...slug]
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   └── projects
│   │   │       └── [id]
│   │   │           └── collaboration
│   │   │               ├── MeetingMinutesWrapper.tsx
│   │   │               └── page.tsx
│   │   ├── engineer
│   │   │   ├── [...slug]
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   └── projects
│   │   │       └── [id]
│   │   │           ├── collaboration
│   │   │           │   ├── MeetingMinutesWrapper.tsx
│   │   │           │   └── page.tsx
│   │   │           ├── handover
│   │   │           │   └── page.tsx
│   │   │           └── team
│   │   │               └── page.tsx
│   │   ├── favicon.ico
│   │   ├── fonts
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── pm
│   │   │   ├── calendar
│   │   │   │   └── page.tsx
│   │   │   ├── changes
│   │   │   │   └── page.tsx
│   │   │   ├── drawings
│   │   │   │   ├── compare
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── financials
│   │   │   │   └── page.tsx
│   │   │   ├── handovers
│   │   │   │   └── page.tsx
│   │   │   ├── issues
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── lessons
│   │   │   │   └── page.tsx
│   │   │   ├── materials
│   │   │   │   └── page.tsx
│   │   │   ├── milestones
│   │   │   │   └── page.tsx
│   │   │   ├── more
│   │   │   │   └── page.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── personnel
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── projects
│   │   │   │   ├── [id]
│   │   │   │   │   ├── changes
│   │   │   │   │   │   ├── new
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── collaboration
│   │   │   │   │   │   ├── MeetingMinutesWrapper.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── config
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── drawings
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── flags
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── handover
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── issues
│   │   │   │   │   │   ├── new
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── materials
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── receipt
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── milestones
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── muster
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── resources
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── team
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── timeline
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── update
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── reports
│   │   │   │   └── page.tsx
│   │   │   ├── resources
│   │   │   │   ├── analytics
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── support
│   │   │   │   └── page.tsx
│   │   │   └── sync
│   │   │       └── page.tsx
│   │   ├── public
│   │   │   └── project
│   │   │       └── [secure_token]
│   │   │           ├── layout.tsx
│   │   │           └── page.tsx
│   │   ├── superadmin
│   │   │   ├── audit
│   │   │   │   └── page.tsx
│   │   │   ├── infrastructure
│   │   │   │   └── page.tsx
│   │   │   ├── invite
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── organizations
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── platform
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── security
│   │   │   │   ├── logs
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── storage
│   │   │   │   └── page.tsx
│   │   │   ├── subscriptions
│   │   │   │   └── page.tsx
│   │   │   ├── support
│   │   │   │   └── page.tsx
│   │   │   ├── telemetry
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │       └── page.tsx
│   │   └── vendor
│   │       ├── [...slug]
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       ├── notifications
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       └── projects
│   │           └── [id]
│   │               └── collaboration
│   │                   ├── MeetingMinutesWrapper.tsx
│   │                   └── page.tsx
│   ├── components
│   │   ├── navigation
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   ├── roles
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── ClientSidebar.tsx
│   │   │   │   ├── EngineerSidebar.tsx
│   │   │   │   ├── SuperadminSidebar.tsx
│   │   │   │   └── VendorSidebar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── profile
│   │   │   └── ProfileForm.tsx
│   │   ├── project
│   │   │   ├── ProjectConfigForm.tsx
│   │   │   └── ProjectWizard.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ui
│   │       ├── AccessDenied.tsx
│   │       ├── AcknowledgmentMatrix.tsx
│   │       ├── ActivityFeed.tsx
│   │       ├── AIWelcomeBanner.tsx
│   │       ├── Alert.tsx
│   │       ├── AudioRecorder.tsx
│   │       ├── AutoSlipSheetModal.tsx
│   │       ├── AvatarGroup.tsx
│   │       ├── Badge.tsx
│   │       ├── BarChart.tsx
│   │       ├── BlueprintDiffViewer.tsx
│   │       ├── Breadcrumb.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── ChangeOrderModal.tsx
│   │       ├── Checkbox.tsx
│   │       ├── CollaborationChat.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── ContingencyBurnChart.tsx
│   │       ├── CreateIssueModal.tsx
│   │       ├── CreateResourceModal.tsx
│   │       ├── DashboardWidgets.tsx
│   │       ├── DataTable.tsx
│   │       ├── DatePicker.tsx
│   │       ├── DefectMediaUploader.tsx
│   │       ├── DonutChart.tsx
│   │       ├── DraggableGrid.tsx
│   │       ├── Drawer.tsx
│   │       ├── DrawingDisciplineToggle.tsx
│   │       ├── DrawingSettingsModal.tsx
│   │       ├── EditPermissionsModal.tsx
│   │       ├── EditPersonnelModal.tsx
│   │       ├── EmptyState.tsx
│   │       ├── FileDropzone.tsx
│   │       ├── FilterBar.tsx
│   │       ├── FormField.tsx
│   │       ├── GanttChartRenderer.tsx
│   │       ├── GlobalEmergencyListener.tsx
│   │       ├── InteractiveDrawingCanvas.tsx
│   │       ├── KanbanCard.tsx
│   │       ├── KanbanColumn.tsx
│   │       ├── KPICard.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       ├── LogQAInspectionModal.tsx
│   │       ├── LogWasteModal.tsx
│   │       ├── ManageAssetsModal.tsx
│   │       ├── ManageTagsModal.tsx
│   │       ├── MaterialCreateModal.tsx
│   │       ├── MaterialDetailsModal.tsx
│   │       ├── MaterialQRGenerator.tsx
│   │       ├── MediaGallery.tsx
│   │       ├── MeetingMinutesModal.tsx
│   │       ├── Modal.tsx
│   │       ├── NotificationsView.tsx
│   │       ├── OnlineOfflineBanner.tsx
│   │       ├── PageHeader.tsx
│   │       ├── Pagination.tsx
│   │       ├── PortfolioRadarChart.tsx
│   │       ├── PrintExportButton.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── PublicShareButton.tsx
│   │       ├── Radio.tsx
│   │       ├── RequirementTraceabilityMatrix.tsx
│   │       ├── ResourcePoolModal.tsx
│   │       ├── RiskScoreGauge.tsx
│   │       ├── RootCauseDistributionChart.tsx
│   │       ├── SearchInput.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── Select.tsx
│   │       ├── SeverityIndicator.tsx
│   │       ├── SLACountdownTimer.tsx
│   │       ├── SmartInbox.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── SubmitChangeRequestModal.tsx
│   │       ├── Switch.tsx
│   │       ├── SyncBanner.tsx
│   │       ├── SyncIndicator.tsx
│   │       ├── TabBar.tsx
│   │       ├── TextArea.tsx
│   │       ├── TextInput.tsx
│   │       ├── TimelineEntry.tsx
│   │       ├── Toast.tsx
│   │       ├── Toggle.tsx
│   │       ├── Tooltip.tsx
│   │       ├── UnplannedReworkKPI.tsx
│   │       ├── UploadDrawingModal.tsx
│   │       ├── WasteLossAnalytics.tsx
│   │       └── WizardStepper.tsx
│   ├── contexts
│   │   ├── AuthContext.tsx
│   │   ├── OfflineSyncContext.tsx
│   │   ├── PMContext.tsx
│   │   └── ToastContext.tsx
│   ├── lib
│   │   ├── config
│   │   │   └── navigation.tsx
│   │   ├── supabase
│   │   │   ├── admin.ts
│   │   │   ├── client.ts
│   │   │   ├── middleware.ts
│   │   │   └── server.ts
│   │   └── utils.ts
│   ├── proxy.ts
│   └── types
│       ├── database.ts
│       └── xml2js.d.ts
├── supabase
│   ├── auth_seed.sql
│   ├── config.toml
│   ├── enterprise_rls.sql
│   ├── enterprise_upgrade.sql
│   ├── migrations
│   │   ├── 20260824103645_communications.sql
│   │   ├── 20260824120000_collaboration_rls.sql
│   │   ├── 20260824173000_module9_team_infrastructure.sql
│   │   └── 20260826120000_evm_srs_upgrade.sql
│   ├── module2_timeline_upgrade.sql
│   └── seed.sql
├── tailwind.config.ts
├── tsconfig.json
└── tsconfig.tsbuildinfo

186 directories, 345 files

╭- 🤖  ~/Documents/Praimo/setuu/stitch/setuu_design/setuu-prototype  main !5 ?3                                                   ok  base py  0.1.0 pkg  3.41 cpu  97% disk  3.21G ram  80% battery  12:16:31 PM -╮
╰->                                                                                                                                                                                                               -╯
