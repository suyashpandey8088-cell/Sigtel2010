"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

// Imported for its path data only — the package ships a plain object.
import India from "@svg-maps/india";

type MapFilter = "all" | "signalling" | "telecom";

const projectX = (lng: number) => 21.0 * lng - 1432.5;
const projectY = (lat: number) => 834.5 - 20.9 * lat;

interface MapLocation {
  id: string;
  name: string;
  path: string;
}

const india = India as unknown as { locations: MapLocation[] };

const stateIds: Record<string, string> = {
  Maharashtra: "mh",
  Goa: "ga",
  Karnataka: "ka",
  "Madhya Pradesh": "mp",
  "Uttar Pradesh": "up",
};

/**
 * Presence map — minimal light drawing, engineering-blue markers, no chrome.
 * States with published works are inked; the rest stay as hairline outlines so
 * the geography reads without decorating it.
 */
export function IndiaMap({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<MapFilter>("all");
  const [state, setState] = useState<string | null>("Maharashtra");
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const visible = useMemo(
    () => projects.filter((project) => (filter === "all" ? true : project.division === filter)),
    [projects, filter],
  );

  const states = useMemo(() => {
    const map = new Map<string, Project[]>();
    visible.forEach((project) => {
      const list = map.get(project.state) ?? [];
      list.push(project);
      map.set(project.state, list);
    });
    return map;
  }, [visible]);

  const selectedProjects = state ? (states.get(state) ?? []) : [];
  const highlightedStateId = state ? stateIds[state] : null;
  const active = activeProject ? visible.find((p) => p.id === activeProject) : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap gap-1">
            {(
              [
                { id: "all", label: "All" },
                { id: "signalling", label: "Signalling" },
                { id: "telecom", label: "Telecom" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={cn(
                  "px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors",
                  filter === item.id ? "bg-eng text-white" : "text-muted hover:text-eng",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              <span className="h-[5px] w-[5px] rounded-full bg-signal" /> Signalling
            </span>
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              <span className="h-[5px] w-[5px] rounded-full bg-clear" /> Telecom
            </span>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden bg-white">
          <div className="pointer-events-none absolute inset-0 grid-blueprint-sm opacity-40" aria-hidden />
          <svg
            viewBox="0 0 612 696"
            role="img"
            aria-label="Map of India showing SIG-TEL works locations across Maharashtra, Goa, Karnataka, Madhya Pradesh and Uttar Pradesh"
            className="relative mx-auto block h-auto w-full max-h-[660px]"
          >
            {india.locations.map((location) => {
              const isWorkState = Object.prototype.hasOwnProperty.call(stateIds, location.name);
              const hasWork = isWorkState ? states.has(location.name) : false;
              const isSelected = highlightedStateId === location.id;
              const isHover = hovered === location.id;
              return (
                <path
                  key={location.id}
                  d={location.path}
                  aria-hidden
                  onMouseEnter={() => setHovered(location.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (isWorkState) setState(location.name);
                  }}
                  className={cn(
                    "transition-all duration-300",
                    isWorkState ? "cursor-pointer" : "cursor-default",
                  )}
                  fill={
                    isSelected
                      ? "rgba(24,59,86,0.14)"
                      : hasWork
                        ? "rgba(24,59,86,0.07)"
                        : isHover
                          ? "rgba(24,59,86,0.05)"
                          : "rgba(24,43,58,0.015)"
                  }
                  stroke={
                    isSelected
                      ? "rgba(24,59,86,0.85)"
                      : hasWork
                        ? "rgba(24,59,86,0.4)"
                        : "rgba(24,43,58,0.13)"
                  }
                  strokeWidth={isSelected ? 1.1 : 0.6}
                />
              );
            })}

            {/* head office halo */}
            <g aria-hidden>
              <circle cx={projectX(73.0387)} cy={projectY(19.0206)} r="14" fill="rgba(24,59,86,0.08)" />
              <circle cx={projectX(73.0387)} cy={projectY(19.0206)} r="6" fill="none" stroke="rgba(24,59,86,0.35)" className="ping-soft" />
            </g>

            {visible.map((project) => {
              const x = projectX(project.lng);
              const y = projectY(project.lat);
              const isActive = activeProject === project.id;
              const color = project.division === "signalling" ? "#E44D43" : "#43866B";
              return (
                <g
                  key={project.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${project.shortTitle} — ${project.location}`}
                  onMouseEnter={() => setActiveProject(project.id)}
                  onMouseLeave={() => setActiveProject(null)}
                  onFocus={() => setActiveProject(project.id)}
                  onBlur={() => setActiveProject(null)}
                  onClick={() => {
                    setState(project.state);
                    setActiveProject(project.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setState(project.state);
                      setActiveProject(project.id);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <circle cx={x} cy={y} r="10" fill="transparent" />
                  <circle cx={x} cy={y} r={isActive ? 4.6 : 2.6} fill={color} stroke="#FFFFFF" strokeWidth="1" />
                  {isActive ? (
                    <circle cx={x} cy={y} r="8.5" fill="none" stroke={color} strokeWidth="0.8" opacity="0.7">
                      <animate attributeName="r" values="6;12" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  ) : null}
                </g>
              );
            })}
          </svg>

          <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-2 border border-line bg-white/95 px-2.5 py-1.5">
            <span className="h-[5px] w-[5px] rounded-full bg-eng" />
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-eng/80">
              Head office · Navi Mumbai
            </span>
          </div>
        </div>
        <p className="mt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-tech">
          Boundaries: Census of India 2011 districts · Markers show published works locations
        </p>
      </div>

      <div className="flex flex-col border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="label text-muted">Where we work</p>
          <p className="font-mono text-[9px] tracking-[0.16em] text-eng">
            {String(visible.length).padStart(2, "0")} works
          </p>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-line p-3">
          {Array.from(states.keys()).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setState(name)}
              aria-pressed={state === name}
              className={cn(
                "px-2 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] transition-colors",
                state === name ? "bg-eng text-white" : "text-muted hover:text-eng",
              )}
            >
              {name} · {String(states.get(name)?.length ?? 0).padStart(2, "0")}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden px-5 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.id ?? state ?? "empty"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {active ? (
                <div>
                  <p className="label-tight mb-2 text-signal">{active.client}</p>
                  <h3 className="font-display text-lg uppercase leading-tight text-eng">{active.shortTitle}</h3>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                    {active.location} · {active.state}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{active.summary}</p>
                  <Link
                    href={`/projects/${active.slug}`}
                    className="mt-5 inline-flex items-center gap-2 border-b border-eng/30 pb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-eng"
                  >
                    Open case study
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
                      <path d="M0 4h10M7 1l3 3-3 3" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="label-tight mb-2 text-tech">Selected state</p>
                  <h3 className="font-display text-lg uppercase leading-tight text-eng">{state ?? "India"}</h3>
                  {selectedProjects.length ? (
                    <ul className="mt-4 divide-y divide-line">
                      {selectedProjects.map((project) => (
                        <li key={project.id}>
                          <Link href={`/projects/${project.slug}`} className="group block py-3">
                            <p className="flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">
                              <span
                                className={cn(
                                  "h-[4px] w-[4px] rounded-full",
                                  project.division === "signalling" ? "bg-signal" : "bg-clear",
                                )}
                              />
                              {project.division === "signalling" ? "Signalling" : "Telecom"}
                            </p>
                            <p className="mt-1 text-[0.86rem] leading-snug text-ink/85 transition-colors group-hover:text-eng">
                              {project.shortTitle}
                            </p>
                            <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-tech">
                              {project.location}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-muted">
                      No published works match this filter in the selected state.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-line px-5 py-4">
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-tech">
            States: Maharashtra · Goa · Karnataka · Madhya Pradesh · Uttar Pradesh
          </p>
        </div>
      </div>
    </div>
  );
}
