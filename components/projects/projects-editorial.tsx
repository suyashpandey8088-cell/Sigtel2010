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
  { id: "ongoing", label: "Ongoing" },
];

/**
 * The works register as an editorial gallery: one large plate, then an
 * asymmetric grid of photographs and typographic entries. No cards, no
 * shadows — hairline rules and generous type carry the structure.
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
      {/* filter rail */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line pb-4">
        <div className="flex flex-wrap gap-x-1 gap-y-2">
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
                  "group flex items-center gap-2 px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors",
                  isActive ? "bg-eng text-white" : "text-muted hover:text-eng",
                )}
              >
                {item.label}
                <span className={cn("text-[8px]", isActive ? "text-white/60" : "text-tech")}>
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
        <p className="label-tight text-tech">
          Showing {String(filtered.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pt-8"
        >
          {lead ? (
            <Link
              href={`/projects/${lead.slug}`}
              className="group grid gap-6 border-b border-line pb-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12"
              data-cursor-label="Case study"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-800">
                <Image
                  src={lead.images[0]}
                  alt={lead.shortTitle}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-engineering group-hover:scale-[1.035]"
                />
                <span className="absolute left-4 top-4 flex items-center gap-2 bg-white px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-eng">
                  <span
                    className={cn(
                      "h-[4px] w-[4px] rounded-full",
                      lead.status === "completed" ? "bg-clear" : "bg-signal",
                    )}
                  />
                  Featured work
                </span>
              </div>

              <div className="flex flex-col justify-between gap-6 lg:py-2">
                <div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="label-tight text-signal">
                      {lead.division === "signalling" ? "Railway signalling" : "Telecommunications"}
                    </span>
                    <span className="h-px w-6 bg-line-strong" />
                    <span className="label-tight text-muted">{lead.client}</span>
                  </div>
                  <h3 className="mt-5 max-w-[22ch] font-display text-[clamp(1.6rem,3.2vw,2.9rem)] uppercase leading-[1.02] tracking-[-0.03em] text-eng">
                    {lead.shortTitle}
                  </h3>
                  <p className="mt-5 max-w-md text-[0.92rem] leading-relaxed text-muted">{lead.summary}</p>
                </div>
                <div>
                  <dl className="grid grid-cols-2 gap-4 border-t border-line pt-4">
                    <div>
                      <dt className="label-tight text-tech">Location</dt>
                      <dd className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink/80">
                        {lead.location} · {lead.state}
                      </dd>
                    </div>
                    <div>
                      <dt className="label-tight text-tech">Status</dt>
                      <dd className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink/80">
                        {lead.status === "completed" ? "Completed" : "Ongoing"}
                      </dd>
                    </div>
                  </dl>
                  <span className="mt-5 inline-flex items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-eng">
                    <span className="link-underline">Open case study</span>
                    <span className="h-px w-7 bg-signal transition-all duration-500 group-hover:w-11" />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <p className="py-16 text-center text-sm text-muted">
              No published works match this filter.
            </p>
          )}

          {/* asymmetric gallery */}
          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-12">
            {rest.map((project, index) => {
              const wide = index % 5 === 0;
              const tall = index % 5 === 3;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    wide ? "lg:col-span-7" : tall ? "lg:col-span-5 lg:mt-16" : "lg:col-span-6",
                  )}
                >
                  <ProjectEntry project={project} index={index + 1} wide={wide} />
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
  wide = false,
}: {
  project: Project;
  index: number;
  wide?: boolean;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block" data-cursor-label="Case study">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-navy-800",
          wide ? "aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={project.images[0]}
          alt={project.shortTitle}
          fill
          sizes={wide ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"}
          className="object-cover transition-transform duration-[1600ms] ease-engineering group-hover:scale-[1.04]"
        />
        <span className="absolute right-3 top-3 bg-white px-2 py-1 font-mono text-[8px] tracking-[0.16em] text-eng/70">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <span className="label-tight text-signal">
          {project.division === "signalling" ? "Signalling" : "Telecom"}
        </span>
        <span className="label-tight text-tech">{project.client}</span>
      </div>
      <h3
        className={cn(
          "mt-3 font-display uppercase leading-[1.08] tracking-[-0.02em] text-eng transition-colors group-hover:text-ink",
          wide ? "text-[clamp(1.2rem,2vw,1.7rem)]" : "text-[clamp(1.1rem,1.6vw,1.35rem)]",
        )}
      >
        {project.shortTitle}
      </h3>
      <div className="mt-3 flex items-center justify-between gap-4 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
          {project.location} · {project.state}
        </p>
        <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-eng/70">
          {project.status === "completed" ? "Completed" : "Ongoing"}
          <span
            className={cn(
              "h-[4px] w-[4px] rounded-full",
              project.status === "completed" ? "bg-clear" : "bg-signal",
            )}
          />
        </p>
      </div>
    </Link>
  );
}
