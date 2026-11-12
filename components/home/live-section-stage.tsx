"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { LiveSectionDiagram } from "@/components/home/live-section-diagram";
import { SceneBoundary } from "@/components/home/scene-boundary";
import type { Aspect } from "@/components/three/live-section-scene";
import { modeMeta, type InfraMode } from "@/lib/content/infrastructure-3d";
import { cn } from "@/lib/utils";

const LiveSectionScene = dynamic(
  () => import("@/components/three/live-section-scene"),
  {
    ssr: false,
    loading: () => null,
  },
);

/**
 * Phase table for the live section. The signal steps red → amber → green and
 * back, and the crossing follows it: barriers up while the road has priority,
 * flashers and booms down once the section is being cleared.
 */
const PHASES: { aspect: Aspect; gateDown: boolean; gate: string }[] = [
  { aspect: "red", gateDown: false, gate: "OPEN TO ROAD · BOOMS UP" },
  { aspect: "amber", gateDown: true, gate: "WARNING · FLASHERS ON" },
  { aspect: "green", gateDown: true, gate: "CLOSED TO ROAD · BOOMS DOWN" },
  { aspect: "amber", gateDown: true, gate: "WARNING · FLASHERS ON" },
];

const ASPECT_LABEL: Record<Aspect, string> = {
  red: "RED · STOP",
  amber: "AMBER · CAUTION",
  green: "GREEN · CLEAR",
};

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") ?? canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export function LiveSectionStage({
  mode,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  mode: InfraMode;
  selected: string;
  hovered: string;
  onSelect: (key: string) => void;
  onHover: (key: string) => void;
}) {
  const [model, setModel] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [phase, setPhase] = useState(0);

  // Only mount the model once we know the device can actually draw it; until
  // then — and on every device that cannot — the drawing carries the section.
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      setReduced(motion.matches);
      setModel(!motion.matches && hasWebGL());
    };
    decide();
    motion.addEventListener("change", decide);
    return () => motion.removeEventListener("change", decide);
  }, []);

  useEffect(() => {
    if (!model || reduced) return;
    const id = window.setInterval(
      () => setPhase((value) => (value + 1) % PHASES.length),
      3800,
    );
    return () => window.clearInterval(id);
  }, [model, reduced]);

  // if the canvas never reports back, the drawing takes over rather than
  // leaving an empty frame on screen
  useEffect(() => {
    if (!model || ready || failed) return;
    const id = window.setTimeout(() => setFailed(true), 9000);
    return () => window.clearTimeout(id);
  }, [model, ready, failed]);

  const current = PHASES[phase];
  const meta = modeMeta[mode];
  const drawing = (
    <div className="absolute inset-0 overflow-x-auto" data-ls-drawing>
      <div className="min-w-[1180px] lg:min-w-0">
        <LiveSectionDiagram
          mode={mode}
          selected={selected}
          hovered={hovered}
          onSelect={onSelect}
          onHover={onHover}
        />
      </div>
    </div>
  );
  const showModel = model && !failed;

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050c16] sm:aspect-[16/10] lg:aspect-[16/9]">
        {/* the drawing is always underneath: it is the initial paint, the
            fallback, and the keyboard-reachable set of hotspots */}
        {drawing}

        {showModel ? (
          <div
            className={cn(
              "absolute inset-0 bg-[#050c16] transition-opacity duration-700",
              ready ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <SceneBoundary fallback={null}>
              <LiveSectionScene
                mode={mode}
                selected={selected}
                hovered={hovered}
                aspect={current.aspect}
                gateDown={current.gateDown}
                reducedMotion={reduced}
                onHover={onHover}
                onSelect={onSelect}
                onReady={() => setReady(true)}
              />
            </SceneBoundary>
          </div>
        ) : null}

        {/* status badge */}
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 border border-ink/10 bg-navy-900/80 px-2.5 py-1.5 backdrop-blur">
          <span
            className={cn(
              "h-[5px] w-[5px] rounded-full",
              mode === "signalling" ? "bg-signal" : "bg-eng",
            )}
          />
          <span className="label-tight text-[8px] text-ink/70">
            {meta.title} · live section
          </span>
          {showModel ? (
            <span className="ml-1 border border-ink/15 px-1 py-px font-mono text-[7px] uppercase tracking-[0.18em] text-tech">
              3D
            </span>
          ) : null}
        </div>

        {/* live readout — the drawing carries its own, so only show this one
            over the model */}
        {showModel ? (
          <div className="pointer-events-none absolute bottom-4 left-4 max-w-[78%]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-line bg-[#050c16]/85 px-3 py-2 backdrop-blur">
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-[6px] w-[6px] rounded-full",
                    current.aspect === "red"
                      ? "bg-signal"
                      : current.aspect === "amber"
                        ? "bg-[#f5b942]"
                        : "bg-eng",
                  )}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-tech">
                  Aspect
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.12em]",
                    current.aspect === "red"
                      ? "text-signal"
                      : current.aspect === "amber"
                        ? "text-[#f5b942]"
                        : "text-eng",
                  )}
                >
                  {ASPECT_LABEL[current.aspect]}
                </span>
              </span>
              <span className="hidden h-3 w-px bg-line sm:block" />
              <span className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-tech">
                  LC gate
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/80">
                  {current.gate}
                </span>
              </span>
            </div>
          </div>
        ) : null}

        {showModel ? (
          <span className="pointer-events-none absolute bottom-4 right-4 hidden font-mono text-[8px] uppercase tracking-[0.18em] text-tech sm:block">
            Drag to orbit · scroll to zoom
          </span>
        ) : null}

        {/* corner ticks, matching the drawing frame */}
        <span
          className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-ink/15"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-ink/15"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-ink/15"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-ink/15"
          aria-hidden
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5">
        <span className="label-tight text-[8px] text-tech">
          {showModel
            ? "Select a component · camera follows"
            : "Select a numbered component"}
        </span>
        <span className="label-tight text-[8px] text-tech">
          {showModel
            ? "Orbit · zoom · not to scale"
            : "Section elevation · not to scale"}
        </span>
      </div>
    </div>
  );
}
