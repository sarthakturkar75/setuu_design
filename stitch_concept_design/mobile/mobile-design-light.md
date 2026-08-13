---
name: Setuu Mobile Industrial
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ee'
  surface-container: '#efeee8'
  surface-container-high: '#e9e8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#43474d'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f2f1eb'
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
  on-tertiary-container: '#6e8a9f'
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
  tertiary-fixed: '#c8e6fd'
  tertiary-fixed-dim: '#adcae1'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#2d4a5c'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
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
* **Light Mode (The Canvas & Sheet):** Off-white mobile background (`#FAF9F4`) with pure white (`#FFFFFF`) elevated cards bounded by clean 1px `#E0E0E0` borders. Deep Praimo Blue (`#00213C`) anchors primary navigation.
* **Dark Mode (The IDE Blueprint):** Deep Slate base (`#0A0F14`) with elevated Navy surfaces (`#121A21`). Primary indicators invert to neon Precision Cyan (`#41BEFD`) to mimic terminal and IDE environments.

## 2. Color Architecture & Semantic Status Workflow
Mappable semantic tokens for mobile issue tracking, task status, and hardware pipelines:
* **Neutral/Queue (Slate `#64748B`):** Draft tasks, pending reviews.
* **Active (Sky Blue `#0284C7`):** In Progress, CI/CD Pipeline Healthy.
* **Warning (Amber `#D97706`):** On Hold, Offline Cached State.
* **Success (Emerald `#16A34A`):** Task Verified, Build Passing.
* **Emergency (Crimson `#DC2626`):** Critical Blocker, Build Failed, P0 Bug.

## 3. Typography & Information Density
* **Merriweather (Serif):** Restricted to screen headers and module titles for editorial clarity.
* **Inter (Sans-Serif):** The workhorse for list rows, form inputs, and UI control elements.
* **JetBrains Mono (Monospaced):** System truth metadata—Git commit hashes, IP addresses, datestamps, and hardware Spec IDs.

## 4. Mobile Layout & Spacing
* **Grid:** 4-column fluid layout with strict 16px side margins and 12px gutters.
* **Touch Target Ergonomics:** All primary interactive buttons, inputs, and list checkboxes must adhere to a **minimum height of 48px** to support active engineering use with gloved hands or in rapid-movement scenarios.
* **Navigation:** Glassmorphic Bottom Navigation Bar (`backdrop-filter: blur(12px)`) restricted to functional employee destinations (Workbench, Tasks, Hub, Issues, Me). *Note: Zero Admin tabs are permitted due to strict RLS and financial blindness.*

## 5. Elevation & Depth
* **Level 0 (Canvas):** Background base (`#FAF9F4` / `#0A0F14`).
* **Level 1 (Card/Surface):** Pure white or Navy elevated surfaces featuring an 8px radius (`rounded-DEFAULT`) with crisp 1px borders and no heavy drop-shadows.
* **Level 2 (Glassmorphic Bottom Nav & Top Bar):** Translucent layers (`rgba(255,255,255,0.85)` in light; `rgba(18,26,33,0.85)` in dark) with a 12px blur filter.
* **Level 3 (Modals & Drawers):** Elevated sheets paired with a 40% black backdrop overlay (`z-index: 100`) for slide-outs and bottom sheets.

## 6. Security & Role Constraints (Employee RLS)
* **Absolute Financial Blindness:** Zero visibility into hourly billing rates, budget burn-downs, or project contract values.
* **Departmental Isolation:** Views are strictly limited to assigned tasks, code repositories, and CAD/Gerber assets tied to the engineer's domain (Software, Electrical, Mechanical).