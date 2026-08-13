---
name: Setuu Enterprise
colors:
  surface: '#121411'
  surface-dim: '#121411'
  surface-bright: '#383a36'
  surface-container-lowest: '#0d0f0c'
  surface-container-low: '#1b1c19'
  surface-container: '#1f201d'
  surface-container-high: '#292a27'
  surface-container-highest: '#343532'
  on-surface: '#e3e3de'
  on-surface-variant: '#c3c6ce'
  inverse-surface: '#e3e3de'
  inverse-on-surface: '#30312e'
  outline: '#8d9198'
  outline-variant: '#43474d'
  surface-tint: '#aec9eb'
  primary: '#aec9eb'
  on-primary: '#15324e'
  primary-container: '#00213c'
  on-primary-container: '#6f89a9'
  inverse-primary: '#46607e'
  secondary: '#88cffc'
  on-secondary: '#00344b'
  secondary-container: '#00658d'
  on-secondary-container: '#b0deff'
  tertiary: '#82cfff'
  on-tertiary: '#00344b'
  tertiary-container: '#002233'
  on-tertiary-container: '#0090c7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
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
  background: '#121411'
  on-background: '#e3e3de'
  surface-variant: '#343532'
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

Setuu Enterprise is engineered for the high-stakes, multi-tenant environment of B2B industrial project management. Moving beyond a strictly utilitarian interface, the system embraces a **Corporate / Modern SaaS** aesthetic that balances clinical precision with fluid, adaptive ergonomics. The visual narrative is defined by "Industrial Reliability"—an interface that feels as sturdy, predictable, and dependable as the infrastructure projects it governs.

### Dual-Theme Ergonomics (Dark Mode Default)
To support field workers and Project Managers in diverse environments, the system features a high-performance profile:
*   **Dark Mode (The CAD Blueprint - Default):** A Deep Slate base layered with elevated Navy surfaces. Primary actions utilize a neon Precision Cyan (`#41BEFD`), mimicking glowing terminal readouts and architectural blueprint highlights for maximum focus and reduced fatigue.
*   **Light Mode (The Canvas & Sheet):** A foundational off-white canvas (`#FAF9F4`) populated by elevated, pure white interactive sheets. Deep Praimo Blue (`#00213C`) drives the primary structural actions.

## 2. Color Architecture & Semantic Workflow System

To accommodate the deep relational complexities of the database—including milestones, client approvals, and issue tracking—the design system employs a rigorous 8-tone semantic workflow system mapped directly to status enums. 

*Note: In the default Dark Mode, semantic backgrounds use a 15% opacity fill to glow softly against the slate background, while text remains at 100% opacity for legibility.*

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
*   **Merriweather (Serif) - The Executive Layer:** Used for high-level reports, automated PDF export headers, and overarching dashboard titles. It provides an authoritative, formal legal-record aesthetic.
*   **Inter (Sans-Serif) - The Operational Layer:** The workhorse typography for data-dense tables, comments, and form inputs. Optimized for high legibility on mobile screens in direct sunlight.
*   **JetBrains Mono (Monospaced) - The Technical Layer:** Exclusively used for system-generated metadata, including `latitude`/`longitude` media watermarks, exact `timestamptz` outputs, file hashes, and immutable `audit_log` records.

## 4. Adaptive Grid & Cross-Platform Layouts

To support the robust GoRouter implementation and complex nested data relations, the layout behaves fluidly across four distinct operational environments:

### Mobile (Field Workers & PMs)
*   **Grid:** 4-column fluid layout with 16px margins.
*   **Navigation:** Thumb-zone optimized fixed bottom navigation bar utilizing Glassmorphism.
*   **Interactivity:** Heavy reliance on Floating Action Buttons (FABs) positioned at `bottom-right` for immediate media capture.

### Tablet (On-Site Management)
*   **Grid:** 8-column layout with 24px margins.
*   **Navigation:** Collapsible 72px Navigation Rail to maximize horizontal viewport space.
*   **Interactivity:** Split-pane views for "Master-Detail" relational workflows.

### Desktop / Web (Admin & Client Dashboards)
*   **Grid:** 12-column grid with a persistent 280px sidebar (Deep Blue in Light Mode, Ultra-Dark Navy in Dark Mode). Content is centered with a maximum width constraint of 1600px.
*   **Interactivity:** Wide, horizontally scrollable data-dense tables for project materials and audit log reviews.

