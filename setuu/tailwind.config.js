const config = {
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-tertiary-fixed-variant": "#1c4b65",
        "primary-fixed-dim": "#a2caf9",
        "on-tertiary": "#ffffff",
        "error": "#ba1a1a",
        "on-tertiary-container": "#96c1e0",
        "on-error-container": "#93000a",
        "on-primary-fixed": "#001d35",
        "inverse-surface": "#30312e",
        "on-primary": "#ffffff",
        "surface": "#faf9f4",
        "secondary-fixed-dim": "#b1c8ea",
        "secondary-fixed": "#d2e4ff",
        "outline": "#72777f",
        "primary": "#00375e",
        "surface-container-highest": "#e3e3de",
        "on-secondary": "#ffffff",
        "primary-container": "#234e76",
        "on-secondary-fixed-variant": "#324864",
        "tertiary-fixed-dim": "#a0cceb",
        "on-error": "#ffffff",
        "on-surface": "#1b1c19",
        "tertiary-fixed": "#c7e7ff",
        "background": "#faf9f4",
        "error-container": "#ffdad6",
        "outline-variant": "#c2c7d0",
        "inverse-on-surface": "#f2f1ec",
        "surface-container-high": "#e9e8e3",
        "on-surface-variant": "#42474f",
        "secondary": "#4a607d",
        "on-secondary-container": "#4a607e",
        "surface-tint": "#38618a",
        "on-tertiary-fixed": "#001e2e",
        "surface-container-low": "#f5f4ef",
        "inverse-primary": "#a2caf9",
        "on-primary-fixed-variant": "#1d4971",
        "on-background": "#1b1c19",
        "surface-variant": "#e3e3de",
        "on-primary-container": "#97bfee",
        "surface-bright": "#faf9f4",
        "surface-dim": "#dbdad5",
        "tertiary": "#003952",
        "surface-container": "#efeee9",
        "tertiary-container": "#22506a",
        "primary-fixed": "#d0e4ff",
        "secondary-container": "#c5dcfe",
        "on-secondary-fixed": "#021c36",
        "surface-container-lowest": "#ffffff",
        "status-hold": "#BA7517",
        "status-complete": "#2E7D32",
        "status-critical": "#8B1A1A",
        "status-live": "#1F4E79",
        "border-standard": "#e0e0e0",
        "data-wash": "#EAF2F8",
        "sidebar-bg": "#1F4E79"
      },
      "borderRadius": {
        "DEFAULT": "4px",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "margin-mobile": "16px",
        "unit": "4px",
        "gutter": "16px",
        "margin-desktop": "32px",
        "rail-width": "72px",
        "margin-tablet": "24px",
        "sidebar-width": "280px"
      },
      "fontFamily": {
        "headline-md": ["Merriweather"],
        "display-lg": ["Merriweather"],
        "label-md": ["JetBrains Mono"],
        "headline-lg-mobile": ["Merriweather"],
        "body-md": ["Inter"],
        "headline-sm": ["Merriweather"],
        "label-sm": ["JetBrains Mono"],
        "headline-lg": ["Merriweather"],
        "body-lg": ["Inter"]
      },
      "fontSize": {
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "700" }],
        "display-lg": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "700" }],
        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-sm": ["18px", { "lineHeight": "24px", "fontWeight": "700" }],
        "label-sm": ["10px", { "lineHeight": "14px", "letterSpacing": "0.05em", "fontWeight": "500" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "700" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
      }
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} else if (typeof tailwind !== 'undefined') {
  tailwind.config = config;
}