import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A project entry for interior pages. Photograph on top, type underneath,
 * hairline rules between — the same unit the home gallery uses, so a case study
 * looks like it belongs to the register.
 */
export function ProjectCard({
  project,
  index,
  size = "standard",
}: {
  project: Project;
  index?: number;
  size?: "standard" | "wide";
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block" data-cursor-label="Case study">
      <div
        className={cn(
          "relative w-full overflow-hidden bg-navy-800",
          size === "wide" ? "aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={project.images[0]}
          alt={project.shortTitle}
          fill
          sizes={size === "wide" ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 32vw, 100vw"}
          className="object-cover transition-transform duration-[1600ms] ease-engineering group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 flex items-center gap-2 bg-white px-2 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-eng">
          <span
            className={cn(
              "h-[4px] w-[4px] rounded-full",
              project.status === "completed" ? "bg-clear" : "bg-signal",
            )}
          />
          {project.division === "signalling" ? "Signalling" : "Telecom"}
        </span>
        {typeof index === "number" ? (
          <span className="absolute right-3 top-3 bg-white px-2 py-1 font-mono text-[8px] tracking-[0.14em] text-eng/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <span className="label-tight text-signal">{project.client}</span>
        <span className="label-tight text-tech">{project.status === "completed" ? "Completed" : "Ongoing"}</span>
      </div>
      <h3 className="mt-3 font-display text-[clamp(1.1rem,1.7vw,1.4rem)] uppercase leading-[1.1] tracking-[-0.02em] text-eng transition-colors group-hover:text-ink">
        {project.shortTitle}
      </h3>
      <div className="mt-3 flex items-center justify-between gap-4 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-muted">
          {project.location} · {project.state}
        </p>
        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden className="shrink-0 text-eng/40 transition-colors group-hover:text-signal">
          <path d="M0 4.5h12M8.5 1L12 4.5 8.5 8" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </Link>
  );
}
