# Setuu Enterprise — Complete System Analysis

> **Date**: August 17, 2026 | **Source**: Deep analysis of 181 HTML screens, 183 PNG previews, 7 design specs, 30+ database tables, and the entire setuu-prototype codebase.

---

## 1. What is Setuu?

**Setuu** (Seamless Engineering Tracking & User Updates) is a **B2B construction/industrial project management platform** built by Praimo Innovation. It manages the full lifecycle of engineering projects — from project creation, blueprints, field progress tracking, materials procurement, vendor management, through to client reporting, handover, and compliance.

### Core Value Proposition

Setuu bridges the gap between **field workers on construction sites** (often with poor connectivity) and **corporate stakeholders** (clients like Rieter, Hitachi, Halliburton) who need real-time, auditable visibility into project progress. It replaces WhatsApp groups, email chains, and spreadsheets with a structured, permission-controlled platform.

---

## 2. The Six User Roles & Their Relationships

```mermaid
graph TB
    SA["🔧 Super Admin<br/>(Platform Owner / Developer)"]
    AD["🏢 Admin<br/>(Praimo Leadership)"]
    PM["📋 Project Manager<br/>(Field Lead)"]
    EN["⚙️ Employee / Engineer<br/>(Field Worker)"]
    VN["🚛 Vendor<br/>(Supplier / Subcontractor)"]
    CL["🏭 Client<br/>(External Stakeholder)"]

    SA -->|"Manages platform,<br/>subscriptions, billing"| AD
    AD -->|"Creates projects,<br/>invites users"| PM
    AD -->|"Can assign any lower role to project"| EN
    AD -->|"Invites new users to platform & assigns to project"| VN
    AD -->|"Onboards client orgs,<br/>assigns to projects"| CL
    PM -->|"Can assign any lower role to project"| EN
    PM -->|"Creates updates,<br/>manages milestones"| EN
    PM -->|"Assigns materials,<br/>tasks to vendors"| VN
    PM -->|"Reports progress to"| CL
    EN -->|"Posts field updates,<br/>logs timesheets"| PM
    VN -->|"Delivers materials,<br/>submits proofs"| PM
    CL -->|"Acknowledges updates,<br/>approves documents"| PM
```

### Critical Permission Rules

- **Admin**: Can invite brand new users to the application and subsequently assign them to any project. Admins can assign any user of any role below them (PM, Employee, Vendor, Client) to any project.
- **Project Manager (PM)**: Can assign any user of any role below them (Employee, Vendor, Client) to any project they manage.

### Role Access Matrix

| Capability | Super Admin | Admin | PM | Employee | Vendor | Client |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| View projects | ❌ | All | Assigned | Assigned | Assigned | Org only |
| Create projects | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View contract values | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Upload progress updates | ❌ | ✅ | Assigned | Assigned | Own scope | ❌ |
| View updates | ❌ (Privacy) | ✅ | Assigned | Assigned | Own only | Org only |
| Acknowledge updates | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Manage drawings & modules | ❌ | ✅ | Assigned | ❌ | ❌ | ❌ |
| Manage users/orgs | Billing only | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit logs | System only | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update assigned materials | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Log timesheets & wiki | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage invoices | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |

> [!IMPORTANT]
> **Super Admin privacy boundary**: Super Admins manage platform infrastructure (subscriptions, storage quotas, system health) but are strictly prohibited from viewing organizational data, project content, or confidential files. This is a fundamental architectural constraint.

---

## 3. Screen Inventory Per Role

| Role | Desktop Screens | Mobile Screens | Total | Primary Function |
| --- | :-: | :-: | :-: | --- |
| **Super Admin** | 16 | 7 | **23** | Platform governance, multi-tenant monitoring, security |
| **Admin** | 41 | 25 | **66** | Strategic oversight, project lifecycle, vendor management |
| **Project Manager** | 24 | 10 | **34** | Field execution, milestones, materials, collaboration |
| **Employee/Engineer** | 12 | 11 | **23** | Technical tasks, CAD review, timesheets |
| **Vendor** | 7 | 10 | **17** | Supply chain, deliveries, invoicing, defect remediation |
| **Client** | 7 | 11 | **18** | Executive briefing, approvals, progress monitoring |
| **Total** | **107** | **74** | **181** | |

---

## 4. Design System — Complete Specification

### 4.1 Maximum Glassmorphism Philosophy

We are implementing a highly dynamic, color-rich dual-theme setup completely built around **Maximum Glassmorphism**.

