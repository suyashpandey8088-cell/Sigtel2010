import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark. A three-lamp signal is drawn as a vertical stack of hairlines —
 * read as a signal head and as a technical mark, without a glow.
 */
export function Logo({
  className,
  compact = false,
  tone = "ink",
}: {
  className?: string;
  compact?: boolean;
  tone?: "ink" | "paper";
}) {
  return (
    <Link
      href="/"
      aria-label="SIG-TEL — home"
      className={cn("group flex items-center gap-3", className)}
    >
      <span
        className="relative flex h-[34px] w-[17px] flex-col items-center justify-between py-[3px]"
        aria-hidden
      >
        <span className="h-[6px] w-[6px] rounded-full bg-signal" />
        <span
          className={cn(
            "h-[6px] w-[6px] rounded-full",
            tone === "paper" ? "bg-white/30" : "bg-ink/15",
          )}
        />
        <span className="h-[6px] w-[6px] rounded-full bg-clear" />
        <span
          className={cn(
            "absolute -left-[7px] top-0 h-full w-px",
            tone === "paper" ? "bg-white/30" : "bg-line-strong",
          )}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.22rem] font-semibold tracking-[0.01em]",
            tone === "paper" ? "text-white" : "text-eng",
          )}
        >
          SIG-TEL
        </span>
        {!compact ? (
          <span
            className={cn(
              "mt-[7px] font-mono text-[8px] uppercase tracking-[0.26em]",
              tone === "paper" ? "text-white/60" : "text-muted",
            )}
          >
            Signals &amp; Telecom
          </span>
        ) : null}
      </span>
    </Link>
  );
}