## 5. Elevation, Depth & Glassmorphism

Elevation transitions from absolute flatness to a modern, layered Z-index system to manage visual clutter without losing engineering precision.

*   **Level 0 (Canvas):** The base non-interactive layer (`#1B1C19` in Dark, `#FAF9F4` in Light).
*   **Level 1 (Card/Sheet):** Elevated surfaces with an 8px radius. Dark mode uses a subtle border to separate elements. Rest states have no shadow; interactive elements gain a diffused shadow on hover.
*   **Level 2 (Glassmorphism):** Utilized for sticky contextual toolbars, bottom navigation, and the Drawing Hub markup rail. 
    *   *Dark Mode:* `rgba(18, 26, 33, 0.85)` with a faint cyan inner border (`rgba(65, 190, 253, 0.2)`).
    *   *Light Mode:* `rgba(255, 255, 255, 0.85)` with a white inner border.
*   **Level 3 (Overlay/Modals):** High-elevation components utilize heavy, diffused drop-shadows. Modals are paired with a 40% opacity black backdrop.

## 6. Role-Based Interface Mapping (RBAC UI)

The design language explicitly morphs to accommodate the Row-Level Security (RLS) constraints and distinct workflows of the six `user_actor` roles.

### 6.1 Super Admin Control Center
*   **Aesthetic:** Highly clinical, metric-driven, and devoid of confidential project-level data. 
*   **Break-Glass UI:** The emergency access interface utilizes a persistent Crimson Red border and pulsates slowly. The audit log is rendered in a dense JetBrains Mono terminal-style grid.

### 6.2 Admin & PM Workspace
*   **Aesthetic:** Comprehensive, navigational, and authoritative.
*   **Layout:** Heavily utilizes nested tabs and breadcrumb navigation. Features prominent action buttons for project configuration. Financial inputs are highlighted with subtle green accents to denote sensitivity.

### 6.3 Employee Field View
*   **Aesthetic:** High-contrast, hyper-focused, and distraction-free.
*   **Layout:** Stripped of complex analytics. The UI prioritizes massive touch targets (48px minimum height) for gloved interaction.

### 6.4 Vendor Portal (Subcontractors)
*   **Aesthetic:** Ultra-minimalist and highly isolated.
*   **Layout:** A decluttered, single-pane dashboard displaying *only* assigned materials and pending tasks.

### 6.5 Client Dashboard
*   **Aesthetic:** Presentation-grade, secure, and transparent.
*   **Layout:** Focuses on actionable oversight. Features prominent action buttons for "Acknowledged" (Royal Blue) and "Needs Discussion" (Purple).

## 7. Advanced Component Library & Deep Integrations

### 7.1 Drawing & Media Hub
A specialized, fullscreen interface designed for interacting with blueprints and architectural PDFs.
*   **Canvas Area:** Edge-to-edge interactive pan-and-zoom viewport. The background is strictly locked to dark inverse (`#1B1C19`) regardless of theme settings to reduce glare.
*   **Markup Toolbar (Left):** A floating, vertical Glassmorphic rail. Active tools glow with Precision Cyan.

### 7.2 Offline Sync Engine (Optimistic UI)
*   **Optimistic State:** When a user submits an update offline, the newly created card features a pulsating Amber border and a "Queued" icon.
*   **Sync Banner:** A persistent 36px high banner drops down. An Amber background indicates "Offline"; when restored, it transitions to Sky Blue stating "Syncing to Cloud...".

### 7.3 File Upload Dropzones
*   **Upload State:** Displayed as a rounded 8px container with a 2px dashed border. The border turns Precision Cyan during a drag-and-drop hover event.
*   **Verification States:** 
    *   *Clean:* The tile outlines in Emerald Green.
    *   *Infected:* The tile flashes Crimson Red with a heavy blur overlay.
    *   *Duplicate Detected:* An Amber warning dialog prompts the user with side-by-side comparisons.

### 7.4 Support Ticketing System
*   **Layout:** Features severity priority badges (e.g., Crimson for High, Slate for Low), threaded resolution notes, and a highly visible `updated_at` tracker in JetBrains Mono.