| Aspect | Light Mode ("Frost Canvas") | Dark Mode ("Deep Space Spacecraft") |
| --- | --- | --- |
| **Metaphor** | Light bouncing off translucent glass | Holographic displays in a control room |
| **Canvas** | Soft translucent white/off-white | Deep, saturated space blacks (`#0a0a0f`) |
| **Cards/Panels** | Heavy blur (`32px`), slight white tint, white borders | High saturation blur, rich neon shadows, thin glass borders |
| **Colors** | Vibrant and rich | Neon and deep, highly saturated |
| **Vibe** | Lightning fast, crisp, highly dynamic | Futuristic, fluid, vibrant |

### 4.2 Color System & Semantic Tones

Instead of flat Material 3 colors, we use rich, semi-transparent backgrounds with vibrant borders to achieve maximum glassmorphism.

| Status | Color | Purpose |
| --- | --- | --- |
| Neutral/Queue | Slate | `Not Started`, Draft |
| Active | Sky Blue | `In Progress`, Syncing |
| Warning | Amber | `On Hold`, Offline |
| Success | Emerald | `Completed`, Clean scan |
| Finalization | Teal | `Delivered`, Warranty |
| Verification | Royal Blue | `Acknowledged`, Approved |
| Attention | Purple | `Needs Discussion` |
| Emergency | Crimson | Critical issue, Break-Glass |

### 4.3 Typography — Poppins Exclusively

We use **Poppins everywhere** for maximum modern appeal, varying weights to establish hierarchy.

- **Headers/Display**: Poppins SemiBold / Bold (600/700)
- **Body/Standard**: Poppins Regular / Medium (400/500)
- **Technical/Numbers**: Poppins Light (300) with tabular numbers enabled.

### 4.4 Layout System (Highly Dynamic)

Layouts for every device must be perfectly dynamic, snapping beautifully across screen sizes without hardcoded pixel breaks, utilizing CSS Grid and modern Flexbox behavior.

- **Mobile**: Bottom glassmorphic navigation, stack cards vertically.
- **Tablet**: Floating glass rail or adaptive sidebar, masonry grid.
- **Desktop**: Expansive, resizable floating sidebars, multi-column dashboard, maximizing horizontal space.

### 4.6 Elevation System

| Level | Description | Light | Dark |
| --- | --- | --- | --- |
| L0 | Canvas | `#FAF9F4` flat | `#121411` flat |
| L1 | Card | White, 8px radius, 1px border | Navy surface, subtle border |
| L2 | Glass | `rgba(255,255,255,0.85)` + 12px blur | `rgba(18,26,33,0.85)` + cyan edge + 12px blur |
| L3 | Modal | Blue-tinted shadow + 40% backdrop | Black shadow + 40% backdrop |

---

## 5. Screen Architecture Per Role

### 5.1 Super Admin — Platform Governance

| Screen | Purpose | Key Data |
| --- | --- | --- |
| Control Center | Real-time system health dashboard | API uptime, active users, error rates |
| Infrastructure Command | Node topology, regional metrics | Server status, response times |
| Organization & Subscription Hub | Multi-tenant provisioning | Org list, tiers, storage quotas |
| Global Storage Monitoring | Quota analytics per org | Storage usage bars, pressure indicators |
| Break-Glass Security Console | Emergency RLS override | Crimson pulsating border, reason input |
| Break-Glass Log Review | Forensic audit trail | JetBrains Mono terminal-style grid |
| Audit Log Explorer | System-wide event trail | Timestamped JSONB diffs |
| Global Support & Ticket Triage | Platform-wide incidents | Priority badges, resolution notes |
| Invite Org Admin | Provision new organization | Subscription tier selection |
| Platform Config Manager | Maintenance mode, min app version | Toggle switches, version enforcement |

### 5.2 Admin — Organizational Command Center (66 Screens)

**Key Screens:**

- **Executive Dashboard**: Financial KPIs (contract values, CapEx), portfolio health, activity stream
- **Project Tracking Hub**: Active projects directory with status, PM, dates, milestones
- **Project Creation Wizard**: Multi-step flow (Master Data → Assignments → Config)
- **User & Vendor Directory**: Searchable/filterable user grid with role, org, status
- **Drawing & Media Hub**: Asset repository with version comparison (diff engine)
- **Master Material Tracking**: Procurement oversight with PO numbers, delivery dates
- **Change Request Approval Queue**: Variation management with cost/time impact analysis
- **Resource & Timesheet Hub**: Labor productivity matrix, allocated vs actual hours
- **Vendor Performance Audit**: Compliance scorecards, on-time %, avg delay
- **Client Onboarding Wizard**: Multi-step org setup flow (Profile → Subscription → Contact → Review)
- **Organizational Audit Log**: 12K+ events, immutable JSONB diffs, IP tracking
- **Archive & Data Retention**: Compliance-driven lifecycle management
- **ClamAV Upload Dropzone States**: Scanning → Clean/Infected visual states
- **Force Logout Security Modal**: Emergency session termination
- **Progress Update Moderation Feed**: Content validation before client visibility
- **Duplicate File Resolution**: Side-by-side comparison, merge/keep/purge
- **Virus Scan Dashboard**: File security threat monitoring
- **Automated Reporting Engine**: PDF report generation & scheduling
- **Bulk Notification Center**: Organization-wide broadcast tool

