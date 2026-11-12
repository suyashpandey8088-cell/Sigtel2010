import { cn } from "@/lib/utils";

export function Ticker({ items, className }: { items: string[]; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden border-y border-line bg-navy-900 py-3", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-navy-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-navy-900 to-transparent" />
      <div className="ticker gap-8" aria-hidden>
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8 whitespace-nowrap">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.24em] text-tech">{item}</span>
            <span className="h-[3px] w-[3px] rounded-full bg-eng/60" />
          </span>
        ))}
      </div>
      <p className="sr-only">
        Capabilities: {items.join(", ")}
      </p>
    </div>
  );
}
