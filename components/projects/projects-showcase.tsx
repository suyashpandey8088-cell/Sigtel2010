"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/projects/project-card";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/magnetic";

const filters = [
  { id: "all", label: "All projects" },
  { id: "signalling", label: "Signalling" },
  { id: "telecom", label: "Telecommunications" },
  { id: "completed", label: "Completed" },
  { id: "ongoing", label: "Ongoing" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export function ProjectsShowcase({
  projects,
  variant = "home",
}: {
  projects: Project[];
  variant?: "home" | "page";
}) {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    const list = projects.filter((project) => {
      if (filter === "all") return true;
      if (filter === "signalling" || filter === "telecom") return project.division === filter;
      return project.status === filter;
    });
    return variant === "home" ? list.slice(0, 6) : list;
  }, [filter, projects, variant]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-6 border-y border-line py-4">
        <div className="flex flex-wrap gap-x-1 gap-y-2">
          {filters.map((item) => {
            const count =
              item.id === "all"
                ? projects.length
                : item.id === "signalling" || item.id === "telecom"
                  ? projects.filter((p) => p.division === item.id).length
                  : projects.filter((p) => p.status === item.id).length;
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.18em] transition-colors",
                  active ? "bg-ink text-navy" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
                <span className={cn("text-[8px]", active ? "text-navy/50" : "text-tech")}>{String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
        <p className="label-tight text-tech">
          Showing {String(filtered.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      <motion.div layout className="mt-8 grid gap-4 md:gap-5 lg:grid-cols-12">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => {
            const isFeature = index === 0;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.04, 0.28) }}
                className={cn(
                  isFeature ? "lg:col-span-12" : "lg:col-span-6",
                  index === 1 && variant === "home" && "lg:col-span-6",
                  index === 2 && variant === "home" && "lg:col-span-6",
                  index > 2 && variant === "home" && "lg:col-span-6",
                )}
              >
                <ProjectCard project={project} size={isFeature ? "feature" : "standard"} index={index} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {variant === "home" ? (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Works register as published by SIG-TEL. Client and division are stated only where the work is
            recorded; images are illustrative of the discipline.
          </p>
          <Magnetic>
            <Link href="/projects" className="btn" data-cursor-label="All work">
              <span>View the full works register</span>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
                <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
          </Magnetic>
        </div>
      ) : null}
    </div>
  );
}