### 5.3 Project Manager — Field Execution

**Key Screens:**

- **PM Command Center**: Portfolio overview, active projects, pending tasks
- **Milestone & Task Management Hub**: Nested checklists, Kanban board, drag-reorder
- **Fullscreen Drawing Hub**: Anti-glare dark viewport, glassmorphic markup toolbar, version history
- **Camera-First Update Creator**: GPS-watermarked photo/video capture, direct-to-feed
- **Project Issues Logger**: Rapid defect entry with severity, root cause
- **Material Receipt & Verification**: QR scan, delivery proof upload
- **Collaboration Hub & @Mentions**: Threaded discussion with attachment support
- **Labor & Timesheet Logger**: Weekly matrix, submit/approve flow
- **Offline Sync Queue Manager**: Queued items with amber borders, retry/sync status
- **Draft Change Request Form**: Variation drafting with cost/time impact fields
- **Project Timeline Feed**: Narrative progress updates with media

### 5.4 Employee/Engineer — Technical Execution

**Key Screens:**

- **Master Workbench**: Daily sprint overview, task summary, open blockers, pending reviews
- **Multidisciplinary Task Board**: Kanban with markdown specs, checklist items
- **Engineering Asset Hub (CAD Viewer)**: Dark inverse viewport for technical inspection
- **Peer Review & Design Approvals**: PR/CAD validation queue with approve/reject/comment
- **Issue & Blocker Console**: Data-dense telemetry, severity-coded rows
- **Timesheet Logging Console**: Weekly matrix with "financial blindness" (no contract values)
- **Collaboration Hub & @Mentions**: Cross-department threaded discussion
- **Team Docs & Wiki**: Read-only SOP repository with folder tree navigation
- **Preferences & Integrations**: Tool bindings, notification filters

### 5.5 Vendor — Supply Chain Fulfillment

**Key Screens:**

- **Dispatch Dashboard**: KPI stack (pending deliveries, overdue, compliance score)
- **Material PO & Delivery Hub**: Transactional material ledger with PO tracking
- **Delivery Proof Upload Dropzone**: Secure media upload with ClamAV scanning
- **Task Execution Board**: Scoped Kanban for assigned services
- **Defect & Rework Console**: Rejection remediation feed
- **Invoicing & Payment Tracking**: High-contrast financial ledger
- **Driver Delivery Capture**: Mobile camera-first docket capture

### 5.6 Client — Executive Briefing

**Key Screens:**

- **Executive Portfolio Dashboard**: Macro overview with geospatial map, capital deployment
- **Project Briefing Hub**: Project-specific command room with live field telemetry
- **Financials & Change Request Board**: Financial sign-off portal, variation table
- **Asset & Deliverables Room**: Read-only design presentation room
- **Verified Progress Feed**: Narrative timeline with Acknowledge/Discuss buttons
- **Meeting & Agenda Hub**: Steering committee decisions, action items
- **Handover & Compliance Vault**: Final warranties, document downloads (15-min signed URLs)

---

## 6. Database Schema Summary

### 6.1 Core Tables (30 tables)

```mermaid
erDiagram
    organizations ||--o{ user_actor : "has members"
    organizations ||--o{ projects : "client for"
    organizations ||--o{ org_vendors : "has general vendor"
    user_actor ||--o{ projects : "PM of"
    user_actor ||--o{ project_vendors : "vendor for"
    user_actor ||--o{ updates : "authors"
    user_actor ||--o{ tasks : "assigned to"
    user_actor ||--o{ employee_timesheets : "logs"
    projects ||--o{ milestones : "has"
    projects ||--o{ updates : "tracks"
    projects ||--o{ tasks : "contains"
    projects ||--o{ project_materials : "tracks"
    projects ||--o{ drawing_versions : "stores"
    projects ||--o{ project_issues : "logs"
    projects ||--o{ change_requests : "has"
    projects ||--o{ project_resources : "allocates"
    projects ||--o{ client_approvals : "requires"
    projects ||--o{ project_handovers : "hands over"
    projects ||--o{ client_meetings : "schedules"
    milestones ||--o{ milestone_checklist_items : "has"
    milestones ||--o{ updates : "tagged to"
    updates ||--o{ media_attachments : "includes"
    updates ||--o{ comments : "has"
    updates ||--o{ acknowledgements : "receives"
    comments ||--o{ comment_mentions : "mentions"
    media_attachments ||--o{ virus_scan_results : "scanned as"
```

