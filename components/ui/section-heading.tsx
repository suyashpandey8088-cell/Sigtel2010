import { cn } from "@/lib/utils";
import { Reveal, RevealLines } from "@/components/ui/reveal";

export function SectionHeading({
  index,
  label,
  title,
  description,
  align = "left",
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
    <div className={cn("flex flex-col gap-6", align === "center" && "items-center text-center", className)}>
      <Reveal>
        <div className={cn("flex items-center gap-4", align === "center" && "justify-center")}>
          {index ? <span className="label-tight text-eng">{index}</span> : null}
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          <span className="label text-tech">{label}</span>
        </div>
      </Reveal>
      <h2 className={cn("font-display text-display-md uppercase text-ink", titleClassName)}>
        <RevealLines lines={title} />
      </h2>
      {description ? (
        <Reveal delay={0.15}>
          <p className={cn("max-w-2xl text-[0.98rem] leading-relaxed text-muted", align === "center" && "mx-auto")}>
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
