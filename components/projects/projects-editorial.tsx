"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterId = "all" | "signalling" | "telecom" | "completed" | "ongoing";

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "signalling", label: "Signalling" },
  { id: "telecom", label: "Telecommunications" },
  { id: "completed", label: "Completed" },
  { id: "ongoing", label: "In progress" },
];

/**
 * The works register as an editorial gallery.
 *
 * A lead spread at the top, then a grid of photographs at genuinely different
 * sizes — one wide, one portrait, one small — with the caption living under the
 * image as type rather than as a badge on it. Photographs are the structure;
 * there are no cards, no shadows and no coloured status dots.
 */
export function ProjectsEditorial({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        if (filter === "all") return true;
        if (filter === "signalling" || filter === "telecom") return project.division === filter;
        return project.status === filter;
      }),
    [filter, projects],
  );

  const [lead, ...rest] = filtered;

  return (
    <div>
      {/* filter rail: plain words with counts, no pill chrome */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-line pb-4">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          {filters.map((item) => {
            const count =
              item.id === "all"
                ? projects.length
                : item.id === "signalling" || item.id === "telecom"
                  ? projects.filter((p) => p.division === item.id).length
                  : projects.filter((p) => p.status === item.id).length;
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={isActive}
                className={cn(
                  "group text-[0.9rem] transition-colors",
                  isActive ? "text-eng" : "text-muted hover:text-eng",
                )}
              >
                <span className={isActive ? "link-underline" : undefined}>{item.label}</span>
                <span className="ml-1.5 text-[0.75rem] text-tech tabular">
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[0.8rem] text-tech tabular">
          {String(filtered.length).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12"
        >
          {lead ? (
            <Link
              href={`/projects/${lead.slug}`}
              className="group grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-14"
              data-cursor-label="Case study"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-800">
                <Image
                  src={lead.images[0]}
                  alt={lead.shortTitle}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-engineering group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-col justify-end pb-2">
                <p className="text-[0.82rem] text-muted">
                  {lead.division === "signalling" ? "Railway signalling" : "Telecommunications"} ·{" "}
                  {lead.client}
                </p>
                <h3 className="mt-4 max-w-[24ch] text-[clamp(1.7rem,3vw,2.7rem)] leading-[1.06] tracking-[-0.014em] text-eng">
                  {lead.shortTitle}
                </h3>
                <p className="mt-5 max-w-[44ch] text-[0.94rem] leading-[1.65] text-ink/80">
                  {lead.summary}
                </p>
                <p className="mt-6 text-[0.82rem] text-tech">
                  {lead.location}, {lead.state} ·{" "}
                  {lead.status === "completed" ? "Completed" : "In progress"}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.9rem] text-eng">
                  <span className="link-underline">Open the case study</span>
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden>
                    <path d="M0 4.5h12M8.5 1L12 4.5 8.5 8" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </div>
            </Link>
          ) : (
            <p className="py-20 text-center text-[0.9rem] text-muted">
              No published works match this filter.
            </p>
          )}

          {/* asymmetric gallery — three rhythms, not one repeated tile */}
          <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
            {rest.map((project, index) => {
              const rhythm = index % 3;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    rhythm === 0 && "lg:col-span-7",
                    rhythm === 1 && "lg:col-span-4 lg:col-start-9 lg:mt-20",
                    rhythm === 2 && "lg:col-span-5 lg:col-start-2",
                  )}
                >
                  <ProjectEntry project={project} index={index + 1} rhythm={rhythm} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProjectEntry({
  project,
  index,
  rhythm,
}: {
  project: Project;
  index: number;
  rhythm: number;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block" data-cursor-label="Case study">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-navy-800",
          rhythm === 0 ? "aspect-[3/2]" : rhythm === 1 ? "aspect-[4/5]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={project.images[0]}
          alt={project.shortTitle}
          fill
          sizes={rhythm === 0 ? "(min-width: 1024px) 56vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
          className="object-cover transition-transform duration-[1400ms] ease-engineering group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-[0.8rem] text-tech tabular">{String(index).padStart(2, "0")}</p>
        <p className="text-[0.8rem] text-muted">{project.client}</p>
      </div>
      <h3
        className={cn(
          "mt-2 leading-[1.1] text-eng transition-colors group-hover:text-ink",
          rhythm === 0
            ? "text-[clamp(1.25rem,2vw,1.7rem)]"
            : "text-[clamp(1.1rem,1.5vw,1.32rem)]",
        )}
      >
        {project.shortTitle}
      </h3>
      <p className="mt-2 text-[0.8rem] text-tech">
        {project.location}, {project.state}
        {project.status === "ongoing" ? " · in progress" : null}
      </p>
    </Link>
  );
}