### 6.2 Key Schema Gaps Identified

> [!WARNING]
> **CRITICAL UPDATE: `db.md` is obsolete.**
> The active database schema is completely defined in `src/types/database.ts`, which contains 4,200+ lines of exact type definitions directly generated from the live Supabase instance.

**Actionable Insights:**

1. **Single Source of Truth**: Ignore `db.md`. Use `database.ts` exclusively for any backend/frontend schema development.
2. **Missing Tables Resolved**: Tables like `batch_upload_jobs`, `bim_clashes`, `change_requests_history`, and `daily_logs` exist in `database.ts` and represent the actual production-ready architecture.
3. **RLS Verification**: Since the structure is already built, our backend focus shifts strictly to ensuring RLS policies, permissions, and server actions correctly interface with the structures defined in `database.ts`.

### 7.1 What Exists

| Component | Status | Quality |
| --- | --- | --- |
| Next.js App Router structure | ✅ Exists | Properly scaffolded with route groups |
| Supabase Auth integration | ✅ Functional | Login flow works, middleware role-checking |
| Role-based routing middleware | ✅ Functional | Redirects users to correct role dashboards |
| Tailwind + M3 design tokens | ✅ Implemented | Colors, typography, semantic tokens configured |
| DashboardShell (sidebar+topbar) | ✅ Exists | Per-role sidebar/topbar components |
| UI component library | ✅ Partial | Card, DataTable, KPICard, StatusBadge, etc. |
| Dark/Light theme toggle | ✅ Functional | Via next-themes |
| ProjectWizard | ✅ Partial | Multi-step form exists |
| Server Actions | ✅ Partial | updateProjectConfig, approveChangeRequest |

### 7.2 What's Missing or Broken

> [!CAUTION]
> **The prototype is fundamentally a navigation shell with ~95% placeholder pages.**

| Gap | Severity | Description |
| --- | --- | --- |
| **95% of pages are placeholders** | 🔴 Critical | Most routes render a "construction" banner, no actual UI or data |
| **Role column bug** | 🔴 Critical | `database.ts` types define `roles: string[]` (array) but auth code reads `role` (singular string) |
| **No base migrations** | 🔴 Critical | Foundational tables (`projects`, `user_actor`) have no migration file |
| **Open RLS (USING true)** | 🟡 High | Any authenticated user can query any data — defeats RBAC |
| **No design fidelity** | 🔴 Critical | Pages that do exist don't match the Stitch concept designs |
| **No data seeding** | 🟡 High | No mock/seed data for any table |
| **No offline indicators** | 🟡 High | Missing sync banners, amber queue borders, retry UI |
| **No drawing viewer** | 🟡 High | No fullscreen pan/zoom/annotate viewer |
| **No camera capture UI** | 🟡 High | No GPS-watermarked photo/video capture flow |
| **No file upload** | 🟡 High | No ClamAV dropzone or virus scan states |
| **Sidebars don't match design** | 🔴 Critical | Sidebar items don't correspond to the design navigation structure |
| **No breadcrumb navigation** | 🟡 Medium | Missing nested tab/breadcrumb patterns from designs |
| **No modal/drawer system** | 🟡 Medium | No reusable modal/drawer for edit forms, confirmations |
| **No KPI dashboard cards** | 🟡 Medium | Dashboard pages don't show financial/operational KPIs |
| **No data tables** | 🟡 Medium | Audit logs, material tracking, user directory — all empty |
| **No form implementations** | 🟡 Medium | Project creation, user invite, client onboarding — missing |

### 7.3 Design vs Prototype — Side-by-Side Comparison

| Design Feature | Stitch Concept | Current Prototype |
| --- | --- | --- |
| **Admin Dashboard** | Financial KPIs, portfolio health chart, activity stream, storage analytics | Empty page with navigation shell |
| **Admin Sidebar** | ~20 items (Dashboard, Projects, Materials, Drawings, Issues, Resources, Changes, Reports, Vendors, Audit, Archive, Security, Settings, Support) | ~6 generic items that don't match |
| **Project Tracking Hub** | Data-dense table with status badges, PM names, milestone progress bars | Placeholder |
| **User Directory** | Filterable table with role/status/org columns, action buttons | Placeholder |
| **Drawing Hub** | Fullscreen dark viewport, glassmorphic markup toolbar, version history panel | Placeholder |
| **PM Dashboard** | Active projects, pending tasks, milestone tracking, open checklists | Placeholder |
| **Vendor Dashboard** | KPI stack, pending deliveries, compliance score | Placeholder |
| **Client Dashboard** | Geospatial portfolio map, active deployments, progress feed | Placeholder |
| **Engineer Workbench** | Sprint overview, Kanban board, pending reviews, open blockers | Placeholder |
| **Super Admin** | System health dashboard, storage monitoring, break-glass console | Placeholder |

