---
name: Setuu
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
  on-surface-variant: '#42474f'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#72777f'
  outline-variant: '#c2c7d0'
  surface-tint: '#38618a'
  primary: '#00375e'
  on-primary: '#ffffff'
  primary-container: '#234e76'
  on-primary-container: '#97bfee'
  inverse-primary: '#a2caf9'
  secondary: '#4a607d'
  on-secondary: '#ffffff'
  secondary-container: '#c5dcfe'
  on-secondary-container: '#4a607e'
  tertiary: '#003952'
  on-tertiary: '#ffffff'
  tertiary-container: '#22506a'
  on-tertiary-container: '#96c1e0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e4ff'
  primary-fixed-dim: '#a2caf9'
  on-primary-fixed: '#001d35'
  on-primary-fixed-variant: '#1d4971'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#b1c8ea'
  on-secondary-fixed: '#021c36'
  on-secondary-fixed-variant: '#324864'
  tertiary-fixed: '#c7e7ff'
  tertiary-fixed-dim: '#a0cceb'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#1c4b65'
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
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-tablet: 24px
  margin-desktop: 32px
  sidebar-width: 280px
  rail-width: 72px
---

## Brand & Style

This design system is engineered for high-stakes B2B environments where clarity, auditability, and technical precision are paramount. It rejects the "gamified" trends of consumer software in favor of an **Industrial & Clinical** aesthetic that mimics physical engineering documentation.

The visual narrative is built on the concept of "Paper as Interface." By utilizing an off-white canvas and high-contrast technical blues, the UI evokes the reliability of a printed blueprint or a professional specification sheet. It prioritizes information density and speed of capture, ensuring that field engineers and project managers can interact with the system with gloves, in low-light conditions, or under intense site pressure without visual distraction.

The emotional response should be one of **trust, authority, and meticulousness.** Every element—from the slim 4px progress bars to the sharp-edged cards—is designed to signal that the data contained within is precise and enterprise-ready.

## Colors

The palette is anchored by **Deep Praimo Blue**, providing a foundation of corporate stability. The background uses a specific off-white (#F7F6F1) to reduce screen glare in field environments while maintaining a "physical paper" feel.

- **Primary & Secondary:** Reserved for high-level navigation, primary actions, and structural headers.
- **Precision Cyan:** Used sparingly as an interactive accent to draw attention to technical details or active selections.
- **Semantic Logic:** Status colors are grounded in industrial standards. "Live" uses the brand blue to avoid visual noise, while "Complete," "Hold," and "Critical" use saturated, high-visibility tones for immediate recognition in high-density feeds.
- **Surfaces:** Pure White (#FFFFFF) is used only for foreground containers (cards, inputs) to create a clear "layering" effect against the off-white canvas.

## Typography

This system employs a dual-font strategy to balance brand authority with data utility:

1. **Serif (Merriweather):** Used for headlines and section titles. It provides a "Documentary" feel, suggesting that the headings are part of an official record.
2. **Sans-Serif (Inter):** Used for all functional body text and user inputs. It is chosen for its exceptional legibility and neutral tone.
3. **Monospaced (JetBrains Mono):** Used for technical metadata, including GPS coordinates, timestamps, and system identifiers. This reinforces the engineering aesthetic and ensures alignment in data-heavy columns.

**Scaling:** On mobile devices, headlines downscale aggressively to maximize screen real estate for data entry.

## Layout & Spacing

The layout is governed by a **4px base unit**, emphasizing tight, efficient spatial relationships.

### Grid & Responsiveness

- **Desktop:** A fixed 12-column sidebar-based layout. The sidebar persists to provide quick access to project modules.
- **Tablet:** Collapses the sidebar into a high-density "Navigation Rail," maximizing the central canvas for engineering drawings or metrics grids.
- **Mobile:** Shifts to a bottom-navigation model for easy thumb reach during field inspections.

### Spacing Rhythm

Content blocks are separated by 16px or 24px increments. Internal card padding is kept at a strict 16px to maintain high information density. Progress bars must always be exactly 4px in height, appearing as a precise "line" rather than a bulky container.

## Elevation & Depth

In keeping with the "anti-gamification" and "engineering paper" philosophy, this system **rejects soft, ambient shadows.**

- **Tonal Layers:** Depth is communicated primarily through color contrast. White cards sit on the off-white background, creating a natural separation without the need for drop shadows.
- **Precision Outlines:** Every container uses a 1px border (#E0E0E0). This mimics the lines of a blueprint and provides a tactile boundary for UI elements.
- **Low-Contrast Separation:** The `data-wash` (#EAF2F8) is used to indicate nested data or alternating table rows, providing "depth" through color fills rather than Z-axis elevation.

## Shapes

The shape language is **Sharp (0px).**

Curvature is viewed as decorative and is therefore removed to reinforce the clinical, industrial nature of the system. All buttons, cards, input fields, and status pills utilize 90-degree corners. This creates a rigid, grid-aligned visual style that feels professional and technical.

## Components

### Buttons

Primary buttons use the Deep Praimo Blue with white text, sharp corners, and no shadow. Secondary buttons use the Precision Cyan outline with a 1px weight.

### Status Pills

- **Style:** Rectangular, sharp-edged, 24px height.
- **Typography:** Label-md, Sentence case.
- **Colors:** Semantic (Blue, Green, Amber, Red) based on status role.

### Metrics Grid

Multi-card layout where each card represents a core KPI. Cards are pure white with a 1px border. Values should be bold Inter (Sans), while labels use JetBrains Mono (Label-sm).

### Updates Feed

A vertical timeline where each entry is a white card.

- **Watermark:** Media previews must include a technical watermark in the bottom-right corner, displaying GPS and Timestamp in monospaced font.
- **Chronology:** Newest updates appear at the top.

### Role-Based Navigation

- **Desktop Sidebar:** Uses #0D253F (Tech Slate Navy) for high contrast against the canvas.
- **Mobile Bottom Nav:** Uses pure white background with 1px top border and #1F4E79 for active icons.

### Progress Bars

Strictly 4px tall. Background is #E0E0E0, fill is #1F4E79 (or semantic color if tied to a status).
