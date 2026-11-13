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
 <span className="absolute left-3 top-3 flex items-center gap-2 bg-white px-2 py-1.5 text-[0.78rem] text-eng">
          <span
            className={cn(
              "h-[4px] w-[4px] rounded-full",
              project.status === "completed" ? "bg-clear" : "bg-signal",
            )}
          />
          {project.division === "signalling" ? "Signalling" : "Telecom"}
        </span>
        {typeof index === "number" ? (
 <span className="absolute right-3 top-3 bg-white px-2 py-1 text-[0.78rem] text-eng/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <span className="text-[0.8rem] text-muted">{project.client}</span>
        <span className="text-[0.8rem] text-tech">
          {project.status === "completed" ? "Completed" : "In progress"}
        </span>
      </div>
      <h3 className="mt-2 text-[clamp(1.1rem,1.6vw,1.34rem)] leading-[1.15] text-eng transition-colors group-hover:text-ink">
        {project.shortTitle}
      </h3>
      <p className="mt-1.5 text-[0.8rem] text-tech">
        {project.location}, {project.state}
      </p>
    </Link>
  );
}
