---
name: Setuu Enterprise
colors:
  surface: '#faf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#faf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ef'
  surface-container: '#efeee9'
  surface-container-high: '#e9e8e3'
  surface-container-highest: '#e3e3de'
  on-surface: '#1b1c19'
  on-surface-variant: '#43474d'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#73777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#46607e'
  primary: '#000815'
  on-primary: '#ffffff'
  primary-container: '#00213c'
  on-primary-container: '#6f89a9'
  inverse-primary: '#aec9eb'
  secondary: '#00658d'
  on-secondary: '#ffffff'
  secondary-container: '#8ad1ff'
  on-secondary-container: '#005a7f'
  tertiary: '#00080f'
  on-tertiary: '#ffffff'
  tertiary-container: '#002233'
  on-tertiary-container: '#0090c7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#aec9eb'
  on-primary-fixed: '#001d35'
  on-primary-fixed-variant: '#2e4965'
  secondary-fixed: '#c6e7ff'
  secondary-fixed-dim: '#88cffc'
  on-secondary-fixed: '#001e2d'
  on-secondary-fixed-variant: '#004c6b'
  tertiary-fixed: '#c6e7ff'
  tertiary-fixed-dim: '#82cfff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6b'
  background: '#faf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e3e3de'
typography:
  display-lg:
    fontFamily: Merriweather
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Merriweather
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Merriweather
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Merriweather
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Merriweather
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter-md: 24px
  margin-mobile: 16px
  margin-tablet: 24px
  margin-desktop: 32px
  sidebar-width: 280px
  rail-width: 72px
---

## 1. Brand & Psychological Design Philosophy

Setuu Enterprise is engineered for the high-stakes, multi-tenant environment of B2B industrial project management[cite: 10]. Moving beyond a strictly utilitarian interface, the system embraces a **Corporate / Modern SaaS** aesthetic that balances clinical precision with fluid, adaptive ergonomics. The visual narrative is defined by "Industrial Reliability"—an interface that feels as sturdy, predictable, and dependable as the infrastructure projects it governs[cite: 10, 12].

### Dual-Theme Ergonomics (Light vs. Dark Mode)
To support field workers in direct sunlight and Project Managers in low-light architectural environments, the system features two distinct aesthetic profiles:
*   **Light Mode (The Canvas & Sheet):** A foundational off-white canvas (`#FAF9F4`) populated by elevated, pure white interactive sheets. Deep Praimo Blue (`#00213C`) drives the primary structural actions.
*   **Dark Mode (The CAD Blueprint):** A Deep Slate base (`#0A0F14`) layered with elevated Navy surfaces (`#121A21`). To maintain contrast, primary actions invert to a neon Precision Cyan (`#41BEFD`), mimicking glowing terminal readouts and architectural blueprint highlights.

## 2. Color Architecture & Semantic Workflow System

To accommodate the deep relational complexities of the database—including milestones, client approvals, and issue tracking—the design system employs a rigorous 8-tone semantic workflow system mapped directly to the `project_status` and `ack_status` enums[cite: 11, 12]. 

*Note: In Light Mode, these colors are highly saturated. In Dark Mode, semantic backgrounds use a 15% opacity fill to glow softly against the slate background, while text remains at 100% opacity for legibility.*

*   **Neutral/Queue (Slate `#64748B`):** `Not Started`, Draft Updates.
*   **Active (Sky Blue `#0284C7`):** `In Progress`, Syncing to Cloud.
*   **Warning (Amber `#D97706`):** `On Hold`, Offline State, Duplicate File Warning.
*   **Success (Emerald `#16A34A`):** `Completed`, Clean Virus Scan.
*   **Finalization (Teal `#0D9488`):** `Delivered`, Warranty Active.
*   **Verification (Royal Blue `#2563EB`):** Client `Acknowledged`, Approved Change Request.
*   **Attention (Purple `#9333EA`):** `Needs Discussion`, Pending Client Review.
*   **Emergency (Crimson `#DC2626`):** Critical Issue, Break-Glass Access Triggered, Malicious File Detected.

## 3. Typography & Information Density

