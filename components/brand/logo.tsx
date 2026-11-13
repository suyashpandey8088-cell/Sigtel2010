import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark. A single signal lamp inside a hairline ring — the one piece of
 * drawing left in the chrome. Everything else about the identity is type.
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
        className="relative flex h-[17px] w-[17px] items-center justify-center"
        aria-hidden
      >
        {/* one lamp, held in a hairline ring — the mark, not an illustration */}
        <span
          className={cn(
            "absolute inset-0 rounded-full border",
            tone === "paper" ? "border-white/40" : "border-eng/45",
          )}
        />
        <span className="h-[5px] w-[5px] rounded-full bg-signal" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.16rem] font-medium tracking-[-0.01em]",
            tone === "paper" ? "text-white" : "text-eng",
          )}
        >
          SIG-TEL
        </span>
        {!compact ? (
          <span
            className={cn(
                "mt-[5px] text-[0.74rem]",
              tone === "paper" ? "text-white/60" : "text-muted",
            )}
          >
            Signalling &amp; telecom
          </span>
        ) : null}
      </span>
    </Link>
  );
}
