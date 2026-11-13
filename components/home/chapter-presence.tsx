import Link from "next/link";
import type { Project } from "@/lib/types";
import { states } from "@/lib/content/site";
import { IndiaMap } from "@/components/home/india-map";
import { EditorialHead } from "@/components/ui/section-heading";
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
        <EditorialHead
          mark="05 — Presence"
          title={["Where the drawings", "meet the ground."]}
          deck="Twenty recorded works across five states, in two disciplines. Every entry below is one SIG-TEL has published — client and division stated only where the work is recorded."
          className="pb-14"
        />

        <Reveal>
          <IndiaMap projects={projects} />
        </Reveal>

        <div className="mt-12 grid gap-px border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-5">
          {states.map((state, index) => (
            <Reveal key={state.name} delay={index * 0.05}>
              <div className="flex items-start justify-between gap-3 border-b border-line pb-3 pr-2 lg:border-b-0">
                <div>
                  <p className="text-[1.02rem] leading-tight text-eng">{state.name}</p>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">{state.sites}</p>
                </div>
                <span className="text-[0.8rem] text-tech tabular">{String(state.count).padStart(2, "0")}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
            <p className="max-w-md text-[0.82rem] leading-relaxed text-tech">
              Register as published by SIG-TEL. Client and division stated only where the work is recorded.
            </p>
            <Magnetic>
              <Link href="/projects" className="btn" data-cursor-label="All work">
                <span>The full works register</span>
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden>
                  <path d="M0 4.5h12M8.5 1L12 4.5 8.5 8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
