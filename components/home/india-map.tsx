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

export function IndiaMap({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<MapFilter>("all");
  const [state, setState] = useState<string | null>("Maharashtra");
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      projects.filter((project) =>
        filter === "all" ? true : project.division === filter,
      ),
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
  const active = activeProject
    ? visible.find((p) => p.id === activeProject)
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1">
            {(
              [
                { id: "all", label: "All work" },
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
                  "px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors",
                  filter === item.id
                    ? "bg-ink text-navy-900"
                    : "border border-line text-muted hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-tech">
              <span className="h-[5px] w-[5px] rounded-full bg-signal" />{" "}
              Signalling
            </span>
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-tech">
              <span className="h-[5px] w-[5px] rounded-full bg-eng" /> Telecom
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden border border-line bg-navy-900/60 p-2 sm:p-4">
          <div
            className="pointer-events-none absolute inset-0 grid-blueprint-sm opacity-30"
            aria-hidden
          />
          <svg
            viewBox="0 0 612 696"
            role="img"
            aria-label="Map of India showing SIG-TEL project locations across Maharashtra, Goa, Karnataka, Madhya Pradesh and Uttar Pradesh"
            className="relative mx-auto block h-auto w-full max-h-[640px]"
          >
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--eng)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--eng)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {india.locations.map((location) => {
              const hasWork = Object.prototype.hasOwnProperty.call(
                stateIds,
                location.name,
              )
                ? states.has(location.name)
                : false;
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
                    if (
                      Object.prototype.hasOwnProperty.call(
                        stateIds,
                        location.name,
                      )
                    ) {
                      setState(location.name);
                    }
                  }}
                  className={cn(
                    "transition-all duration-300",
                    Object.prototype.hasOwnProperty.call(
                      stateIds,
                      location.name,
                    )
                      ? "cursor-pointer"
                      : "cursor-default",
                  )}
                  fill={
                    isSelected
                      ? "color-mix(in srgb, var(--eng) 26%, transparent)"
                      : hasWork
                        ? "color-mix(in srgb, var(--eng) 12%, transparent)"
                        : isHover
                          ? "var(--navy-700)"
                          : "var(--navy-800)"
                  }
                  stroke={
                    isSelected
                      ? "var(--eng)"
                      : hasWork
                        ? "color-mix(in srgb, var(--eng) 55%, transparent)"
                        : "var(--line-strong)"
                  }
                  strokeWidth={isSelected ? 1.2 : 0.7}
                />
              );
            })}

            {/* HQ */}
            <g aria-hidden>
              <circle
                cx={projectX(73.0387)}
                cy={projectY(19.0206)}
                r="18"
                fill="url(#mapGlow)"
              />
            </g>

            {visible.map((project) => {
              const x = projectX(project.lng);
              const y = projectY(project.lat);
              const isActive = activeProject === project.id;
              const color =
                project.division === "signalling"
                  ? "var(--signal)"
                  : "var(--eng)";
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
                  <circle cx={x} cy={y} r="9" fill="transparent" />
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 5 : 3}
                    fill={color}
                    stroke="var(--navy-900)"
                    strokeWidth="1"
                  />
                  {isActive ? (
                    <circle
                      cx={x}
                      cy={y}
                      r="9"
                      fill="none"
                      stroke={color}
                      strokeWidth="0.8"
                      opacity="0.7"
                    >
                      <animate
                        attributeName="r"
                        values="6;12"
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0"
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  ) : null}
                </g>
              );
            })}
          </svg>

          <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 border border-line bg-navy-900/85 px-2.5 py-1.5">
            <span className="h-[5px] w-[5px] rounded-full bg-ink" />
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
              Head office · Navi Mumbai
            </span>
          </div>
        </div>
        <p className="mt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-tech">
          Boundaries: Census of India 2011 districts · Markers show published
          works locations
        </p>
      </div>

      <div className="flex flex-col border border-line bg-navy-800/50">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="label text-tech">Where we work</p>
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
                "px-2 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.14em] transition-colors",
                state === name
                  ? "bg-eng text-navy-900"
                  : "text-muted hover:text-ink",
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
                  <p className="label-tight mb-2 text-eng">{active.client}</p>
                  <h3 className="font-display text-lg uppercase leading-tight text-ink">
                    {active.shortTitle}
                  </h3>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-tech">
                    {active.location} · {active.state}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {active.summary}
                  </p>
                  <Link
                    href={`/projects/${active.slug}`}
                    className="mt-5 inline-flex items-center gap-2 border-b border-eng/40 pb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-eng"
                  >
                    Open case study
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M0 4h10M7 1l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="label-tight mb-2 text-tech">Selected state</p>
                  <h3 className="font-display text-lg uppercase leading-tight text-ink">
                    {state ?? "India"}
                  </h3>
                  {selectedProjects.length ? (
                    <ul className="mt-4 divide-y divide-line">
                      {selectedProjects.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={`/projects/${project.slug}`}
                            className="group block py-3"
                          >
                            <p className="flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-tech">
                              <span
                                className={cn(
                                  "h-[4px] w-[4px] rounded-full",
                                  project.division === "signalling"
                                    ? "bg-signal"
                                    : "bg-eng",
                                )}
                              />
                              {project.division === "signalling"
                                ? "Signalling"
                                : "Telecom"}
                            </p>
                            <p className="mt-1 text-[0.86rem] leading-snug text-ink/85 transition-colors group-hover:text-eng">
                              {project.shortTitle}
                            </p>
                            <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-tech">
                              {project.location}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-muted">
                      No published works match this filter in the selected
                      state.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-line px-5 py-4">
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-tech">
            States: Maharashtra · Goa · Karnataka · Madhya Pradesh · Uttar
            Pradesh
          </p>
        </div>
      </div>
    </div>
  );
}
