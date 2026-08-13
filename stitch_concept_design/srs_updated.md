# SETUU — Software Requirements Specification | v2.0

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for Setuu — a B2B client-facing project tracking Android application developed for Praimo Innovation. The document serves as the authoritative reference for the development scope, acceptance criteria, and technical implementation standards.

### 1.2 Scope

Setuu is a B2B Android mobile application enabling Praimo's project managers, employees, and vendors to upload project progress (photos, videos, documents, captions) from the field, and allowing Praimo's clients (plant managers, procurement heads, engineering leads) to view real-time project status on their mobile devices.

#### 1.2.1 In Scope (MVP v2.0)

- Native Android application
- Backend REST API with PostgreSQL database
- Six user roles: Super Admin, Admin, Project Manager (PM), Employee, Vendor, Client
- Multi-tenant organization support with subscription tiers
- Project and milestone management, including sub-item checklists
- Progress update uploads with media (photo, video, documents) and approval flows
- Advanced Feature Modules (Materials, Issues, Resources, Change Requests, Handovers, Lessons Learned, Approvals, Meetings)
- Offline mode with background sync, optimistic UI updates, and resumable uploads
- Automated PDF Reporting Engine for generating shareable progress reports
- Push notifications via Firebase Cloud Messaging
- Admin web dashboard
- Comprehensive Audit logging
- Duplicate file detection and automated virus scanning
- Support ticketing system
- Drawing version control and management

#### 1.2.2 Out of Scope

- iOS version (Deferred to Phase 3)
- Live video streaming or real-time chat
- WhatsApp Business API integration

## 2. Overall Description

### 2.1 Product Perspective

Setuu consists of three components:

- **Android Mobile App (primary)**: Used by PMs, Employees, Vendors, and Clients.
- **Backend API Server (Supabase)**: Handles authentication, data isolation (RLS), edge functions, file storage, and notifications.
- **Admin Web Dashboard**: Lightweight web interface accessible to Super Admins and Admins for bulk operations, configuration, and reporting.

### 2.2 User Classes and Characteristics

- **Super Admin (App Owner / Developer)**: High tech skill. Manages platform health, global settings, subscriptions, and storage quotas. Strictly respects privacy policies: cannot view the content of client/admin organizations' projects or any confidential data, though they can monitor storage usage per Admin.
- **Admin User (Praimo Leadership)**: High tech skill. Goals: Oversight, org management, subscription tiers, project creation, client onboarding.
- **Project Manager (PM)**: Medium tech skill. Uses app in the field. Goals: Upload updates, manage milestones and checklists, upload/version drawings, manage feature modules.
- **Employee**: Field workers and engineers. Medium-to-high tech skill. Goals: Create rapid progress updates on assigned projects, log labor and timesheets, view CAD drawings, collaborate via team docs & wiki, and conduct peer/design reviews.
- **Vendor (Subcontractor / Supplier)**: Assigned at the project or organization level. Goals: Upload delivery proofs, update assigned material statuses, submit scoped progress updates, track delivery logistics, manage defect & rework remediation, and track invoicing.
- **Client User**: External stakeholders. Medium tech skill. Goals: Check project status, download documents, respond to approvals.

### 2.3 Operating Environment

- **Mobile client**: Android 9.0 (API level 28) and above.
- **Backend**: Supabase Cloud Platform (PostgreSQL 17, Storage, Edge Functions).

## 3. System Features and Functional Requirements

### 3.1 Authentication and User Management

- **FR-101 [MUST]** Admin users shall be able to invite a new user by entering email, full name, phone number, and linking to an organization.
- **FR-102 [MUST]** The system shall send a time-limited invitation link via email.
- **FR-103 [MUST]** Invited users shall set a password meeting minimum complexity (8 characters, letter, number, special character).
- **FR-104 [MUST]** The system shall prevent public self-registration.
- **FR-105 [MUST]** The system shall support login via email and password.
- **FR-106 [MUST]** On successful first login from a new device, the system shall require OTP verification via email.
- **FR-107 [MUST]** The system shall support biometric login (fingerprint/face) on subsequent logins, utilizing secure local keystores (e.g. `flutter_secure_storage` and `local_auth`).
- **FR-108 [MUST]** The system shall implement account lockout after 5 consecutive failed login attempts (lockout duration 15 minutes).
- **FR-109 [MUST]** Users shall maintain a profile featuring a display name, bio, and avatar URL.
- **FR-110 [MUST]** Admins shall be able to force-logout any user within their organization from all devices.

