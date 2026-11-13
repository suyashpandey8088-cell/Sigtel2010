"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A thin engineering reticle instead of a native cursor: a hairline ring that
 * trails the pointer and a small white plate for contextual labels.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.dataset.cursor = "on";

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      const el = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor-label], a, button, input, textarea, select, [role='button']",
      );
      if (!el) {
        setLabel("");
        setActive(false);
        return;
      }
      setLabel(el.getAttribute("data-cursor-label") || "");
      setActive(true);
    };

    const animate = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      delete document.body.dataset.cursor;
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] hidden md:block">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-[4px] w-[4px] rounded-full bg-signal"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-eng/40 transition-[width,height,background-color,border-color] duration-300 ease-engineering"
        style={{
          width: label ? 78 : active ? 48 : 26,
          height: label ? 78 : active ? 48 : 26,
          backgroundColor: label ? "rgba(255,255,255,0.95)" : "transparent",
          borderColor: label ? "rgba(255,255,255,0.9)" : "rgba(24,59,86,0.35)",
        }}
      >
        {label ? (
          <span className="label-tight px-2 text-center text-[7.5px] leading-tight text-eng">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
