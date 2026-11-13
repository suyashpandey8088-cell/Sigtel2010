import type { Metadata } from "next";
import { getStore } from "@/lib/db";
import { Hero } from "@/components/home/hero";
import { ChapterIntro } from "@/components/home/chapter-intro";
import { PlateSection } from "@/components/home/plate-section";
import { ChapterDisciplines } from "@/components/home/chapter-disciplines";
import { ChapterProcess } from "@/components/home/chapter-process";
import { ChapterPresence } from "@/components/home/chapter-presence";
import { ChapterCompany } from "@/components/home/chapter-company";
import { FinalCta } from "@/components/home/final-cta";
import { ProjectsEditorial } from "@/components/projects/projects-editorial";
import { RevealPlate } from "@/components/home/chapter-gallery";
import { Ticker } from "@/components/ui/ticker";
import { SectionHeading } from "@/components/ui/section-heading";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "SIG-TEL — Engineering the networks that keep railways moving",
  description:
    "Integrated railway signalling and telecommunications engineering: Electronic Interlocking, level crossings, axle counters, earthing, IP-MPLS, SDH, OFC, CCTV and long-term maintenance. Incorporated 2010, Navi Mumbai.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const projects = await getStore().listProjects();

  return (
    <>
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

      <ChapterIntro />

      {/* a full-bleed photograph between chapters — the camera holds, then moves on */}
      <RevealPlate
        src="/images/installation-works.jpg"
        alt="Crews pulling signalling cable through concrete troughing alongside railway tracks in daylight"
        eyebrow="Fig. 02 — Cable route, working section"
        lines={["THE WORK HAPPENS", "WHERE THE SYSTEM", "CANNOT STOP."]}
      />

      <PlateSection />
      <ChapterDisciplines />
      <ChapterProcess />

      {/* project register as gallery */}
      <section id="projects" className="relative border-t border-line bg-white">
        <div className="edge section">
          <SectionHeading
            index="Chapter 05"
            label="Works register"
            title={["WORK ON THE GROUND."]}
            description="Completed and ongoing works in railway signalling and in telecom networks for railways, pipelines and industry. Filter by discipline or status, then open a case study for scope, approach and documentation."
            align="left"
            className="items-start pb-10 text-left"
          />
          <ProjectsEditorial projects={projects} />
        </div>
      </section>

      <ChapterPresence projects={projects} />
      <ChapterCompany />
      <FinalCta />
    </>
  );
}