### 3.2 Organizations and Subscriptions

- **FR-150 [MUST]** Super Admins shall manage Client and Internal organizations, including the ability to temporarily suspend or lock an entire organization (revoking access for all downstream roles).
- **FR-151 [MUST]** Organizations shall enforce `max_projects` and storage limits based on a dynamically configurable `subscription_tier`.
- **FR-152 [MUST]** Super Admins shall define subscription tiers (e.g., Starter, Enterprise) including limits for storage quotas and maximum projects.
- **FR-153 [MUST]** RLS policies shall isolate data strictly by the user's `organization_id`.

### 3.3 Project Management

- **FR-201 [MUST]** Admins shall create projects defining: name, client org, assigned PM, PO reference, start date, target date, contract value, and client visibility.
- **FR-202 [MUST]** Project status shall be one of: Not Started, In Progress, On Hold, Completed, Delivered.
- **FR-203 [MUST]** Contract value shall be visible only to Admins.
- **FR-204 [MUST]** Projects shall support tagging and a modular `project_config` to enable/disable features per project.
- **FR-205 [MUST]** Projects shall support an ordered list of milestones with percentage weights and department assignments.
- **FR-206 [MUST]** Milestones shall support nested, reorderable checklist items (`milestone_checklist_items`).
- **FR-207 [MUST]** Project progress percentage shall be computed as the weighted completion of its milestones.
- **FR-208 [MUST]** System shall support an on-demand PDF Reporting Engine to generate formatted, printable, and shareable progress reports containing tasks, materials, and milestone data.
- **FR-209 [MUST]** Admins can soft-delete projects (marked as archived).
- **FR-210 [MUST]** System shall support assigning Vendors to specific projects (`project_vendors`) or entire organizations (`org_vendors`).

### 3.4 Progress Updates (Core Feature)

- **FR-301 [MUST]** PMs, Employees, and Vendors shall be able to create progress updates on projects they have access to.
- **FR-302 [MUST]** An update shall contain a caption, photos, videos, documents, and an optional milestone tag.
- **FR-303 [MUST]** Updates shall track the author's latitude, longitude, and location name.
- **FR-304 [MUST]** The system shall apply a watermark (timestamp, GPS) to captured media.
- **FR-305 [MUST]** Videos shall be compressed to 720p HD. Photos shall be compressed to <1 MB client-side.
- **FR-306 [MUST]** Updates shall support an `approval_status` workflow before being visible to clients (if configured).
- **FR-307 [MUST]** Vendors shall only be able to view their own progress updates, maintaining client confidentiality.

### 3.5 Offline Functionality

- **FR-311 [MUST]** The app shall allow users to perform key mutations (e.g. updating Tasks, Materials) while offline.
- **FR-312 [MUST]** Offline mutations shall use an Optimistic UI approach (updating the local Hive cache immediately) while queuing a generalized `SyncOperation` for background sync.
- **FR-313 [MUST]** The app shall display a persistent Offline Mode banner when connectivity is lost and automatically process the background queue when online. The UI shall use specific states: amber pulsing border on queued items, sky blue sync banner, and crimson on failure.
- **FR-314 [MUST]** Failed uploads shall retry with exponential backoff.
- **FR-315 [SHOULD]** Large file uploads shall be resumable if interrupted.

### 3.6 Media & File Integrity