The system relies on a specialized tri-font strategy to separate intent and manage extreme data density seamlessly:
*   **Merriweather (Serif) - The Executive Layer:** Used for high-level reports, automated PDF export headers, and overarching dashboard titles. It provides an authoritative, formal legal-record aesthetic[cite: 10, 12].
*   **Inter (Sans-Serif) - The Operational Layer:** The workhorse typography for data-dense tables, comments, and form inputs. Optimized for high legibility on mobile screens in direct sunlight.
*   **JetBrains Mono (Monospaced) - The Technical Layer:** Exclusively used for system-generated metadata, including `latitude`/`longitude` media watermarks, exact `timestamptz` outputs, file hashes, and immutable `audit_log` records[cite: 11, 12].

## 4. Adaptive Grid & Cross-Platform Layouts

To support the robust GoRouter implementation and complex nested data relations, the layout behaves fluidly across four distinct operational environments:

### Mobile (Field Workers & PMs)
*   **Grid:** 4-column fluid layout with 16px margins.
*   **Navigation:** Thumb-zone optimized fixed bottom navigation bar utilizing Glassmorphism.
*   **Interactivity:** Heavy reliance on Floating Action Buttons (FABs) positioned at `bottom-right` for immediate media capture and quick progress updates[cite: 12]. Persistent offline-sync status banners sit immediately below the safe-area top notch.

### Tablet (On-Site Management)
*   **Grid:** 8-column layout with 24px margins.
*   **Navigation:** Collapsible 72px Navigation Rail to maximize horizontal viewport space.
*   **Interactivity:** Split-pane views for "Master-Detail" relational workflows. For example, navigating `/projects/:projectId/milestones` displays the milestone list on the left pane (4 columns) and dynamically loads the nested `milestone_checklist_items` in the right detail pane (4 columns)[cite: 11, 12].

### Desktop / Web (Admin & Client Dashboards)
*   **Grid:** 12-column grid with a persistent 280px sidebar (Deep Blue in Light Mode, Ultra-Dark Navy `#04070A` in Dark Mode). Content is centered with a maximum width constraint of 1600px.
*   **Interactivity:** Wide, horizontally scrollable data-dense tables for `project_materials`, `audit_log` reviews, and cross-project reporting analytics[cite: 11, 12].

## 5. Elevation, Depth & Glassmorphism

Elevation transitions from absolute flatness to a modern, layered Z-index system to manage visual clutter without losing engineering precision.

*   **Level 0 (Canvas):** The base non-interactive layer (`#FAF9F4` in Light, `#0A0F14` in Dark).
*   **Level 1 (Card/Sheet):** Elevated surfaces with an 8px radius. Light mode uses a sharp 1px `#E0E0E0` border. Dark mode uses a subtle `#334155` border to separate elements. Rest states have no shadow; interactive elements gain a diffused `shadow-sm` on hover.
*   **Level 2 (Glassmorphism):** Utilized for sticky contextual toolbars, bottom navigation, and the Drawing Hub markup rail. 
    *   *Light Mode:* `rgba(255, 255, 255, 0.85)` with a white inner border.
    *   *Dark Mode:* `rgba(18, 26, 33, 0.85)` with a faint cyan inner border (`rgba(65, 190, 253, 0.2)`). Both modes require a 12px backdrop filter blur.
*   **Level 3 (Overlay/Modals):** High-elevation components utilize heavy, diffused drop-shadows. Light mode tints the shadow blue; Dark mode uses pure black shadows. Modals are paired with a 40% opacity black backdrop (`z-index: 90`).

## 6. Role-Based Interface Mapping (RBAC UI)

The design language explicitly morphs to accommodate the Row-Level Security (RLS) constraints and distinct workflows of the six `user_actor` roles[cite: 10, 11].

### 6.1 Super Admin Control Center
*   **Aesthetic:** Highly clinical, metric-driven, and entirely devoid of confidential project-level data[cite: 10]. 
*   **Layout:** Expansive dashboard grids featuring Storage Quota Gauges mapped to `subscription_tiers`. Gauges are 4px horizontal progress bars utilizing Sky Blue for nominal status and Crimson for >90% capacity[cite: 11]. 
*   **Break-Glass UI:** The emergency access interface utilizes a persistent Crimson Red border and pulsates slowly to indicate elevated, logged access. The `break_glass_logs` table is rendered in a dense JetBrains Mono terminal-style grid to emphasize its immutable nature[cite: 11, 12].

### 6.2 Admin & PM Workspace
*   **Aesthetic:** Comprehensive, navigational, and authoritative.
*   **Layout:** Heavily utilizes nested tabs and breadcrumb navigation (`Home > Projects > [Project Name] > Materials`)[cite: 12]. Features prominent action buttons for project configuration and feature toggles linked to `project_config`[cite: 11]. Financial inputs mapped to `projects.contract_value` and `change_requests.cost_impact` are highlighted with subtle green accents to denote sensitive data visibility restricted to Admins[cite: 10, 11].

