"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { company } from "@/lib/content/site";
import { Reveal } from "@/components/ui/reveal";

const lines = ["BEHIND EVERY", "SAFE JOURNEY", "IS A SYSTEM", "THAT WORKS."];

export function IdentitySection() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-identity-line]").forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0.12, x: -14 },
          {
            opacity: 1,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 88%",
              end: "top 55%",
              scrub: true,
            },
          },
        );
      });
      gsap.fromTo(
        "[data-identity-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden border-t border-line bg-navy py-24 md:py-32" id="identity">
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-30" aria-hidden />
      <div className="edge relative">
        <div className="flex items-center justify-between gap-6 pb-10">
          <span className="label flex items-center gap-3 text-tech">
            <span className="text-eng">03</span>
            <span className="h-px w-8 bg-line-strong" />
            The SIG-TEL identity
          </span>
          <span className="label-tight hidden text-tech sm:block">System integrity / no compromise</span>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,6.6vw,6.6rem)] uppercase leading-[0.92] tracking-[-0.04em] text-ink">
              {lines.map((line) => (
                <span key={line} className="block will-change-transform" data-identity-line>
                  {line === "IS A SYSTEM" ? (
                    <>
                      IS A <span className="text-eng">SYSTEM</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h2>

            <div className="mt-10 h-px w-full origin-left bg-line-strong" data-identity-rule />

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Reveal>
                <p className="text-[0.98rem] leading-relaxed text-muted">
                  {company.positioningLong}
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-[0.98rem] leading-relaxed text-muted">
                  Our crews work at working stations, inside relay rooms and along pipeline routes — where the
                  system cannot be taken out of service to make the change. Engineering discipline is not a
                  presentation layer for us; it is the deliverable that a controller signs against.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="corner-ticks border border-line bg-navy-800/70 p-6">
              <p className="label mb-6 text-tech">At a glance</p>
              <dl className="space-y-5">
                {[
                  ["Incorporated", "2010"],
                  ["Base", "Navi Mumbai, Maharashtra"],
                  ["Disciplines", "Signalling · Telecom"],
                  ["Works in register", "20"],
                  ["States covered", "5"],
                ].map(([term, value]) => (
                  <div key={term} className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
                    <dt className="label-tight text-tech">{term}</dt>
                    <dd className="text-right font-mono text-[12px] text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border border-line bg-navy-800/40 p-6">
              <p className="label mb-3 flex items-center gap-2 text-eng">
                <span className="h-2 w-2 rounded-full bg-eng shadow-[0_0_10px_rgba(36,199,139,0.8)]" />
                Philosophy
              </p>
              <p className="font-display text-lg leading-snug text-ink">
                “Small enough to answer the phone, built to answer for the system.”
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                One accountable team from site survey to years of maintenance — for the signal, the gate, the
                fibre and the network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
