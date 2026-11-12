import type { Metadata } from "next";
import { getStore } from "@/lib/db";
import { IntroSequence } from "@/components/home/intro-sequence";
import { Hero } from "@/components/home/hero";
import { IdentitySection } from "@/components/home/identity-section";
import { InfrastructureSection } from "@/components/home/infrastructure-section";
import { DivisionsSection } from "@/components/home/divisions-section";
import { ProcessSection } from "@/components/home/process-section";
import { ProjectsShowcase } from "@/components/projects/projects-showcase";
import { IndiaMap } from "@/components/home/india-map";
import { CredentialsSection } from "@/components/home/credentials-section";
import { AboutPreview } from "@/components/home/about-preview";
import { FinalCta } from "@/components/home/final-cta";
import { Ticker } from "@/components/ui/ticker";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "SIG-TEL — Engineering the systems that keep India moving",
  description:
    "Integrated railway signalling and telecommunications engineering: Electronic Interlocking, level crossings, axle counters, earthing, IP-MPLS, SDH, OFC, CCTV and long-term maintenance. Incorporated 2010, Navi Mumbai.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const projects = await getStore().listProjects();

  return (
    <>
      <IntroSequence />
      <Hero />

      <Ticker
        items={[
          "Electronic Interlocking",
          "Level-crossing gates",
          "Axle counters & BPAC",
          "Track circuits",
          "Point machines",
          "Earthing & surge protection",
          "IP-MPLS",
          "SDH transmission",
          "OFC & HDPE duct",
          "IP CCTV",
          "EPABX & VHF radio",
          "NMS & CAMC",
        ]}
      />

      <IdentitySection />
      <InfrastructureSection />
      <DivisionsSection />
      <ProcessSection />

      <section id="projects" className="relative border-t border-line bg-navy py-20 md:py-28">
        <div className="edge">
          <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              index="07"
              label="Project showcase"
              title={["Work on the ground."]}
              description="Completed and ongoing works in railway signalling and in telecom networks for railways, pipelines and industry."
            />
            <Reveal delay={0.1}>
              <div className="flex items-center gap-4 border border-line px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-eng shadow-[0_0_10px_rgba(36,199,139,0.8)]" />
                <p className="label-tight text-[8.5px] leading-tight text-tech">
                  {projects.length} works recorded
                  <br />
                  {projects.filter((project) => project.status === "completed").length} completed ·{" "}
                  {projects.filter((project) => project.status === "ongoing").length} ongoing
                </p>
              </div>
            </Reveal>
          </div>
          <ProjectsShowcase projects={projects} variant="home" />
        </div>
      </section>

      <section id="presence" className="relative border-t border-line bg-navy-800/40 py-20 md:py-28">
        <div className="edge">
          <SectionHeading
            index="08"
            label="Our presence across India"
            title={["Where our crews", "work, state by state."]}
            description="Maharashtra, Goa, Karnataka, Madhya Pradesh and Uttar Pradesh. Select a state or a marker to see the published works in that location."
            className="pb-10"
          />
          <IndiaMap projects={projects} />
        </div>
      </section>

      <CredentialsSection />
      <AboutPreview />
      <FinalCta />
    </>
  );
}
