import type { Config } from "tailwindcss";

/**
 * SIG-TEL — premium light industrial design system.
 *
 * Every colour resolves through a CSS variable declared in app/globals.css, so
 * the palette has exactly one source of truth. The class names are inherited
 * from earlier versions of the site (`navy`, `ink`, `eng`) and now map onto the
 * light industrial palette: paper, engineering blue and signal red.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // surfaces
        navy: {
          DEFAULT: "rgb(var(--navy-rgb) / <alpha-value>)", // #F7F7F4  warm off-white
          900: "rgb(var(--navy-900-rgb) / <alpha-value>)", // #FFFFFF  pure white
          800: "rgb(var(--navy-800-rgb) / <alpha-value>)", // #EEF1F3  blue-grey
          700: "rgb(var(--navy-700-rgb) / <alpha-value>)", // #E6EEF3  soft blue
          600: "rgb(var(--navy-600-rgb) / <alpha-value>)", // #DDE2E5  border
        },
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        "paper-2": "rgb(var(--paper-2-rgb) / <alpha-value>)",
        "paper-3": "rgb(var(--paper-3-rgb) / <alpha-value>)",
        // type
        ink: "rgb(var(--ink-rgb) / <alpha-value>)", // #182B3A
        muted: "rgb(var(--muted-rgb) / <alpha-value>)", // #71808A
        tech: "rgb(var(--tech-rgb) / <alpha-value>)", // technical annotation grey
        // accents
        eng: "var(--eng)", // #183B56 engineering blue
        "eng-deep": "var(--eng-deep)",
        signal: "var(--signal)", // #E44D43 signal red
        clear: "var(--clear)", // #43866B technical green
        "clear-soft": "var(--clear-soft)",
        // rules
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        "on-eng": "var(--on-eng)",
      },
      fontFamily: {
        // Instrument Serif is the display face: it carries the editorial voice
        // and is what stops the page reading as generic product marketing.
        display: ["Instrument Serif", "Georgia", "Times New Roman", "serif"],
        serif: ["Instrument Serif", "Georgia", "Times New Roman", "serif"],
        sans: ["Inter Tight", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        tight: ["Inter Tight", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Inter Tight", "Inter", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.055em",
        label: "0.2em",
        wide2: "0.3em",
      },
      fontSize: {
        "display-hero": [
          "clamp(2.6rem, 7vw, 7.6rem)",
          { lineHeight: "0.98", letterSpacing: "-0.018em" },
        ],
        "display-xl": [
          "clamp(2.3rem, min(6.4vw, 10.5vh), 6.6rem)",
          { lineHeight: "0.98", letterSpacing: "-0.016em" },
        ],
        "display-lg": [
          "clamp(2.3rem, 5.4vw, 5.2rem)",
          { lineHeight: "1", letterSpacing: "-0.014em" },
        ],
        "display-md": [
          "clamp(1.7rem, 3.4vw, 3.1rem)",
          { lineHeight: "1.04", letterSpacing: "-0.012em" },
        ],
      },
      maxWidth: {
        edge: "1640px",
        measure: "62ch",
      },
      transitionTimingFunction: {
        engineering: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        blink: {
          "0%, 45%": { opacity: "1" },
          "55%, 100%": { opacity: "0.2" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
        flow: {
          to: { strokeDashoffset: "-240" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "35%": { opacity: "1" },
          "100%": { transform: "translateY(14px)", opacity: "0" },
        },
      },
      animation: {
        blink: "blink 2.6s steps(1, end) infinite",
        floaty: "floaty 8s ease-in-out infinite",
        marquee: "marquee 52s linear infinite",
        flow: "flow 7s linear infinite",
        "scroll-cue": "scroll-cue 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
