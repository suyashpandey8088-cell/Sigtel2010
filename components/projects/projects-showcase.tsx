import { ProjectsEditorial } from "@/components/projects/projects-editorial";
import type { Project } from "@/lib/types";

/** The register as an editorial gallery, for interior pages. */
export function ProjectsShowcase({
  projects,
  variant = "home",
}: {
  projects: Project[];
  variant?: "home" | "page";
}) {
  return (
    <div>
      <ProjectsEditorial projects={projects} />
      {variant === "home" ? (
 <p className="mt-10 border-t border-line pt-6 text-[0.8rem] leading-relaxed text-tech">
          Works register as published by SIG-TEL. Images are illustrative of the discipline.
        </p>
      ) : null}
    </div>
  );
}
