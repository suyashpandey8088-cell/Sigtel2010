import Link from "next/link";
import type { Project } from "@/lib/types";
import { states } from "@/lib/content/site";
import { IndiaMap } from "@/components/home/india-map";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

/**
 * Chapter 05 — projects and infrastructure presence. The register's locations
 * on a light map, with the state-by-state record printed underneath.
 */
export function ChapterPresence({ projects }: { projects: Project[] }) {
  const completed = projects.filter((p) => p.status === "completed").length;
  const ongoing = projects.length - completed;

  return (
    <section id="chapter-05" className="relative overflow-hidden border-t border-line bg-navy">
      <div className="edge section relative">
        <div className="grid gap-8 pb-12 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <SectionHeading
            index="Chapter 05"
            label="Projects & infrastructure presence"
            title={["WHERE THE PLATE", "MEETS THE GROUND."]}
            align="left"
          />
          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-4 border-t border-line pt-5 lg:border-t-0 lg:pt-0">
              {[
                { value: projects.length, label: "Works recorded" },
                { value: completed, label: "Completed" },
                { value: ongoing, label: "In progress" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-[clamp(1.9rem,3.4vw,2.9rem)] leading-none tracking-[-0.04em] text-eng">
                    {String(item.value).padStart(2, "0")}
                  </p>
                  <p className="mt-2 label-tight text-tech">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal>
          <IndiaMap projects={projects} />
        </Reveal>

        <div className="mt-12 grid gap-px border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-5">
          {states.map((state, index) => (
            <Reveal key={state.name} delay={index * 0.05}>
              <div className="flex items-start justify-between gap-3 border-b border-line pb-3 pr-2 lg:border-b-0">
                <div>
                  <p className="font-display text-base uppercase leading-tight text-eng">{state.name}</p>
                  <p className="mt-1.5 text-[0.76rem] leading-relaxed text-muted">{state.sites}</p>
                </div>
                <span className="font-mono text-[9px] text-tech">{String(state.count).padStart(2, "0")}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
            <p className="max-w-md font-mono text-[9px] uppercase leading-relaxed tracking-[0.13em] text-tech">
              Register as published by SIG-TEL. Client and division stated only where the work is recorded.
            </p>
            <Magnetic>
              <Link href="/projects" className="btn" data-cursor-label="All work">
                <span>The full works register</span>
                <svg width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden>
                  <path d="M0 4.5h13M9.5 1L13 4.5 9.5 8" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