### 6.3 Employee Field View
*   **Aesthetic:** High-contrast, hyper-focused, and distraction-free.
*   **Layout:** Stripped of complex analytics. The UI prioritizes massive touch targets (48px minimum height) for gloved interaction[cite: 12]. Relies heavily on full-screen camera viewfinders and high-visibility offline sync indicators.

### 6.4 Vendor Portal (Subcontractors)
*   **Aesthetic:** Ultra-minimalist and highly isolated[cite: 10].
*   **Layout:** A decluttered, single-pane dashboard displaying *only* assigned `project_materials` and pending tasks where `vendor_id` matches the user[cite: 10, 11]. Features massive, centralized File Upload Dropzones for submitting delivery proofs.

### 6.5 Client Dashboard
*   **Aesthetic:** Presentation-grade, secure, and transparent.
*   **Layout:** Focuses on actionable oversight. Features prominent action buttons for "Acknowledged" (Royal Blue) and "Needs Discussion" (Purple) mapped directly to the `acknowledgements` table[cite: 11, 12]. Document download modules explicitly indicate 15-minute expiring URLs for handover packages[cite: 10, 12].

## 7. Advanced Component Library & Deep Integrations

### 7.1 Drawing & Media Hub (`drawing_versions`)
A specialized, fullscreen interface designed for interacting with blueprints and architectural PDFs[cite: 10, 11].
*   **Canvas Area:** Edge-to-edge interactive pan-and-zoom viewport. The background is strictly locked to dark inverse (`#1B1C19`) regardless of Light/Dark mode settings to drastically reduce glare on bright technical schematics.
*   **Markup Toolbar (Left):** A floating, vertical Glassmorphic rail containing annotation tools. Active tools glow with Precision Cyan.
*   **Version History Panel (Right):** A collapsible 320px sheet listing all iterations from the `drawing_versions` table. It displays the `uploaded_by` user avatar and exact `created_at` timestamp in JetBrains Mono[cite: 11].

### 7.2 Offline Sync Engine (Optimistic UI & `WorkManager`)
The UI must visually communicate complex network states to field workers without inducing panic[cite: 10, 12].
*   **Optimistic State:** When a user submits an update offline, the newly created card immediately appears in the feed but features a subtle, pulsating Amber border (`2px solid #D97706`) and a "Queued" icon[cite: 12].
*   **Sync Banner:** A persistent 36px high banner drops down below the app bar. An Amber background with dark text dictates "Offline - Changes Saved Locally". When connectivity restores, the banner smoothly transitions to Sky Blue (`#0284C7`) stating "Syncing to Cloud...", paired with a linear indeterminate progress bar[cite: 12].
*   **Exponential Backoff Error:** If the `SyncOperation` fails, the card border turns Crimson Red and exposes a manual "Retry" secondary button styled with Precision Cyan[cite: 12].

### 7.3 File Upload Dropzones (Duplicate & Threat Detection)
Integrated heavily with Deno edge functions for robust file security[cite: 10, 12].
*   **Upload State:** Displayed as a rounded 8px container with a 2px dashed border and an inner shadow. The border turns Precision Cyan during a drag-and-drop hover event.
*   **Virus Scanning (ClamAV):** Immediately post-upload, the file tile displays a spinning radar icon and a "Scanning..." label[cite: 10, 12].
*   **Verification States:** 
    *   *Clean:* The tile outlines in Emerald Green, inserting a record into `virus_scan_results` with `is_clean: true`[cite: 11].
    *   *Infected:* The tile flashes Crimson Red, the file preview is obfuscated with a heavy blur overlay, and a critical alert dialog prevents database submission[cite: 11].
    *   *Duplicate Detected:* If the `similarity_score` triggers a threshold in the `duplicate_files` table, an Amber warning dialog prompts the user with side-by-side visual comparisons to either merge or override the upload[cite: 11, 12].

### 7.4 Support Ticketing System (`support_tickets`)
A specialized Help Desk module designed for user issue resolution[cite: 11, 12].
*   **Layout:** Features severity priority badges (e.g., Crimson for High, Slate for Low), threaded `resolution_notes`, and a highly visible `updated_at` tracker in JetBrains Mono to inform users of the last action taken by an Admin[cite: 11].