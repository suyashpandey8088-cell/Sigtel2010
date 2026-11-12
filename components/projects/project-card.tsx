import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  size = "standard",
  index,
}: {
  project: Project;
  size?: "standard" | "feature" | "tall";
  index?: number;
}) {
  const height =
    size === "feature"
      ? "min-h-[62vh] md:min-h-[74vh]"
      : size === "tall"
        ? "min-h-[440px] md:min-h-[620px]"
        : "min-h-[340px] md:min-h-[420px]";

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor-label="Case study"
      className={cn(
        "theme-night group relative flex flex-col overflow-hidden border border-line bg-navy-800",
        height,
      )}
    >
      <Image
        src={project.images[0]}
        alt={project.shortTitle}
        fill
        sizes={size === "feature" ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
        className="object-cover opacity-70 transition-all duration-[1400ms] ease-engineering group-hover:scale-[1.04] group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/45 to-navy-900/10" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(36,199,139,0.14),transparent_70%)]" />

      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-ink/15 bg-navy-900/50 px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-ink/80 backdrop-blur-sm">
              {project.division === "signalling" ? "Signalling" : "Telecom"}
            </span>
            <span className="flex items-center gap-1.5 border border-ink/10 bg-navy-900/50 px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-ink/60 backdrop-blur-sm">
              <span
                className={cn(
                  "h-[4px] w-[4px] rounded-full",
                  project.status === "completed" ? "bg-eng" : "bg-signal animate-blink",
                )}
              />
              {project.status === "completed" ? "Completed" : "Ongoing"}
            </span>
          </div>
          {typeof index === "number" ? (
            <span className="font-mono text-[9px] tracking-[0.2em] text-ink/40">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
        </div>

        <div>
          <p className="label-tight mb-2 text-eng">{project.client}</p>
          <h3
            className={cn(
              "font-display uppercase tracking-[-0.02em] text-ink",
              size === "feature" ? "text-[clamp(1.6rem,3.4vw,3.1rem)] leading-[0.98]" : "text-[clamp(1.15rem,1.6vw,1.6rem)] leading-[1.06]",
            )}
          >
            {project.shortTitle}
          </h3>
          <div className="mt-4 flex items-end justify-between gap-4 border-t border-ink/10 pt-4">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink/55">
              {project.location} · {project.state}
            </p>
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/70 transition-all duration-500 group-hover:text-eng">
              <span className="hidden sm:inline">Case study</span>
              <span className="flex h-6 w-6 items-center justify-center border border-ink/20 transition-colors duration-500 group-hover:border-eng group-hover:bg-eng group-hover:text-navy-900">
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden>
                  <path d="M0 4h9M6 1l3 3-3 3" stroke="currentColor" strokeWidth="1" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
