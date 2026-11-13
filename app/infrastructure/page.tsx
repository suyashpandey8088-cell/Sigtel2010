import type { Metadata } from "next";
import { getStore } from "@/lib/db";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { IndiaMap } from "@/components/home/india-map";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { infrastructure, processStages as process, states } from "@/lib/content/site";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Infrastructure & Capabilities",
  description:
    "SIG-TEL's engineering plant and delivery capability: interlocking and control, trackside equipment, earthing and protection, transmission and networking, surveillance and voice, testing and maintenance.",
  alternates: { canonical: "/infrastructure" },
  openGraph: {
    title: "Infrastructure & Capabilities · SIG-TEL",
    description: "Plant, process and proof behind railway signalling and telecom delivery.",
    images: ["/images/installation-works.jpg"],
  },
};

const proof = [
  "Joint commissioning records signed with client engineers",
  "Circuit and function test reports against approved drawings",
  "OTDR traces and splice loss records for every fibre link",
  "Earth-resistance readings for every earthing pit",
  "As-built drawings reflecting the installed system",
  "SPD installation and fire-rating documentation",
  "Network configuration and NMS baselines",
  "Fault logs and maintenance visit records under AMC / CAMC",
];

export default async function InfrastructurePage() {
  const projects = await getStore().listProjects();

  return (
    <>
      <PageHero
        index="04"
        eyebrow="Infrastructure & capabilities"
        title={["PLANT, PROCESS", "AND PROOF."]}
        description="What we physically deliver, how we sequence it, and the evidence we hand over. The three are not separate in our work: a system that cannot be proven is not commissioned."
        image="/images/installation-works.jpg"
        imageAlt="Crews installing signalling cable in troughing along a rail corridor in daylight"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Infrastructure" }]}
        meta={[
          { label: "Disciplines", value: "Signalling · Telecom" },
          { label: "Base", value: "Navi Mumbai" },
          { label: "Coverage", value: "5 states" },
          { label: "Since", value: "2010" },
        ]}
      />

      <section className="relative border-t border-line bg-navy section">
        <div className="edge">
          <SectionHeading
            index="04.1"
            label="Capability map"
            title={["Six areas of plant", "and capability."]}
            description="Each area is staffed by our own crews, with site in-charges and technicians on the company's rolls."
            className="pb-12"
          />
          <div className="grid border-t border-line md:grid-cols-2 lg:grid-cols-3">
            {infrastructure.map((area, index) => (
              <div key={area.title} className="group relative border-b border-line py-6 pr-6 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="label-tight text-signal">{area.tag}</span>
                  <span className="font-mono text-[9px] tracking-[0.16em] text-tech">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 font-display text-xl uppercase leading-tight tracking-[-0.02em] text-eng">{area.title}</h3>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">{area.body}</p>
                <ul className="mt-5 space-y-1.5 border-t border-line pt-4">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[0.8rem] text-ink/70">
                      <span className="h-[3px] w-[3px] rounded-full bg-signal/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 section">
        <div className="edge grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="label text-muted">04.2 — Proof at handover</span>
            <h2 className="mt-6 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] uppercase leading-[0.96] tracking-[-0.03em] text-eng">
              Documentation is part of the system.
            </h2>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
              Indian Railways and pipeline operators sign against evidence. Every job closes with a document
              set — not a verbal handover. It is also what makes later maintenance possible without guesswork.
            </p>
            <div className="mt-8 border-t border-line pt-4">
              <p className="label-tight mb-2 text-signal">Typical handover pack</p>
              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-ink/75">
                Test reports · OTDR traces · as-builts · earth readings · SPD records · commissioning minutes
              </p>
            </div>
          </div>

          <ul className="grid border-t border-line sm:grid-cols-2">
            {proof.map((item, index) => (
              <li key={item} className="border-b border-line py-5 pr-5">
                <span className="font-mono text-[8.5px] tracking-[0.16em] text-signal">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-ink/80">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy section">
        <div className="edge">
          <SectionHeading
            index="04.3"
            label="Delivery model"
            title={["Six stages,", "one accountable team."]}
            description="The same sequence runs a loop-line signalling job and a pipeline telecom network."
            className="pb-12"
          />
          <div className="grid border-t border-line md:grid-cols-3 lg:grid-cols-6">
            {process.map((stage) => (
              <div key={stage.step} className="border-b border-line py-6 pr-4">
                <span className="font-display text-3xl leading-none text-eng/20">{stage.step}</span>
                <h3 className="mt-4 font-display text-sm uppercase leading-tight text-eng">{stage.title}</h3>
                <p className="mt-2 text-[0.76rem] leading-relaxed text-tech">{stage.output}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 section">
        <div className="edge">
          <SectionHeading
            index="04.4"
            label="Presence"
            title={["Where the plant is deployed."]}
            description="Works locations by state. Select a marker or state to see the discipline and scope recorded there."
            className="pb-10"
          />
          <IndiaMap projects={projects} />

          <div className="mt-12 grid border-t border-line sm:grid-cols-2 lg:grid-cols-5">
            {states.map((state) => (
              <Reveal key={state.name} className="border-b border-line py-5 pr-5">
                <p className="font-display text-lg uppercase leading-tight text-eng">{state.name}</p>
                <p className="mt-2 text-[0.76rem] leading-relaxed text-tech">{state.sites}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Capability enquiry"
        title="Need a capability statement or pre-qualification pack?"
        body="Tell us which discipline and scope you are qualifying. We'll send the relevant capability summary and comparable works from the register."
      />
    </>
  );
}
