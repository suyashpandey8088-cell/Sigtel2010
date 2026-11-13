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
  { aspect: "red", gateDown: false, gate: "Open to road, booms up" },
  { aspect: "amber", gateDown: true, gate: "Warning, flashers on" },
  { aspect: "green", gateDown: true, gate: "Closed to road, booms down" },
  { aspect: "amber", gateDown: true, gate: "Warning, flashers on" },
];

const ASPECT_LABEL: Record<Aspect, string> = {
  red: "Red, stop",
  amber: "Amber, caution",
  green: "Green, clear",
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

/**
 * The live-section stage. On a WebGL-capable device the daylight 3D model is
 * drawn over the engineering plate; the plate stays underneath as the initial
 * paint, the reduced-motion representation, the no-WebGL fallback and the
 * keyboard-reachable set of hotspots. `interactive` lets the drawing carry the
 * section on its own (for instance on smaller screens).
 */
export function LiveSectionStage({
  mode,
  selected,
  hovered,
  onSelect,
  onHover,
  interactive = true,
}: {
  mode: InfraMode;
  selected: string;
  hovered: string;
  onSelect: (key: string) => void;
  onHover: (key: string) => void;
  interactive?: boolean;
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
    // the drawing scrolls sideways on narrow screens, and a canvas you can
    // drag would fight that gesture — so the model is a wide-screen reading
    const wide = window.matchMedia("(min-width: 1024px)");
    const decide = () => {
      setReduced(motion.matches);
      setModel(
        interactive && !motion.matches && wide.matches && hasWebGL(),
      );
    };
    decide();
    motion.addEventListener("change", decide);
    wide.addEventListener("change", decide);
    return () => {
      motion.removeEventListener("change", decide);
      wide.removeEventListener("change", decide);
    };
  }, [interactive]);

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
  const showModel = interactive && model && !failed;

  return (
    <div className="relative bg-white">
      <div className="relative">
        {/* the drawing is always underneath: it is the initial paint and the
            fallback. Once the model is up it is taken out of the tab order so
            keyboard users get one set of hotspots, not two. */}
        <div
          className={cn(showModel && "pointer-events-none")}
          aria-hidden={showModel || undefined}
          inert={showModel || undefined}
        >
          <LiveSectionDiagram
            mode={mode}
            selected={selected}
            hovered={hovered}
            onSelect={onSelect}
            onHover={onHover}
          />
        </div>

        {showModel ? (
          <div
            className={cn(
              "absolute inset-0 bg-navy transition-opacity duration-700",
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

        {/* status plate */}
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 border border-line bg-white/95 px-2.5 py-1.5 backdrop-blur">
          <span
            className={cn(
              "h-[5px] w-[5px] rounded-full",
              mode === "signalling" ? "bg-signal" : "bg-clear",
            )}
          />
          <span className="text-[0.78rem] text-eng/80">{meta.title} · live section</span>
          {showModel ? (
            <span className="ml-1 border border-line px-1.5 py-px text-[0.7rem] text-muted">3D</span>
          ) : null}
        </div>

        {showModel ? (
          <span className="pointer-events-none absolute right-4 top-4 hidden text-[0.78rem] text-muted sm:block">
            Drag to orbit, scroll to zoom
          </span>
        ) : (
          <span className="pointer-events-none absolute right-4 top-4 hidden text-[0.78rem] text-muted sm:block">
            Section elevation, not to scale
          </span>
        )}

        {/* live readout — the drawing carries its own, so only show this one
            over the model */}
        {showModel ? (
          <div className="pointer-events-none absolute bottom-4 left-4 max-w-[86%]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-line bg-white/95 px-3 py-2 backdrop-blur">
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-[6px] w-[6px] rounded-full",
                    current.aspect === "red"
                      ? "bg-signal"
                      : current.aspect === "amber"
                        ? "bg-[#E8A33D]"
                        : "bg-clear",
                  )}
                />
                <span className="text-[0.78rem] text-muted">Aspect</span>
                <span
                  className={cn(
                    "text-[0.82rem]",
                    current.aspect === "red"
                      ? "text-signal"
                      : current.aspect === "amber"
                        ? "text-[#B8791A]"
                        : "text-clear",
                  )}
                >
                  {ASPECT_LABEL[current.aspect]}
                </span>
              </span>
              <span className="hidden h-3 w-px bg-line sm:block" />
              <span className="flex items-center gap-2">
                <span className="text-[0.78rem] text-muted">Level crossing</span>
                <span className="text-[0.82rem] text-ink/80">{current.gate}</span>
              </span>
            </div>
          </div>
        ) : null}

        {showModel ? (
          <span className="pointer-events-none absolute bottom-4 right-4 hidden text-[0.78rem] text-muted sm:block">
            Model, not to scale
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5">
        <span className="text-[0.8rem] text-muted">
          {showModel
            ? "Select a component — the camera follows"
            : "Select a numbered component, or use the index"}
        </span>
        <span className="text-[0.8rem] text-tech">
          {showModel ? "Orbit, zoom, not to scale" : "Drawing, not to scale"}
        </span>
      </div>
    </div>
  );
}
