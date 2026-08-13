---
name: Setuu Mobile Industrial
colors:
  surface: '#131411'
  surface-dim: '#131411'
  surface-bright: '#393936'
  surface-container-lowest: '#0d0f0c'
  surface-container-low: '#1b1c19'
  surface-container: '#1f201d'
  surface-container-high: '#292a27'
  surface-container-highest: '#343532'
  on-surface: '#e4e2dd'
  on-surface-variant: '#c3c6ce'
  inverse-surface: '#e4e2dd'
  inverse-on-surface: '#30312d'
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
  tertiary: '#adcae1'
  on-tertiary: '#153345'
  tertiary-container: '#002233'
  on-tertiary-container: '#6e8a9f'
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
  tertiary-fixed: '#c8e6fd'
  tertiary-fixed-dim: '#adcae1'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#2d4a5c'
  background: '#131411'
  on-background: '#e4e2dd'
  surface-variant: '#343532'
typography:
  headline-lg:
    fontFamily: Merriweather
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Merriweather
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.02em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  grid-columns: '4'
  margin: 16px
  gutter: 12px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
---

## 1. Brand & Psychological Design Philosophy
The mobile experience is built for "Industrial Reliability" translated to an on-the-go professional engineer. The aesthetic balances corporate precision with functional mobile ergonomics, ensuring clarity in high-pressure or mobile environments. 

### Dual-Theme Mobile Adaptivity
* **Dark Mode (The IDE Blueprint):** Now the primary system state. Deep Slate base (`#1B1C19`) with elevated containers. Primary brand anchoring uses Deep Praimo Blue (`#00213C`). High-priority interactions use Precision Cyan/Blue (`#00658D`) to mimic terminal and IDE environments.
* **Light Mode (The Canvas & Sheet):** Used for document-heavy viewing. Off-white mobile backgrounds with pure white elevated cards.

## 2. Color Architecture & Semantic Status Workflow
Mappable semantic tokens for mobile issue tracking, task status, and hardware pipelines. Colors are adjusted for high-contrast legibility against the dark background:
* **Neutral/Queue (Slate):** Draft tasks, pending reviews.
* **Active (Technical Blue):** In Progress, CI/CD Pipeline Healthy.
* **Warning (Amber):** On Hold, Offline Cached State.
* **Success (Emerald):** Task Verified, Build Passing.
* **Emergency (Crimson):** Critical Blocker, Build Failed, P0 Bug.

## 3. Typography & Information Density
* **Merriweather (Serif):** Restricted to screen headers and module titles for editorial clarity and authoritative presence.
* **Inter (Sans-Serif):** The workhorse for list rows, form inputs, and UI control elements.
* **JetBrains Mono (Monospaced):** System truth metadata—Git commit hashes, IP addresses, datestamps, and hardware Spec IDs.

## 4. Mobile Layout & Spacing
* **Grid:** 4-column fluid layout with strict 16px side margins and 12px gutters.
* **Touch Target Ergonomics:** All primary interactive buttons, inputs, and list checkboxes must adhere to a **minimum height of 48px** to support active engineering use with gloved hands or in rapid-movement scenarios.
* **Navigation:** Glassmorphic Bottom Navigation Bar (`backdrop-filter: blur(12px)`) restricted to functional employee destinations (Workbench, Tasks, Hub, Issues, Me). *Note: Zero Admin tabs are permitted due to strict RLS.*

## 5. Elevation & Depth
* **Level 0 (Canvas):** Background base (`#1B1C19`).
* **Level 1 (Card/Surface):** Elevated surfaces featuring a 0.5rem radius (`rounded-DEFAULT`) with crisp 1px borders and minimal shadows.
* **Level 2 (Glassmorphic Bottom Nav & Top Bar):** Translucent layers (`rgba(27,28,25,0.85)`) with a 12px blur filter to maintain background context.
* **Level 3 (Modals & Drawers):** Elevated sheets paired with a 40% black backdrop overlay (`z-index: 100`) for slide-outs and bottom sheets.

## 6. Security & Role Constraints (Employee RLS)
* **Absolute Financial Blindness:** Zero visibility into hourly billing rates, budget burn-downs, or project contract values.
* **Departmental Isolation:** Views are strictly limited to assigned tasks, code repositories, and CAD/Gerber assets tied to the engineer's domain (Software, Electrical, Mechanical).