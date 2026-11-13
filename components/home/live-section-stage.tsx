"use client";

import { LiveSectionDiagram } from "@/components/home/live-section-diagram";
import { cn } from "@/lib/utils";
import { modeMeta, type InfraMode } from "@/lib/content/infrastructure-3d";

/**
 * The interactive engineering plate. The drawing is the whole experience in the
 * light theme: it is printed on white, at a size every component can be read at,
 * and it is complete before hydration. Interactions (component select, mode
 * filter) live here; the drawing itself stays declarative.
 */
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
  const meta = modeMeta[mode];

  return (
    <div className="relative bg-white">
      <div className="relative">
        {/* the plate keeps its own aspect ratio; narrow screens scroll it rather
            than shrink the annotations out of legibility */}
        <div className="overflow-x-auto" data-ls-drawing>
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

        {/* status plate */}
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 border border-line bg-white/92 px-2.5 py-1.5 backdrop-blur">
          <span
            className={cn(
              "h-[5px] w-[5px] rounded-full",
              mode === "signalling" ? "bg-signal" : "bg-clear",
            )}
          />
          <span className="label-tight text-[8px] text-eng/80">{meta.title} · live section</span>
        </div>

        <span className="pointer-events-none absolute right-4 top-4 hidden font-mono text-[8px] uppercase tracking-[0.18em] text-muted sm:block">
          Section elevation · not to scale
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5">
        <span className="label-tight text-[8px] text-muted">Select a numbered component</span>
        <span className="label-tight text-[8px] text-tech">
          Drawing 04 · {mode === "signalling" ? "S&T scope" : "Network scope"}
        </span>
      </div>
    </div>
  );
}
