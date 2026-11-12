import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // All palette colours resolve through CSS variables (see globals.css),
        // so the whole site can be repainted for the light theme without
        // touching a single component. Values below are the dark defaults,
        // kept as a fallback for tooling that reads this file directly.
        // Colours that take an opacity modifier (`text-ink/70`, `bg-ink/[0.06]`)
        // are declared as rgb triples so Tailwind can emit a real alpha value.
        // Without `<alpha-value>` it silently drops every such class.
        navy: {
          DEFAULT: "rgb(var(--navy-rgb) / <alpha-value>)",
          900: "rgb(var(--navy-900-rgb) / <alpha-value>)",
          800: "rgb(var(--navy-800-rgb) / <alpha-value>)",
          700: "rgb(var(--navy-700-rgb) / <alpha-value>)",
          600: "rgb(var(--navy-600-rgb) / <alpha-value>)",
        },
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        tech: "rgb(var(--tech-rgb) / <alpha-value>)",
        signal: "var(--signal)",
        eng: "var(--eng)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        "paper-2": "rgb(var(--paper-2-rgb) / <alpha-value>)",
        night: "rgb(var(--night-rgb) / <alpha-value>)",
        "night-2": "rgb(var(--night-2-rgb) / <alpha-value>)",
        "on-eng": "var(--on-eng)",
      },
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        label: "0.22em",
        wide2: "0.32em",
      },
      fontSize: {
        "display-xl": ["clamp(2.15rem, min(8.8vw, 11vh), 10rem)", { lineHeight: "0.9", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(2.6rem, 6.2vw, 6.6rem)", { lineHeight: "0.94", letterSpacing: "-0.04em" }],
        "display-md": ["clamp(2.1rem, 4.4vw, 4rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
      },
      maxWidth: {
        edge: "1680px",
      },
      transitionTimingFunction: {
        engineering: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        blink: {
          "0%, 45%": { opacity: "1" },
          "55%, 100%": { opacity: "0.25" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        blink: "blink 2.4s steps(1, end) infinite",
        scan: "scan 6s linear infinite",
        floaty: "floaty 7s ease-in-out infinite",
        marquee: "marquee 42s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
