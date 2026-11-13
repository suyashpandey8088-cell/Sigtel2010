"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

const headline = [
  { text: "ENGINEERING THE", className: "" },
  { text: "NETWORKS THAT KEEP", className: "" },
  { text: "RAILWAYS MOVING.", className: "" },
];

/* Camera annotations printed around the photograph — technical labels, not
   marketing. Each is tied to something visible in the frame. */
const annotations = [
  { id: "01", label: "OHE portal · 25 kV", className: "left-4 top-4", align: "left" as const },
  { id: "02", label: "4-aspect colour-light signal", className: "right-4 top-4", align: "right" as const },
  { id: "03", label: "Track formation · ballast shoulder", className: "bottom-16 left-4", align: "left" as const },
  { id: "04", label: "Cable route · duct in cess", className: "bottom-16 right-4", align: "right" as const },
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // the camera pushes in on the infrastructure while the headline steps back
      tl.to(imageRef.current, { scale: 1.24, ease: "none" }, 0);
      tl.to(captionRef.current, { yPercent: -18, opacity: 0.35, ease: "none" }, 0);
      tl.to(contentRef.current, { yPercent: -7, opacity: 0.15, ease: "none" }, 0);
      tl.to(frame.current, { inset: 0, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // a very small pointer parallax on the photograph keeps the hero alive
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 14;
      const y = (event.clientY / window.innerHeight - 0.5) * 10;
      if (imageRef.current) {
        imageRef.current.style.setProperty("--px", `${x}px`);
        imageRef.current.style.setProperty("--py", `${y}px`);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={root}
      className="relative w-full bg-navy"
      aria-label="Introduction"
      style={{ height: "168svh" }}
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden">
        {/* faint engineering grid behind the composition */}
        <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-60" aria-hidden />

        <div className="edge relative flex h-full flex-col pt-[calc(var(--header-h)+1.9rem)]">
          {/* meta rule */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.9 }}
            className="flex items-center justify-between gap-4 border-b border-line pb-3"
          >
            <span className="label-tight flex items-center gap-2.5 text-muted">
              <span className="h-[5px] w-[5px] rounded-full bg-signal" />
              Railway signalling · Telecommunications · Est. 2010
            </span>
            <span className="label-tight hidden text-tech md:block">
              19.0206° N / 73.0387° E — Navi Mumbai
            </span>
          </motion.div>

          {/* headline */}
          <div ref={contentRef} className="pt-[clamp(1.4rem,3.4vh,3rem)] will-change-transform">
            <h1 className="font-display text-[clamp(2.2rem,min(6.6vw,9.2vh),7rem)] uppercase leading-[0.92] tracking-[-0.045em] text-eng">
              {headline.map((line, index) => (
                <span key={line.text} className="mask-line">
                  <motion.span
                    className="block"
                    initial={{ y: "112%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 1.25,
                      delay: 0.15 + index * 0.09,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {index === 2 ? (
                      <>
                        RAILWAYS <span className="text-ink">MOVING.</span>
                      </>
                    ) : (
                      line.text
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5 md:flex-row md:items-center md:justify-between md:gap-10">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.9 }}
                className="max-w-[26rem] text-[0.95rem] leading-relaxed text-muted"
              >
                Specialists in railway signalling, telecommunications and
                infrastructure engineering.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.9 }}
                className="flex flex-wrap items-center gap-3"
              >
                <Magnetic>
                  <Link href="/infrastructure" className="btn btn-solid" data-cursor-label="Enter">
                    <span>Explore capabilities</span>
                    <svg width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden>
                      <path d="M0 4.5h13M9.5 1L13 4.5 9.5 8" stroke="currentColor" strokeWidth="1.1" />
                    </svg>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/contact" className="btn" data-cursor-label="Enquire">
                    <span>Discuss a project</span>
                  </Link>
                </Magnetic>
              </motion.div>
            </div>
          </div>

          {/* photographic frame — the scroll camera pushes into this */}
          <div className="relative mt-[clamp(1.1rem,2.6vh,2.2rem)] min-h-[26svh] flex-1 pb-6">
            <div ref={frame} className="absolute inset-x-0 bottom-6 top-0 overflow-hidden bg-navy-800">
              <motion.div
                ref={imageRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 origin-[50%_58%] will-change-transform"
                style={{ translate: "var(--px, 0) var(--py, 0)" }}
              >
                <Image
                  src="/images/hero-daylight.jpg"
                  alt="Electrified railway tracks, overhead equipment and a colour-light signal in clear daylight"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-[center_58%]"
                />
              </motion.div>

              {/* a paper scrim only at the very bottom, so annotations stay legible */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/45 to-transparent"
                aria-hidden
              />

              <div ref={captionRef} className="absolute inset-0">
                {annotations.map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      "absolute hidden items-center gap-3 md:flex",
                      note.align === "right" && "flex-row-reverse",
                      note.className,
                    )}
                  >
                    <span className="crosshair shrink-0" aria-hidden />
                    <span className="plate flex items-center gap-2 px-2.5 py-1.5">
                      <span className="font-mono text-[8px] tracking-[0.14em] text-signal">{note.id}</span>
                      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-eng/85">
                        {note.label}
                      </span>
                    </span>
                  </div>
                ))}

                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 px-4 pb-3">
                  <span className="plate px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-eng/80">
                    Fig. 01 — Section: double line, daylight survey
                  </span>
                  <span className="plate hidden px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-eng/80 sm:block">
                    Scale 1:200 · not to scale
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="flex items-center justify-between gap-4 border-t border-line py-3.5"
          >
            <span className="flex items-center gap-3">
              <span className="relative flex h-8 w-[14px] items-start justify-center overflow-hidden rounded-full border border-line-strong">
                <span className="mt-1 h-[3px] w-[3px] animate-scroll-cue rounded-full bg-signal" />
              </span>
              <span className="label-tight text-[9px] text-muted">Scroll to advance the section</span>
            </span>
            <span className="hidden gap-6 font-mono text-[8.5px] uppercase tracking-[0.2em] text-tech sm:flex">
              <span>EI · LC gates · Axle counters</span>
              <span className="hidden md:inline">IP-MPLS · SDH · OFC · CCTV</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
