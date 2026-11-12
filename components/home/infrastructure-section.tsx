"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { infraNodes, modeMeta, type InfraMode } from "@/lib/content/infrastructure-3d";
import { LiveSectionStage } from "@/components/home/live-section-stage";
import { cn } from "@/lib/utils";

export function InfrastructureSection() {
  const [mode, setMode] = useState<InfraMode>("signalling");
  const [selected, setSelected] = useState("signal");
  const [hovered, setHovered] = useState("");

  const activeNode = useMemo(
    () => infraNodes.find((node) => node.key === (hovered || selected)) ?? infraNodes[0],
    [hovered, selected],
  );

  return (
    <section id="system-model" className="relative overflow-hidden border-t border-line bg-navy-900 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-25" aria-hidden />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(36,199,139,0.07),transparent_70%)]" aria-hidden />

      <div className="edge relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="label flex items-center gap-3 text-tech">
              <span className="text-eng">04</span>
              <span className="h-px w-8 bg-line-strong" />
              Interactive infrastructure
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-display-md uppercase leading-[0.94] text-ink">
              One live section.
              <br />
              <span className="text-eng">Both disciplines.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted">
              Signalling and telecom working together on a double line: interlocked level crossing, signals,
              fibre, radio, surveillance and the control room that reads them all. Select a component to see
              where SIG-TEL fits.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="label-tight text-tech">Viewing mode</span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(modeMeta) as InfraMode[]).map((key) => {
                const active = mode === key;
                const accent = key === "signalling" ? "bg-signal" : "bg-eng";
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
                      "flex items-center gap-3 border px-4 py-3 text-left transition-all duration-300",
                      active ? "border-ink/40 bg-ink/[0.06]" : "border-line hover:border-ink/25",
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", accent, active ? "shadow-[0_0_12px_currentColor]" : "opacity-30")} />
                    <span className="font-mono text-[9px] uppercase leading-tight tracking-[0.16em] text-ink/85">
                      {key === "signalling" ? "Signalling" : "Telecom"}
                      <br />
                      mode
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_400px]">
          <div className="relative border border-line bg-navy-900/60">
            <LiveSectionStage
              mode={mode}
              selected={selected}
              hovered={hovered}
              onSelect={setSelected}
              onHover={setHovered}
            />
          </div>

          <aside className="flex flex-col border border-line bg-navy-800/50">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="label text-tech">Components</span>
              <span className="font-mono text-[9px] tracking-[0.16em] text-tech">{String(infraNodes.length).padStart(2, "0")}</span>
            </div>

            <div className="max-h-[220px] overflow-y-auto lg:max-h-[248px]">
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
                      active ? "bg-ink/[0.05]" : "hover:bg-ink/[0.02]",
                      !relevant && "opacity-45",
                    )}
                  >
                    <span className="font-mono text-[8.5px] tracking-[0.16em] text-tech">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[0.82rem] leading-tight text-ink/85">{node.short}</span>
                    <span
                      className={cn(
                        "h-[4px] w-[4px] rounded-full",
                        node.division === "telecom" ? "bg-eng" : node.division === "signalling" ? "bg-signal" : "bg-ink/60",
                      )}
                    />
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
                  <p className="label-tight mb-2 text-eng">
                    {activeNode.division === "both" ? "Both disciplines" : activeNode.division}
                  </p>
                  <h3 className="font-display text-lg uppercase leading-tight tracking-[-0.01em] text-ink">
                    {activeNode.label}
                  </h3>
                  <p className="mt-3 text-[0.82rem] leading-relaxed text-muted">{activeNode.purpose}</p>
                  <div className="mt-4 border-t border-line pt-3">
                    <p className="label-tight mb-1.5 text-tech">SIG-TEL capability</p>
                    <p className="text-[0.82rem] leading-relaxed text-ink/80">{activeNode.capability}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {activeNode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-line px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-tech"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t border-line px-4 py-3">
              <p className="font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em] text-tech">
                {modeMeta[mode].blurb}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
