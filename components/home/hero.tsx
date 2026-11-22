"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { Magnetic } from "@/components/ui/magnetic";
import { company } from "@/lib/content/site";

/**
 * The opening spread.
 *
 * Composition, not decoration: the headline is set in the display serif at
 * headline scale across the top of the page, the photograph takes the lower
 * two-thirds as a full-bleed plate that grows to the edges as you scroll, and
 * the only annotation is a single caption line in the margin — the technical
 * drawing furniture that used to sit here (blueprint grid, numbered crosshairs,
 * scale notes) is gone. The photograph itself is the technical evidence.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
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
          scrub: 0.7,
        },
      });

      // the frame opens out to the page edges while the camera eases in
      tl.to(plateRef.current, { paddingInline: 0, ease: "none" }, 0);
      tl.to(imageRef.current, { scale: 1.16, ease: "none" }, 0);
      tl.to(headRef.current, { yPercent: -14, opacity: 0, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      aria-label="Introduction"
      className="relative bg-navy"
      style={{ height: "150svh" }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="edge flex h-full flex-col pt-[calc(var(--header-h)+2.4rem)]">
          {/* headline */}
          <div ref={headRef} className="min-h-0 will-change-transform">
            <h1 className="max-w-[19ch] text-[clamp(2.35rem,min(6.6vw,9vh),6.6rem)] leading-[0.98] tracking-[-0.022em] text-eng">
              {["Engineering the", "networks that keep"].map((line, index) => (
                <span key={line} className="mask-line">
                  <motion.span
                    className="block"
                    initial={{ y: "108%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 1.3,
                      delay: 0.1 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
              <span className="mask-line">
                <motion.span
                  className="block"
                  initial={{ y: "108%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  railways{" "}
                  <em className="not-italic text-signal">moving.</em>
                </motion.span>
              </span>
            </h1>
          </div>

          {/* deck + actions, on the asymmetric grid */}
          <div className="grid-edit mt-7 items-start gap-y-5 md:mt-9">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 1 }}
              className="lg:col-span-7 lg:col-start-6 max-w-[34ch] text-[1.02rem] leading-[1.6] text-muted"
            >
              Specialists in railway signalling, telecommunications and
              infrastructure engineering — from the duct in the ground to the
              system a controller signs for.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.74, duration: 1 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-3 lg:col-start-1 lg:row-start-1"
            >
              <Magnetic>
                <Link href="/infrastructure" className="btn btn-solid" data-cursor-label="Capabilities">
                  <span>What we engineer</span>
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden>
                    <path d="M0 4.5h12M8.5 1L12 4.5 8.5 8" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </Link>
              </Magnetic>
              <Link
                href="/contact"
                className="link-underline text-[0.9rem] text-eng"
                data-cursor-label="Enquire"
              >
                Discuss a project
              </Link>
            </motion.div>
          </div>

          {/* the plate — inset here, flush to the page edges by the end of the scroll */}
          <div className="mt-8 flex min-h-0 flex-1 flex-col md:mt-10">
            <div
              ref={plateRef}
              className="relative min-h-0 flex-1"
              style={{ paddingInline: "clamp(0rem, 3vw, 3.5rem)" }}
            >
              <motion.div
                ref={imageRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 overflow-hidden bg-navy-800 will-change-transform"
              >
                <Image
                  src="/images/hero-daylight.jpg"
                  alt="Electrified double line in clear daylight: overhead equipment masts, catenary and a colour-light signal"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-[center_56%]"
                />
              </motion.div>
            </div>

            {/* one caption, in the margin under the plate */}
            <div className="mt-3 flex items-end justify-between gap-6">
              <p className="text-[0.78rem] leading-tight text-muted">
                Double line, overhead equipment, four-aspect signal.
              </p>
              <p className="hidden text-[0.78rem] leading-tight text-tech sm:block">
                {company.disciplines} · Navi Mumbai, since {company.founded}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
