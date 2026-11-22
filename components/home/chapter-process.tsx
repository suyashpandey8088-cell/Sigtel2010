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
        <div className="flex h-[100svh] flex-col overflow-hidden">
          <div className="edge relative flex items-end justify-between gap-8 pb-8 pt-[calc(var(--header-h)+2.5rem)]">
            <div>
              <p className="mark">04 — Engineering solutions</p>
              <h2 className="mt-4 max-w-[24ch] text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.04] tracking-[-0.016em] text-eng">
                From site survey to a system that&apos;s live
              </h2>
            </div>
            <p className="max-w-[15rem] pb-1 text-right text-[0.85rem] leading-relaxed text-muted">
              Six stages, one accountable team. Scroll to advance.
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
                    <p className="text-[0.82rem] text-tech tabular">
                      {stage.step} / 06 · {stage.kicker}
                    </p>
                    <h3 className="mt-4 max-w-[18ch] text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.02] tracking-[-0.014em] text-eng">
                      {stage.title}
                    </h3>
                    <p className="mt-5 max-w-md text-[0.98rem] leading-[1.65] text-ink/80">{stage.body}</p>
                    <p className="mt-8 max-w-md border-t border-line pt-4 text-[0.86rem] leading-relaxed text-muted">
                      {stage.output}
                    </p>
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
                          i < ((index + 1) / stages.length) * 26 ? "bg-eng/45" : "bg-ink/[0.08]",
                        )}
                        style={{ left: `${(i / 26) * 100}%` }}
                      />
                    ))}
                  </div>
                </article>
              ))}
              <div className="flex h-full w-[32vw] shrink-0 items-center px-12">
                <p className="text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] text-tech">
                  Delivery and support —
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
                    "text-[0.78rem] tabular transition-colors",
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
          <p className="mark">04 — Engineering solutions</p>
          <h2 className="mt-4 text-[clamp(1.9rem,7vw,2.7rem)] leading-[1.04] tracking-[-0.016em] text-eng">
            From site survey to a system that&apos;s live
          </h2>

          <ol className="relative mt-10 border-l border-line pl-6">
            {stages.map((stage) => (
              <li key={stage.step} className="relative pb-9 last:pb-0">
                <span className="absolute -left-[27px] top-1.5 h-[7px] w-[7px] rounded-full border border-eng bg-white" />
                <p className="text-[0.8rem] text-tech tabular">
                  {stage.step} / 06 · {stage.kicker}
                </p>
                <h3 className="mt-2 text-[1.28rem] leading-tight text-eng">{stage.title}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/80">{stage.body}</p>
                <p className="mt-3 text-[0.84rem] leading-relaxed text-muted">{stage.output}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
