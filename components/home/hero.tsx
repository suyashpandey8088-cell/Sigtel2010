"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { Magnetic } from "@/components/ui/magnetic";

const headline = ["ENGINEERING", "THE SYSTEMS THAT", "KEEP INDIA", "MOVING."];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(contentRef.current, {
        y: -70,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 22;
      const y = (event.clientY / window.innerHeight - 0.5) * 14;
      if (imageRef.current) {
        imageRef.current.style.setProperty("--px", `${x}px`);
        imageRef.current.style.setProperty("--py", `${y}px`);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={root} className="relative min-h-[100svh] w-full overflow-hidden bg-navy" aria-label="Introduction">
      <div
        ref={imageRef}
        className="absolute inset-[-6%] will-change-transform"
        style={{ translate: "var(--px, 0) var(--py, 0)" }}
      >
        <Image
          src="/images/hero-railway.jpg"
          alt="Railway tracks, signals and overhead electrification at dusk in India"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.78]"
        />
      </div>
      <div className="absolute inset-0 hero-scrim" aria-hidden />
      <div className="absolute inset-0 grid-blueprint opacity-30" aria-hidden />
      <div className="absolute inset-0 scanlines opacity-[0.18]" aria-hidden />

      {/* frame */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 top-[calc(var(--header-h)+1rem)] border border-ink/[0.08] sm:inset-x-6" aria-hidden />

      <div className="edge relative flex min-h-[100svh] flex-col justify-between pb-8 pt-[calc(var(--header-h)+3rem)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-eng opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-eng" />
            </span>
            <span className="label-tight text-ink/70">Systems live · Signalling &amp; telecom</span>
          </div>
          <span className="label-tight hidden text-ink/50 md:block">
            19.0206° N / 73.0387° E — Navi Mumbai
          </span>
        </motion.div>

        <div ref={contentRef} className="relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="label mb-6 flex items-center gap-3 text-eng"
              >
                <span className="h-px w-10 bg-eng/60" />
                Railway signalling · Telecommunications · Est. 2010
              </motion.p>

              <h1 className="font-display text-display-xl uppercase text-ink">
                {headline.map((line, index) => (
                  <span key={line} className="mask-line">
                    <motion.span
                      className="block"
                      initial={{ y: "115%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 1.15, delay: 0.62 + index * 0.11, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {index === 2 ? (
                        <>
                          KEEP <span className="text-eng">INDIA</span>
                        </>
                      ) : (
                        line
                      )}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.9 }}
                className="mt-7 max-w-xl text-[0.98rem] leading-relaxed text-muted"
              >
                Integrated railway signalling and telecommunications solutions engineered for dependable
                infrastructure, operational efficiency and a connected railway future.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.32, duration: 0.9 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <Magnetic>
                  <Link href="/infrastructure" className="btn btn-solid" data-cursor-label="Explore">
                    <span>Explore our capabilities</span>
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
                      <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
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

            {/* signal stack */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 1 }}
              className="mb-2 hidden w-[168px] shrink-0 lg:block"
              aria-hidden
            >
              <div className="corner-ticks border border-ink/10 bg-navy-900/60 p-4 backdrop-blur-sm">
                <p className="label-tight mb-3 text-[8px] text-tech">Signal S-23 · 4 aspect</p>
                <div className="mx-auto flex w-[52px] flex-col gap-2 rounded-sm border border-ink/10 bg-black/60 p-2">
                  <span className="mx-auto h-[18px] w-[18px] rounded-full bg-signal shadow-[0_0_22px_rgba(239,68,68,0.85)]" />
                  <span className="mx-auto h-[18px] w-[18px] rounded-full bg-ink/[0.07]" />
                  <span className="mx-auto h-[18px] w-[18px] rounded-full bg-eng/90 shadow-[0_0_18px_rgba(36,199,139,0.55)]" />
                  <span className="mx-auto h-[12px] w-[12px] rounded-full bg-ink/[0.05]" />
                </div>
                <div className="mt-3 space-y-1 font-mono text-[8px] uppercase tracking-[0.16em] text-tech">
                  <p className="flex justify-between">
                    <span>Route</span> <span className="text-eng">Set</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Track cct</span> <span className="text-eng">Clear</span>
                  </p>
                  <p className="flex justify-between">
                    <span>LC gate</span> <span className="text-signal">Closed</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-ink/10 pt-5"
        >
          <div className="flex items-center gap-3 text-tech">
            <span className="relative flex h-9 w-5 items-start justify-center overflow-hidden rounded-full border border-ink/20">
              <motion.span
                className="mt-1 h-1.5 w-1.5 rounded-full bg-eng"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            <span className="label-tight text-[9px] text-ink/50">Scroll to enter the system</span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/40">
            <span>EI · LC gates · Axle counters</span>
            <span className="hidden sm:inline">IP-MPLS · SDH · OFC · CCTV</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
