import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#07111F",
          900: "#050C16",
          800: "#0C1929",
          700: "#122337",
          600: "#182C42",
        },
        ink: "#F4F5F3",
        muted: "#A8B4C2",
        signal: "#EF4444",
        eng: "#24C78B",
        tech: "#778596",
        line: "rgba(168,180,194,0.16)",
        "line-strong": "rgba(168,180,194,0.32)",
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
