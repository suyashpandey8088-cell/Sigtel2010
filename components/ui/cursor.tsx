"use client";

import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [variant, setVariant] = useState<"default" | "link" | "drag">("default");

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
      const el = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor-label], a, button, input, textarea, select");
      if (!el) {
        setLabel("");
        setVariant("default");
        return;
      }
      const custom = el.getAttribute("data-cursor-label");
      const isDrag = el.getAttribute("data-cursor") === "drag";
      setLabel(custom || "");
      setVariant(isDrag ? "drag" : "link");
    };

    const animate = () => {
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
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
        className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full bg-ink mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-ink/50 transition-[width,height,background-color,border-color] duration-300 ease-engineering mix-blend-difference"
        style={{
          width: variant === "default" ? 30 : label ? 82 : 56,
          height: variant === "default" ? 30 : label ? 82 : 56,
          backgroundColor: label ? "rgba(var(--ink-rgb), 0.92)" : "transparent",
          borderColor:
            variant === "default" ? "rgba(var(--ink-rgb), 0.35)" : "rgba(var(--ink-rgb), 0.6)",
        }}
      >
        {label ? (
          <span className="label-tight text-[8px] leading-tight text-night">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
