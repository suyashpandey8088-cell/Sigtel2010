import { cn } from "@/lib/utils";

/** A slow strip of capability names on a hairline — one line, no chrome. */
export function Ticker({ items, className }: { items: string[]; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden border-y border-line bg-navy py-3.5", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-navy to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-navy to-transparent" />
      <div className="ticker gap-8" aria-hidden>
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8 whitespace-nowrap">
            <span className="whitespace-nowrap text-[0.86rem] text-muted">{item}</span>
            <span className="h-px w-5 bg-line-strong" />
          </span>
        ))}
      </div>
      <p className="sr-only">Capabilities: {items.join(", ")}</p>
    </div>
  );
}
