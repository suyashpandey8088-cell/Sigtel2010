import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="SIG-TEL — home" className={cn("group flex items-center gap-3", className)}>
      <span className="relative flex h-9 w-[22px] flex-col items-center justify-center gap-[3px]" aria-hidden>
        <span className="h-[6px] w-[6px] rounded-full bg-signal shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
        <span className="h-[6px] w-[6px] rounded-full bg-ink/20" />
        <span className="h-[6px] w-[6px] rounded-full bg-eng shadow-[0_0_10px_rgba(36,199,139,0.9)]" />
        <span className="absolute -left-[7px] top-0 h-full w-px bg-line-strong" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-semibold tracking-[0.02em] text-ink">
          SIG<span className="text-eng">-</span>TEL
        </span>
        {!compact ? (
          <span className="mt-[6px] font-mono text-[8px] uppercase tracking-[0.28em] text-tech">
            Signalling / Telecom
          </span>
        ) : null}
      </span>
    </Link>
  );
}