---

## 8. Key Architectural Insights from the Design

### 8.1 Critical UX Patterns That Must Be Implemented

1. **Offline Sync Engine**: Amber pulsing border on queued items → Sky Blue sync banner → Crimson on failure. This is a *defining* feature for field workers.

2. **File Upload Dropzone with ClamAV**: Dashed border container → drag/drop → scanning radar animation → Clean (emerald) / Infected (crimson with blur overlay) / Duplicate (amber side-by-side dialog).

3. **Break-Glass Security**: Crimson pulsating border around the entire interface, forensic JetBrains Mono audit trail, mandatory email notification to affected org.

4. **Drawing Hub**: Always-dark viewport regardless of theme, floating glassmorphic markup toolbar, version history panel with avatar + timestamp.

5. **Camera-First Capture**: GPS watermarked photos with timestamp overlay, direct-to-feed posting.

6. **Semantic Status Badges**: All status fields across the platform must use the consistent 8-tone color system.

### 8.2 Navigation Structure Per Role

**Super Admin Sidebar:**

- Control Center, Infrastructure, Organizations, Storage Monitoring, Break-Glass Console, Break-Glass Logs, Audit Logs, Support Triage, Invite Org Admin, Platform Config

**Admin Sidebar:**

- Dashboard, Projects (Tracking Hub, Creation, Config, Module Flags), Users & Vendors, Materials, Drawings, Issues & Blockers, Resources & Timesheets, Change Requests, Reports, Audit Log, Support, Vendor Performance, Broadcasts, Archive, Security (Threats, Duplicates, Dropzone, Force Logout, Break-Glass), Client (Onboarding, Approvals, Moderation), Settings

**PM Sidebar:**

- Command Center, Active Projects (expandable), Milestones & Tasks, Drawings, Materials, Collaboration, Timesheets, Handovers & Meetings, Lessons Learned, Reporting, Offline Sync, Support

**Engineer Sidebar:**

- Workbench, Assigned Tasks, Engineering Hub (CAD Viewer), Peer Reviews, Issue Tracker, Timesheets, Collaboration, Team Docs & Wiki, Settings

**Vendor Sidebar:**

- Dispatch Dashboard, Material PO & Deliveries, Proof Upload, Task Execution, Defect & Rework, Invoicing

**Client Sidebar:**

- Executive Summary/Portfolio, Project Briefing, Financials, Progress Feed, Deliverables, Meetings, Handover Vault, Support

---

## 9. What Needs to Happen Next

To transform the current prototype into a faithful, functional representation of the Setuu platform:

### Phase 1: Foundation (Architecture & Shell)

- Fix the `role` vs `roles` type bug
- Create complete Supabase migrations matching db.md
- Implement proper RLS policies from db.md
- Seed the database with realistic mock data
- Rebuild all 6 sidebars to exactly match design navigation
- Implement reusable modal/drawer/breadcrumb components
- Build the complete design system (tokens already mostly correct)

### Phase 2: Core Screens (Admin + PM)

- Admin Executive Dashboard with KPI cards and charts
- Project Tracking Hub with data tables
- Project Creation Wizard (full multi-step flow)
- User & Vendor Directory with filtering
- PM Command Center
- Milestone & Task Management
- Progress Update Feed

### Phase 3: Feature Modules

- Drawing & Media Hub (viewer + annotations)
- Material Tracking
- Change Request flow
- Resource & Timesheet management
- Audit Log viewer
- Support Ticket system

### Phase 4: Remaining Roles

- Engineer Workbench & Task Board
- Vendor Dashboard & Invoicing
- Client Portal & Executive Briefing
- Super Admin Platform Management

### Phase 5: Advanced Features

- Offline sync indicators
- ClamAV file upload states
- Break-glass security console
- Camera-first capture flow
- PDF report generation
- Dark mode polish

> [!IMPORTANT]
> This prototype is meant to be a **functional UI + database prototype** that will later be converted to Flutter. The focus should be on getting every screen, every interaction, and every data flow working correctly with real Supabase data — not on production-grade offline sync or native camera features.