- **FR-320 [MUST]** The system shall implement duplicate file detection utilizing similarity scoring/hashes to prevent redundant uploads.
- **FR-321 [MUST]** All uploaded files shall be asynchronously processed by a virus scanner. Results are stored in `virus_scan_results`.
- **FR-322 [MUST]** PMs and Admins shall manage `drawing_versions`. The system shall provide an in-app Drawing Viewer supporting PDFs (view-only) and Images (PNG/JPG).
- **FR-323 [MUST]** The in-app Drawing Viewer shall allow users to draw annotations/markups on image files and automatically save the annotated image as a new version to preserve the audit trail.
- **FR-324 [MUST]** File access shall be protected via signed, time-limited URLs (max 15 mins).

### 3.7 Collaboration: Comments & Acknowledgements

- **FR-330 [MUST]** Users can post text comments on updates, supporting @mentions.
- **FR-331 [MUST]** Client users shall be able to mark an update as "Acknowledged" or "Needs Discussion".

### 3.8 Feature Modules (Advanced Tracking)

- **FR-401 [MUST] Project Materials**: Track required materials, quantities, estimated/actual delivery dates, suppliers, and POs. Vendors can be assigned to individual materials.
- **FR-402 [MUST] Project Issues**: Log blockers with severity, cost impact, root causes, and resolution plans.
- **FR-403 [MUST] Change Requests**: Track requested variations, cost/time impacts, and approval workflows.
- **FR-404 [MUST] Project Resources**: Monitor resource allocation, actual vs allocated hours, and productivity scores.
- **FR-405 [MUST] Client Approvals**: Formally record document/milestone approvals by clients.
- **FR-406 [MUST] Lessons Learned**: Build a knowledge base identifying impacts and recommendations.
- **FR-407 [MUST] Project Handovers**: Manage handover packages, client signatures, and warranty expirations.
- **FR-408 [MUST] Client Meetings**: Document meeting dates, attendees, agenda minutes, and action items.
- **FR-409 [MUST] Labor & Timesheets**: Allow PMs and Employees to log daily hours and view their timesheets.
- **FR-410 [MUST] Invoicing**: Allow Vendors to track invoicing and payments against their POs.
- **FR-411 [MUST] Team Docs & Wiki**: Provide a knowledge base of internal SOPs and team documentation.
- **FR-412 [MUST] Defect & Rework Remediation**: Allow PMs and Vendors to manage defects using the existing `project_issues` module with specific categories.

### 3.9 Notifications & Dashboards

- **FR-501 [MUST]** The system shall send push notifications (FCM) for new updates, @mentions, comments, and milestones.
- **FR-502 [MUST]** Tapping a notification shall deep-link the user to the relevant screen.
- **FR-503 [MUST]** Client Home shall display active projects, unseen update indicators, and pending acknowledgements.
- **FR-504 [MUST]** PM/Employee Home shall display assigned projects and flag projects lacking updates for 3+ days.
- **FR-505 [MUST]** Vendor Home shall display assigned projects, pending material deliveries, and overdue tasks.
- **FR-506 [MUST]** Admin Dashboard shall show global metrics, contract values, and drill-downs into orgs.
- **FR-507 [MUST]** Super Admin Dashboard shall show anonymized platform-wide health metrics (API error rates, active timezones, Daily Active Users), active subscription counts, and **storage usage** (broken down per Admin/Organization and downstream roles). It shall **strictly not expose** the content of the data (organization internals, project specifics, confidential files) to respect privacy.
- **FR-508 [MUST]** Super Admins shall be able to broadcast platform-wide announcements (push notifications or in-app banners) to all active users.

### 3.10 Support Tickets

- **FR-601 [MUST]** Users shall be able to submit `support_tickets` describing issues, including a priority level.
- **FR-602 [MUST]** Admins and Super Admins shall be able to read and resolve support tickets. This includes updating the ticket's `status` (Open, In Progress, Resolved) and providing `resolution_notes`.
- **FR-603 [MUST]** The system shall track the `updated_at` timestamp for all support tickets to indicate when the last change occurred.

### 3.11 Audit Logging

