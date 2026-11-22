import { cn } from "@/lib/utils";
import { RevealLines, Reveal } from "@/components/ui/reveal";

/**
 * Section heads.
 *
 * The old site used one template — mono index, rule, label, oversized caps
 * headline, narrow paragraph — eleven times over. That repetition is what made
 * the page read as machine-assembled. There are now three distinct devices and
 * no two adjacent sections use the same one:
 *
 *  · `EditorialHead` — the workhorse. A small mark in a narrow left column, the
 *    headline in the wide column, the deck beneath it. Asymmetric.
 *  · `StatementHead` — headline only, set very large, with the deck dropped to
 *    a hanging column on the right. Used at turns in the story.
 *  · `LedgerHead` — a sentence-case line and a count, nothing more, for the
 *    dense register sections where a headline would just be noise.
 */

/** Shared mark: a small sentence-case chapter name. No index digits, no rule. */
function Mark({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mark", className)}>{children}</p>;
}

export function EditorialHead({
  mark,
  title,
  deck,
  className,
  wide = false,
}: {
  mark: string;
  title: string[];
  deck?: string;
  className?: string;
  /** run the headline across the full measure instead of the 8-column bed */
  wide?: boolean;
}) {
  return (
    <div className={cn("grid-edit items-start gap-y-6", className)}>
      <Mark className="lg:pt-3">{mark}</Mark>
      <div className={wide ? "edit-wide" : "edit-body"}>
        <h2 className="text-display-lg text-eng">
          <RevealLines lines={title} />
        </h2>
        {deck ? (
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[46ch] text-[1.02rem] leading-[1.65] text-muted">{deck}</p>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}

export function StatementHead({
  title,
  aside,
  className,
}: {
  title: string[];
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid-edit items-end gap-y-8", className)}>
      <h2 className="edit-wide text-[clamp(2.5rem,6.4vw,6.2rem)] leading-[0.98] tracking-[-0.018em] text-eng">
        <RevealLines lines={title} stagger={0.1} />
      </h2>
      {aside ? (
        <div className="edit-body lg:col-start-9 lg:col-end-13">
          <Reveal delay={0.14}>{aside}</Reveal>
        </div>
      ) : null}
    </div>
  );
}

export function LedgerHead({
  title,
  meta,
  className,
}: {
  title: string;
  meta?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-line pb-4",
        className,
      )}
    >
      <h2 className="text-[1.32rem] font-normal leading-tight text-eng">{title}</h2>
      {meta ? <p className="text-[0.85rem] text-muted tabular">{meta}</p> : null}
    </div>
  );
}
