import { cn } from "@/lib/utils";

/** A slow technical ticker of capability names, on a hairline rail. */
export function Ticker({ items, className }: { items: string[]; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden border-y border-line bg-white py-3.5", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <div className="ticker gap-8" aria-hidden>
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8 whitespace-nowrap">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-muted">{item}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-signal/60" />
          </span>
        ))}
      </div>
      <p className="sr-only">Capabilities: {items.join(", ")}</p>
    </div>
  );
}
