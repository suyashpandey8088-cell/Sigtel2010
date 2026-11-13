"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processStages as stages } from "@/lib/content/site";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Chapter 04 — engineering solutions, told as a pinned sequence. The section
 * pins, the six stages advance as the visitor scrolls, and a fine progress rail
 * records where they are. Mobile and reduced-motion get the same content as a
 * plain vertical sequence, because a pinned story must never trap a reader.
 */
export function ChapterProcess() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      const container = root.current;
      if (!el || !container) return;

      const distance = () => el.scrollWidth - window.innerWidth + 64;

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            setActive(Math.min(stages.length - 1, Math.floor(self.progress * stages.length)));
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
    <section id="chapter-04" className="relative border-t border-line bg-white">
      {/* pinned, desktop */}
      <div ref={root} className="relative hidden lg:block">
        <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-50" aria-hidden />
        <div className="flex h-[100svh] flex-col overflow-hidden">
          <div className="edge relative flex items-end justify-between gap-8 pb-6 pt-[calc(var(--header-h)+2.5rem)]">
            <div>
              <span className="label-tight flex items-center gap-2.5 text-muted">
                <span className="h-[5px] w-[5px] rounded-full bg-signal" />
                Chapter 04 / Engineering solutions
              </span>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.4rem)] uppercase leading-[0.98] tracking-[-0.035em] text-eng">
                From site survey to a system that&apos;s live
              </h2>
            </div>
            <p className="max-w-[16rem] pb-2 text-right text-xs leading-relaxed text-muted">
              Six stages. One accountable team.
              <br />
              Scroll to advance through the sequence.
            </p>
          </div>

          <div className="relative flex-1 overflow-hidden border-y border-line">
            <div ref={track} className="flex h-full will-change-transform">
              {stages.map((stage, index) => (
                <article
                  key={stage.step}
                  className="relative flex h-full w-[min(78vw,660px)] shrink-0 flex-col justify-center border-r border-line px-10 xl:px-14"
                >
                  <div className="relative max-w-xl">
                    <div className="mb-7 flex items-center gap-3">
                      <span className="flex h-8 items-center border border-line px-3 font-mono text-[9px] uppercase tracking-[0.2em] text-eng">
                        Stage {stage.step}
                      </span>
                      <span className="label-tight text-signal">{stage.kicker}</span>
                    </div>
                    <span className="pointer-events-none absolute -top-24 right-0 select-none font-display text-[clamp(6rem,12vw,10rem)] leading-none tracking-tighter text-eng/[0.05]">
                      {stage.step}
                    </span>
                    <h3 className="max-w-[16ch] font-display text-[clamp(1.7rem,2.9vw,2.7rem)] uppercase leading-[0.98] tracking-[-0.03em] text-eng">
                      {stage.title}
                    </h3>
                    <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted">{stage.body}</p>
                    <div className="mt-9 border-t border-line pt-4">
                      <p className="label-tight mb-2 text-tech">Deliverables</p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-ink/75">{stage.output}</p>
                    </div>
                  </div>

                  {/* rail motif — sleepers, one lit per stage completed */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20" aria-hidden>
                    <div className="absolute bottom-9 left-0 right-0 h-px bg-line-strong" />
                    <div className="absolute bottom-[26px] left-0 right-0 h-px bg-line opacity-80" />
                    {Array.from({ length: 26 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "absolute bottom-5 h-5 w-[3px]",
                          i < ((index + 1) / stages.length) * 26 ? "bg-eng/60" : "bg-ink/10",
                        )}
                        style={{ left: `${(i / 26) * 100}%` }}
                      />
                    ))}
                  </div>
                </article>
              ))}
              <div className="flex h-full w-[32vw] shrink-0 items-center px-12">
                <p className="font-display text-2xl uppercase leading-tight text-tech">
                  Delivery &amp; support
                  <br />
                  <span className="text-eng">never the end of the job.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="edge relative py-5">
            <div className="relative h-px w-full bg-line">
              <span ref={bar} className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-signal" />
            </div>
            <div className="mt-3 flex justify-between">
              {stages.map((stage, index) => (
                <span
                  key={stage.step}
                  className={cn(
                    "label-tight text-[8px] transition-colors",
                    index === active ? "text-eng" : "text-tech",
                  )}
                >
                  {stage.step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* mobile / reduced motion */}
      <div className="lg:hidden">
        <div className="edge section-tight">
          <span className="label-tight flex items-center gap-2.5 text-muted">
            <span className="h-[5px] w-[5px] rounded-full bg-signal" />
            Chapter 04 / Engineering solutions
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,7vw,2.7rem)] uppercase leading-[1.02] tracking-[-0.03em] text-eng">
            From site survey to a system that&apos;s live
          </h2>

          <ol className="relative mt-10 border-l border-line pl-6">
            {stages.map((stage) => (
              <li key={stage.step} className="relative pb-9 last:pb-0">
                <span className="absolute -left-[27px] top-1.5 h-[7px] w-[7px] rounded-full border border-signal bg-white" />
                <div className="flex items-center gap-3">
                  <span className="label-tight text-eng">Stage {stage.step}</span>
                  <span className="label-tight text-tech">{stage.kicker}</span>
                </div>
                <h3 className="mt-2 font-display text-xl uppercase tracking-[-0.02em] text-eng">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{stage.body}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-tech">{stage.output}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
