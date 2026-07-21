import type { Config } from "tailwindcss";

const cssColor = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  safelist: [
    // Color swatch dots — built dynamically at runtime in ProductCard
    "bg-[#f5e9d4]", "bg-[#7d2b2b]", "bg-[#c0392b]", "bg-[#1a1410]",
    "bg-[#1e3a8a]", "bg-[#2563eb]", "bg-[#2dd4bf]", "bg-[#15803d]",
    "bg-[#eab308]", "bg-[#ea580c]", "bg-[#ec4899]", "bg-[#e8dab7]",
    "bg-[#92400e]", "bg-[#9ca3af]",
  ],
  theme: {
    container: { center: true, padding: "1.25rem" },
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // ── Backgrounds ──────────────────────────────────────────────────
        cream: {
          50: cssColor("--color-surface-50"),
          100: cssColor("--color-surface-100"),
          200: cssColor("--color-surface-200"),
          300: cssColor("--color-surface-300"),
          400: cssColor("--color-surface-400"),
        },

        // ── Brand primary (indigo) ────────────────────────────────────────
        primary: {
          50: cssColor("--color-primary-50"),
          100: cssColor("--color-primary-100"),
          200: cssColor("--color-primary-200"),
          300: cssColor("--color-primary-300"),
          400: cssColor("--color-primary-400"),
          500: cssColor("--color-primary-500"),
          600: cssColor("--color-primary-600"),
          700: cssColor("--color-primary-700"),
          800: cssColor("--color-primary-800"),
          900: cssColor("--color-primary-900"),
          950: cssColor("--color-primary-950"),
        },

        // ── Brand secondary (teal) ────────────────────────────────────────
        secondary: {
          DEFAULT: cssColor("--color-accent-600"),
          light: cssColor("--color-accent-400"),
          dark: cssColor("--color-accent-700"),
        },

        // ── Text ─────────────────────────────────────────────────────────
        ink: {
          DEFAULT: cssColor("--color-ink"),
          soft: cssColor("--color-ink-soft"),
          muted: cssColor("--color-ink-muted"),
        },
      },

      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
      },

      boxShadow: {
        soft: "0 4px 24px -8px rgb(var(--color-primary-800) / 0.14)",
        warm: "0 12px 40px -12px rgb(var(--color-accent-600) / 0.22)",
        crisp: "0 1px 0 0 rgb(var(--color-ink) / 0.08)",
      },

      backgroundImage: {
        "weave-light":
          "repeating-linear-gradient(45deg, rgb(var(--color-primary-500) / 0.05) 0px, rgb(var(--color-primary-500) / 0.05) 1px, transparent 1px, transparent 8px), " +
          "repeating-linear-gradient(-45deg, rgb(var(--color-accent-600) / 0.04) 0px, rgb(var(--color-accent-600) / 0.04) 1px, transparent 1px, transparent 8px)",
        "weave-dark":
          "repeating-linear-gradient(45deg, rgb(var(--color-primary-400) / 0.10) 0px, rgb(var(--color-primary-400) / 0.10) 1px, transparent 1px, transparent 10px), " +
          "repeating-linear-gradient(-45deg, rgb(var(--color-accent-400) / 0.08) 0px, rgb(var(--color-accent-400) / 0.08) 1px, transparent 1px, transparent 10px)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },

      letterSpacing: {
        "wider-x":  "0.18em",
        "widest-x": "0.32em",
      },

      animation: {
        marquee:  "marquee 40s linear infinite",
        shimmer:  "shimmer 2.5s linear infinite",
        "fade-up":"fade-up 0.6s ease-out forwards",
      },

      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
