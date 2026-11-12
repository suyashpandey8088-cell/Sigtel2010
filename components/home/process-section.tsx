"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processStages as stages } from "@/lib/content/site";
import { cn } from "@/lib/utils";

export function ProcessSection() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      const container = section.current;
      if (!el || !container) return;

      const distance = () => el.scrollWidth - window.innerWidth;

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="process" className="relative border-t border-line bg-navy">
      <div ref={section} className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-25" aria-hidden />

        <div className="hidden h-[100svh] flex-col lg:flex">
          <div className="edge relative flex items-end justify-between gap-8 pb-8 pt-[calc(var(--header-h)+2.5rem)]">
            <div>
              <span className="label flex items-center gap-3 text-tech">
                <span className="text-eng">06</span>
                <span className="h-px w-8 bg-line-strong" />
                Our engineering process
              </span>
              <h2 className="mt-5 font-display text-[clamp(2rem,3.6vw,3.4rem)] uppercase leading-none tracking-[-0.03em] text-ink">
                From site survey to a system that&apos;s live
              </h2>
            </div>
            <p className="max-w-xs text-right text-xs leading-relaxed text-tech">
              Six stages. One accountable team.
              <br />
              Scroll to advance through the track.
            </p>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div ref={track} className="flex h-full will-change-transform">
              {stages.map((stage, index) => (
                <article
                  key={stage.step}
                  className="relative flex h-full w-[min(86vw,760px)] shrink-0 flex-col justify-center border-l border-line px-8 py-10 xl:px-14"
                >
                  <span className="pointer-events-none absolute right-6 top-4 select-none font-display text-[clamp(7rem,15vw,13rem)] leading-none tracking-tighter text-ink/[0.035]">
                    {stage.step}
                  </span>
                  <div className="relative max-w-xl">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="flex h-8 items-center border border-line px-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                        Stage {stage.step}
                      </span>
                      <span className="label-tight text-eng">{stage.kicker}</span>
                    </div>
                    <h3 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] uppercase leading-[0.98] tracking-[-0.03em] text-ink">
                      {stage.title}
                    </h3>
                    <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted">{stage.body}</p>
                    <div className="mt-8 border-t border-line pt-4">
                      <p className="label-tight mb-2 text-tech">Deliverables</p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/75">{stage.output}</p>
                    </div>
                  </div>

                  {/* rail motif */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden>
                    <div className="absolute bottom-10 left-0 right-0 h-px bg-line-strong/70" />
                    <div className="absolute bottom-[30px] left-0 right-0 h-px bg-line-strong/40" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "absolute bottom-6 h-6 w-[3px]",
                          i < ((index + 1) / stages.length) * 24 ? "bg-eng/70" : "bg-ink/10",
                        )}
                        style={{ left: `${(i / 24) * 100}%` }}
                      />
                    ))}
                  </div>
                </article>
              ))}
              <div className="flex h-full w-[30vw] shrink-0 items-center border-l border-line px-10">
                <p className="font-display text-2xl uppercase leading-tight text-tech">
                  Delivery &amp; support
                  <br />
                  <span className="text-ink">never the end of the job.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="edge relative pb-8">
            <div className="relative h-px w-full bg-line">
              <span ref={bar} className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-eng" />
            </div>
            <div className="mt-3 flex justify-between">
              {stages.map((stage) => (
                <span key={stage.step} className="label-tight hidden text-[8px] text-tech md:block">
                  {stage.step}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / reduced-motion: vertical timeline */}
        <div className="lg:hidden">
          <div className="edge py-16">
            <span className="label flex items-center gap-3 text-tech">
              <span className="text-eng">06</span>
              <span className="h-px w-8 bg-line-strong" />
              Our engineering process
            </span>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,7vw,2.8rem)] uppercase leading-[1.02] tracking-[-0.03em] text-ink">
              From site survey to a system that&apos;s live
            </h2>

            <ol className="mt-10 relative border-l border-line pl-6">
              {stages.map((stage) => (
                <li key={stage.step} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[30px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-eng shadow-[0_0_10px_rgba(36,199,139,0.6)]" />
                  <div className="flex items-center gap-3">
                    <span className="label-tight text-eng">Stage {stage.step}</span>
                    <span className="label-tight text-tech">{stage.kicker}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl uppercase tracking-[-0.02em] text-ink">{stage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{stage.body}</p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-tech">{stage.output}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
