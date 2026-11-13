import { cn } from "@/lib/utils";
import { Reveal, RevealLines } from "@/components/ui/reveal";

/**
 * The editorial section head: a mono index, a hairline, a small label, an
 * oversized headline and a measure-limited description. Centred by default
 * because the page is composed on a centred axis.
 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  align = "center",
  className,
  titleClassName,
}: {
  index?: string;
  label: string;
  title: string[];
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Reveal>
        <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
          {index ? <span className="label-index">{index}</span> : null}
          <span className="h-px w-10 bg-line-strong" aria-hidden />
          <span className="label text-muted">{label}</span>
        </div>
      </Reveal>
      <h2
        className={cn(
          "font-display text-display-lg uppercase text-ink",
          titleClassName,
        )}
      >
        <RevealLines lines={title} />
      </h2>
      {description ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "max-w-measure text-[0.98rem] leading-relaxed text-muted",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
