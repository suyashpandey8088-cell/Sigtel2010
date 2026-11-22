"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { infraNodes, modeMeta, type InfraMode } from "@/lib/content/infrastructure-3d";
import { LiveSectionStage } from "@/components/home/live-section-stage";
import { EditorialHead } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Chapter 02–03 — the engineering plate. One drawing of a live section carrying
 * both disciplines, with a component index beside it. This is the section that
 * makes the two-discipline claim legible instead of merely stated.
 */
export function PlateSection() {
  const [mode, setMode] = useState<InfraMode>("signalling");
  const [selected, setSelected] = useState("signal");
  const [hovered, setHovered] = useState("");

  const activeNode = useMemo(
    () => infraNodes.find((node) => node.key === (hovered || selected)) ?? infraNodes[0],
    [hovered, selected],
  );

  return (
    <section id="chapter-03" className="relative overflow-hidden border-t border-line bg-white">
      <div className="edge section relative">
        <EditorialHead
          mark="02 – 03 — One live section"
          title={["A double line, drawn", "in full."]}
          deck="Interlocked level crossing, signals, detection, overhead equipment, fibre route, radio mast and the control room that reads them all. Select a component to see where SIG-TEL fits — and what the drawing shows is what gets built."
          className="pb-14"
        />

        {/* mode switch — a measured toggle, not a pill */}
        <Reveal>
          <div className="mx-auto mb-8 flex w-full max-w-xl items-center justify-center">
            <div className="grid w-full grid-cols-2 border border-line">
              {(["signalling", "telecom"] as const).map((key) => {
                const active = mode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setMode(key);
                      const first = infraNodes.find((node) => node.division === key);
                      if (first) setSelected(first.key);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 text-[0.84rem] transition-colors [&:first-child]:border-r [&:first-child]:border-line",
                      active ? "bg-eng text-white" : "text-muted hover:text-eng",
                    )}
                  >
                    {key === "signalling" ? "Signalling" : "Telecommunications"}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
          <Reveal y={0}>
            <div className="border border-line bg-white">
              <LiveSectionStage
                mode={mode}
                selected={selected}
                hovered={hovered}
                onSelect={setSelected}
                onHover={setHovered}
              />
            </div>
          </Reveal>

          <Reveal delay={0.08} y={0} className="flex flex-col border border-line bg-navy">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-[0.84rem] text-muted">Components</span>
              <span className="text-[0.8rem] text-tech tabular">
                {String(infraNodes.length).padStart(2, "0")}
              </span>
            </div>

            <div className="max-h-[240px] overflow-y-auto lg:max-h-[268px]">
              {infraNodes.map((node, index) => {
                const active = (hovered || selected) === node.key;
                const relevant = node.division === "both" || node.division === mode;
                return (
                  <button
                    key={node.key}
                    type="button"
                    data-infra-key={node.key}
                    onKeyDown={(event) => {
                      const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
                      if (!step) return;
                      event.preventDefault();
                      const next = infraNodes[(index + step + infraNodes.length) % infraNodes.length];
                      setSelected(next.key);
                      const target = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
                        `[data-infra-key="${next.key}"]`,
                      );
                      target?.focus();
                    }}
                    onMouseEnter={() => setHovered(node.key)}
                    onMouseLeave={() => setHovered("")}
                    onFocus={() => setHovered(node.key)}
                    onBlur={() => setHovered("")}
                    onClick={() => setSelected(node.key)}
                    aria-pressed={selected === node.key}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-line px-4 py-2.5 text-left transition-colors",
                      active ? "bg-white" : "hover:bg-white/60",
                      !relevant && "opacity-45",
                    )}
                  >
                    <span className="text-[0.78rem] text-tech tabular">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[0.86rem] leading-snug text-ink/85">{node.short}</span>
                    <span className="text-[0.72rem] text-tech">
                      {node.division === "telecom" ? "T" : node.division === "signalling" ? "S" : "S+T"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 px-4 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="mb-2 text-[0.76rem] text-tech">
                    {activeNode.division === "both" ? "Both disciplines" : activeNode.division}
                  </p>
                  <h3 className="text-[1.24rem] leading-tight text-eng">{activeNode.label}</h3>
                  <p className="mt-3 text-[0.82rem] leading-relaxed text-muted">{activeNode.purpose}</p>
                  <div className="mt-4 border-t border-line pt-3">
                    <p className="mb-1.5 text-[0.76rem] text-tech">SIG-TEL capability</p>
                    <p className="text-[0.82rem] leading-relaxed text-ink/80">{activeNode.capability}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {activeNode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-line px-2 py-1 text-[0.74rem] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t border-line px-4 py-3">
              <p className="text-[0.8rem] leading-relaxed text-tech">
                {modeMeta[mode].blurb}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
