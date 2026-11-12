"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CapabilityLayer } from "@/lib/content/site";
import { cn } from "@/lib/utils";

export function LayerAccordion({
  layers,
  accent = "signalling",
}: {
  layers: CapabilityLayer[];
  accent?: "signalling" | "telecom";
}) {
  const [open, setOpen] = useState<string>(layers[1]?.level ?? layers[0].level);
  const dot = accent === "telecom" ? "bg-eng" : "bg-signal";

  return (
    <div className="border-t border-line">
      {layers.map((layer) => {
        const isOpen = open === layer.level;
        return (
          <div key={layer.level} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? "" : layer.level)}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-4 py-5 text-left md:gap-6"
            >
              <span className="font-mono text-[10px] tracking-[0.18em] text-tech">{layer.level}</span>
              <span
                className={cn(
                  "h-[5px] w-[5px] rounded-full transition-all duration-300",
                  isOpen ? `${dot} shadow-[0_0_10px_currentColor]` : "bg-ink/20",
                )}
              />
              <span
                className={cn(
                  "flex-1 font-display text-[clamp(1.15rem,2.4vw,1.9rem)] uppercase leading-tight tracking-[-0.02em] transition-colors",
                  isOpen ? "text-ink" : "text-ink/70 group-hover:text-ink",
                )}
              >
                {layer.title}
              </span>
              <span className="hidden max-w-sm text-right text-[0.8rem] leading-relaxed text-tech lg:block">
                {layer.summary}
              </span>
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center border border-line">
                <span className="absolute h-px w-2.5 bg-ink/70" />
                <span
                  className={cn(
                    "absolute h-2.5 w-px bg-ink/70 transition-transform duration-300",
                    isOpen ? "scale-y-0" : "scale-y-100",
                  )}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-8 pb-8 pl-0 md:grid-cols-[1fr_1fr_0.8fr] md:pl-10">
                    <div>
                      <p className="label-tight mb-3 text-tech">What we do</p>
                      <ul className="space-y-2">
                        {layer.what.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[0.86rem] leading-relaxed text-muted">
                            <span className={cn("mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full", dot)} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="label-tight mb-3 text-tech">How we prove it</p>
                      <ul className="space-y-2">
                        {layer.proof.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[0.86rem] leading-relaxed text-muted">
                            <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-ink/30" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-l-0 border-line md:border-l md:pl-6">
                      <p className="label-tight mb-2 text-tech">Where</p>
                      <p className="text-[0.84rem] leading-relaxed text-ink/75">{layer.where}</p>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