- **FR-701 [MUST]** The system shall log all INSERT, UPDATE, and DELETE operations to the `audit_log` via PostgreSQL triggers.
- **FR-702 [MUST]** Audit entries shall capture: timestamp, user ID, event type, affected table/resource, IP address, and full JSONB snapshots of `old_data` and `new_data`.
- **FR-703 [MUST]** Audit logs shall be read-only and restricted to Admins and Super Admins (System Metadata).

### 3.12 Platform Administration (Super Admin)

- **FR-801 [MUST]** Super Admins shall be able to toggle a global "Maintenance Mode" that gracefully prevents logins and operations.
- **FR-802 [MUST]** Super Admins shall be able to enforce minimum mobile app versions, blocking users on outdated, unsupported versions.
- **FR-803 [MUST]** The system shall provide a highly secure "Break-Glass" emergency access mode. This mode allows Super Admins to temporarily bypass standard RLS privacy restrictions for critical technical support.
- **FR-804 [MUST]** Invoking Break-Glass mode MUST trigger an immutable audit log entry and automatically dispatch a warning email to the affected Client/Admin explaining exactly what was accessed and why. The UI shall display a crimson pulsating border to clearly indicate the emergency RLS override mode.

## 4. Non-Functional Requirements

### 4.1 Performance

- **NFR-101 [MUST]** Cold start to home screen in under 3 seconds.
- **NFR-102 [MUST]** API requests shall return in under 800 ms at the 95th percentile.
- **NFR-103 [MUST]** Offline queue shall handle at least 50 pending updates smoothly.

### 4.2 Security

- **NFR-201 [MUST]** TLS 1.2+ for all data in transit, coupled with SSL Certificate Pinning in the mobile app.
- **NFR-202 [MUST]** Strict Row-Level Security (RLS) shall be enforced at the database level for every table.
- **NFR-203 [MUST]** JWT refresh tokens and biometric keys shall use Android EncryptedSharedPreferences / iOS Keychain.
- **NFR-204 [MUST]** Server-side rate limiting (100 req/min for general, 5 req/min for auth).

### 4.3 Usability & Reliability

- **NFR-301 [MUST]** The backend shall target 99.5% uptime.
- **NFR-302 [MUST]** App shall not crash or lose data during network transitions; it must gracefully fallback to offline caching.

### 4.4 Legal & Compliance

- **NFR-401 [MUST]** App must comply with Google Play Store Data Safety declarations.
- **NFR-402 [MUST]** Compliance with India's DPDPA 2023 (consent, right to deletion).

### 4.5 Design & UI/UX Standards

- **NFR-501 [MUST]** The application shall adhere to a Material 3-inspired design system utilizing an 8-Tone Semantic Workflow Colors palette (Neutral, Active, Warning, Success, Finalization, Verification, Attention, Emergency).
- **NFR-502 [MUST]** The application shall support both Light and Dark themes. The Dark theme shall utilize distinct token mappings (e.g., inverting primary colors, 15% opacity semantic fills) to reduce eye strain in architectural/CAD environments.

## 5. Role Permission Matrix

| Capability | Super Admin | Admin | PM | Employee | Vendor | Client |
| ------------ | ------------- | ------- | ---- | ---------- | -------- | -------- |
| View projects | No | All | Assigned | Assigned | Assigned | Org only |
| Edit project / Create project | No | Yes | No | No | No | No |
| View Contract Values | No | Yes | No | No | No | No |
| Upload progress update | No | Yes | Assigned | Assigned | Assigned scope | No |
| View updates | No (Privacy) | Yes | Assigned | Assigned | Own updates only | Org only |
| Acknowledge updates | No | Yes | No | No | No | Yes |
| Manage Drawings & Modules | No | Yes | Assigned | No | No | No |
| Comment & Mention | No | Yes | Yes | Yes | Own updates only | Yes |
| Manage Users / Orgs | Billing Only | Yes | No | No | No | No |
| View Audit Logs | System only | Yes | No | No | No | No |
| Update Assigned Materials | No | Yes | Yes | No | Yes | No |
| Log Timesheets & View Wiki | No | Yes | Yes | Yes | No | No |
| Manage Invoices | No | Yes | Yes | No | Yes | No |
