import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          variant: "var(--surface-variant)",
          tint: "var(--surface-tint)",
          container: {
            lowest: "var(--surface-container-lowest)",
            low: "var(--surface-container-low)",
            DEFAULT: "var(--surface-container)",
            high: "var(--surface-container-high)",
            highest: "var(--surface-container-highest)",
          }
        },
        on: {
          surface: {
            DEFAULT: "var(--on-surface)",
            variant: "var(--on-surface-variant)",
          },
          background: "var(--on-background)",
          primary: {
            DEFAULT: "var(--on-primary)",
            container: "var(--on-primary-container)",
          },
          secondary: {
            DEFAULT: "var(--on-secondary)",
            container: "var(--on-secondary-container)",
          },
          tertiary: "var(--on-tertiary)",
          error: {
            DEFAULT: "var(--on-error)",
            container: "var(--on-error-container)",
          }
        },
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          container: "var(--primary-container)",
          inverse: "var(--inverse-primary)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          container: "var(--secondary-container)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          container: "var(--tertiary-container)",
        },
        error: {
          DEFAULT: "var(--error)",
          container: "var(--error-container)",
        },
        background: "var(--background)",
        semantic: {
          slate: {
            DEFAULT: "var(--semantic-slate)",
            bg: "var(--semantic-slate-bg)",
            on: "var(--semantic-slate-on)",
          },
          sky: {
            DEFAULT: "var(--semantic-sky)",
            bg: "var(--semantic-sky-bg)",
            on: "var(--semantic-sky-on)",
          },
          amber: {
            DEFAULT: "var(--semantic-amber)",
            bg: "var(--semantic-amber-bg)",
            on: "var(--semantic-amber-on)",
          },
          emerald: {
            DEFAULT: "var(--semantic-emerald)",
            bg: "var(--semantic-emerald-bg)",
            on: "var(--semantic-emerald-on)",
          },
          teal: {
            DEFAULT: "var(--semantic-teal)",
            bg: "var(--semantic-teal-bg)",
            on: "var(--semantic-teal-on)",
          },
          royal: {
            DEFAULT: "var(--semantic-royal)",
            bg: "var(--semantic-royal-bg)",
            on: "var(--semantic-royal-on)",
          },
          purple: {
            DEFAULT: "var(--semantic-purple)",
            bg: "var(--semantic-purple-bg)",
            on: "var(--semantic-purple-on)",
          },
          crimson: {
            DEFAULT: "var(--semantic-crimson)",
            bg: "var(--semantic-crimson-bg)",
            on: "var(--semantic-crimson-on)",
          }
        }
      },
      fontFamily: {
        merriweather: ["var(--font-merriweather)"],
        inter: ["var(--font-inter)"],
        "jetbrains-mono": ["var(--font-jetbrains-mono)"],
      },
      boxShadow: {
        'elevation-l0': 'var(--elevation-l0)',
        'elevation-l1': 'var(--elevation-l1)',
        'elevation-l2': 'var(--elevation-l2)',
        'elevation-l3': 'var(--elevation-l3)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      },
      spacing: {
        'sidebar': 'var(--space-sidebar)',
        'rail': 'var(--space-rail)',
        'margin-desktop': 'var(--space-margin-desktop)',
        'margin-tablet': 'var(--space-margin-tablet)',
        'margin-mobile': 'var(--space-margin-mobile)',
      },
      maxWidth: {
        'content': 'var(--max-content-width)',
      },
      keyframes: {
        'pulse-crimson': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(220, 38, 38, 0)' },
        },
        'scan-radar': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'sync-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'pulse-crimson': 'pulse-crimson 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-radar': 'scan-radar 2s linear infinite',
        'sync-spin': 'sync-spin 1s linear infinite',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
      }
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.glass': {
          'backdrop-filter': 'blur(var(--glassmorphism-blur))',
          '-webkit-backdrop-filter': 'blur(var(--glassmorphism-blur))',
          'background-color': 'var(--glassmorphism-bg)',
          'border': '1px solid var(--glassmorphism-border)',
        },
      })
    }
  ],
};
export default config;
