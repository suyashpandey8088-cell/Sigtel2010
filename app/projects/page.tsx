import type { Metadata } from "next";
import { getStore } from "@/lib/db";
import { PageHero } from "@/components/page/page-hero";
import { ProjectsShowcase } from "@/components/projects/projects-showcase";
import { CtaBand } from "@/components/page/cta-band";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects — Works register",
  description:
    "SIG-TEL's works register: railway signalling and telecom projects for Central Railway, Konkan Railway, BPCL, IOCL and Honeywell — Electronic Interlocking, LC gates, BPAC, CCTV, SDH, IP-MPLS and CAMC.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects · SIG-TEL",
    description: "Completed and ongoing works in railway signalling and telecom networks.",
    images: ["/images/hero-daylight.jpg"],
  },
};

export default async function ProjectsPage() {
  const projects = await getStore().listProjects();
  const completed = projects.filter((project) => project.status === "completed").length;

  return (
    <>
      <PageHero
        index="07"
        eyebrow="Project register"
        title={["WORK ON", "THE GROUND."]}
        description="Completed and ongoing works in railway signalling and in telecom networks for railways, pipelines and industry. Filter by discipline or status, then open a case study for scope, approach and documentation."
        image="/images/hero-daylight.jpg"
        imageAlt="Electrified railway yard with signal gantries and multiple tracks in daylight"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        meta={[
          { label: "Works recorded", value: `${projects.length}` },
          { label: "Completed", value: `${completed}` },
          { label: "Signalling", value: `${projects.filter((p) => p.division === "signalling").length}` },
          { label: "Telecom", value: `${projects.filter((p) => p.division === "telecom").length}` },
        ]}
      />

      <section className="relative border-t border-line bg-navy section-tight">
        <div className="edge">
          <ProjectsShowcase projects={projects} variant="page" />
          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-tech">
              Register as published by SIG-TEL · Client and division stated only where the work is recorded ·
              Photography illustrates the discipline and is not a specific site record.
            </p>
            <p className="label-tight text-tech">Status can change — confirm with our team.</p>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Reference"
        title="Need references for a tender?"
        body="Tell us the type of work and the division. We'll point you to comparable scopes in the register and set up a call with the engineering team."
      />
    </>
  );
}
