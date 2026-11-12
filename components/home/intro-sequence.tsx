"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "sigtel:intro-seen";

export function IntroSequence() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aspect, setAspect] = useState<"red" | "amber" | "green">("red");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen || reduced) {
      setVisible(false);
      return;
    }
    setVisible(true);
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();

    // Lenis is created by the parent provider after this effect runs.
    const shouldStop = () => window.__lenis?.stop();
    const stopTimer = window.setTimeout(shouldStop, 120);

    const started = performance.now();
    let frame = 0;
    const total = 2600;
    const tick = (now: number) => {
      const p = Math.min((now - started) / total, 1);
      setProgress(Math.round(p * 100));
      setAspect(p < 0.42 ? "red" : p < 0.72 ? "amber" : "green");
      if (p < 1) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(stopTimer);
      timers.current.forEach(clearTimeout);
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const finish = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.documentElement.style.overflow = "";
    window.__lenis?.start();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[150] flex flex-col bg-navy-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading SIG-TEL"
        >
          <div className="pointer-events-none absolute inset-0 grid-blueprint-sm opacity-70" aria-hidden />
          <div className="pointer-events-none absolute inset-0 scanlines opacity-40" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(36,199,139,0.07),transparent_75%)]" aria-hidden />

          <div className="edge relative flex flex-1 flex-col justify-between py-8">
            <div className="flex items-start justify-between">
              <span className="label-tight text-tech">SIG-TEL / SYSTEM BOOT</span>
              <button
                type="button"
                onClick={finish}
                className="label-tight border-b border-line-strong pb-1 text-muted transition-colors hover:text-ink"
              >
                Skip intro
              </button>
            </div>

            <div className="flex flex-col items-center gap-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <h1 className="font-display text-[clamp(3rem,10vw,7.5rem)] leading-none tracking-[-0.05em] text-ink">
                  SIG<span className="text-eng">-</span>TEL
                </h1>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.42em] text-tech sm:text-[11px]">
                  Signalling &amp; Telecommunications
                </p>
              </motion.div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-end gap-2">
                  {[
                    { key: "red", color: "bg-signal", glow: "shadow-[0_0_26px_rgba(239,68,68,0.75)]" },
                    { key: "amber", color: "bg-amber-400", glow: "shadow-[0_0_26px_rgba(251,191,36,0.7)]" },
                    { key: "green", color: "bg-eng", glow: "shadow-[0_0_26px_rgba(36,199,139,0.8)]" },
                  ].map((lamp) => {
                    const on = aspect === lamp.key;
                    return (
                      <span
                        key={lamp.key}
                        className={`h-4 w-4 rounded-full border border-ink/10 transition-all duration-500 ${
                          on ? `${lamp.color} ${lamp.glow}` : "bg-ink/[0.06]"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                  {aspect === "red" ? "Aspect: stop" : aspect === "amber" ? "Aspect: caution" : "Aspect: clear"}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between pb-3">
                <span className="label-tight text-tech">Initialising experience</span>
                <span className="font-mono text-[11px] tracking-[0.2em] text-ink">{String(progress).padStart(3, "0")}%</span>
              </div>
              <div className="relative h-px w-full bg-line">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-eng"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[9px] uppercase tracking-[0.2em] text-tech">
                <span>Signalling</span>
                <span>Telecommunication</span>
                <span>Est. 2010</span>
                <span className="hidden sm:inline">Navi Mumbai · India</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
