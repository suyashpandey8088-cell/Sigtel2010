import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getStore } from "@/lib/db";
import { PageHero } from "@/components/page/page-hero";
import { LayerAccordion } from "@/components/page/layer-accordion";
import { CtaBand } from "@/components/page/cta-band";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { signallingLayers, whySigtel } from "@/lib/content/site";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Railway Signalling",
  description:
    "Railway signalling engineering by SIG-TEL: Electronic Interlocking, relay interlocking, level crossing gates, signals, axle counters and BPAC, earthing and surge protection, testing, commissioning and maintenance.",
  alternates: { canonical: "/signalling" },
  openGraph: {
    title: "Railway Signalling · SIG-TEL",
    description: "Electronic Interlocking, LC gates, axle counters, earthing and maintenance for Indian Railways.",
    images: ["/images/signalling-daylight.jpg"],
  },
};

const equipment = [
  "Electronic Interlocking",
  "Relay interlocking",
  "4-aspect signals",
  "Point machines",
  "Axle counters / BPAC",
  "Track circuits",
  "LC gate barriers",
  "Location boxes",
  "Surge protection devices",
  "Fire-rated cable channels",
];

export default async function SignallingPage() {
  const projects = (await getStore().listProjects()).filter((project) => project.division === "signalling");

  return (
    <>
      <PageHero
        index="02.1"
        eyebrow="Division 01 — Railway signalling"
        title={["SAFE TO MOVE,", "PROVEN TO", "STOP."]}
        description="Signalling work that has to be right the first time, at stations that cannot stop. Electronic and relay interlocking, level crossings, detection and protection — installed, tested and maintained by our own crews."
        image="/images/signalling-daylight.jpg"
        imageAlt="Four-aspect colour-light signal, location box and cable route in daylight"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Railway signalling" }]}
        meta={[
          { label: "Discipline", value: "Railway signalling" },
          { label: "Clients", value: "Central Rly · Konkan Rly" },
          { label: "Coverage", value: "MH · KA · Goa" },
          { label: "Practice since", value: "2010" },
        ]}
      />

      <section className="relative border-t border-line bg-navy section">
        <div className="edge grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <span className="label text-eng">The discipline</span>
            <h2 className="mt-6 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] uppercase leading-[0.96] tracking-[-0.03em] text-eng">
              A signalling contractor that works inside a live railway.
            </h2>
            <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-muted">
              <p>
                Most of our signalling register is work at working stations: relay-interlocking modifications,
                LC gate interlocking, block proving for doubling and S&amp;T works for new loop lines. The
                system stays in service while it changes — so the engineering has to be sequenced, not just
                designed.
              </p>
              <p>
                We work with the EI supplier on interlocking installation and testing, and we own the parts of
                the job that decide whether it survives: cable routes, terminations, earthing, surge protection
                and the testing records a controller actually signs against.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {whySigtel.slice(0, 4).map((item) => (
                <Reveal key={item.title}>
                  <div className="h-full border-b border-line py-4 pr-4">
                    <p className="font-display text-sm uppercase leading-tight text-eng">{item.title}</p>
                    <p className="mt-2 text-[0.8rem] leading-relaxed text-tech">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line">
              <Image
                src="/images/signalling-daylight.jpg"
                alt="Colour-light signal on a lattice post with a relay location box beside the tracks"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border border-line p-4">
                <p className="label-tight text-tech">Typical scope</p>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-ink/80">
                  Tender → drawings → installation → joint testing → handover → AMC.
                </p>
              </div>
              <div className="border border-line p-4">
                <p className="label-tight text-tech">Documentation</p>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-ink/80">
                  Test reports, as-builts and commissioning records at handover.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 section">
        <div className="edge">
          <SectionHeading
            index="02.2"
            label="Layer by layer"
            title={["The signalling stack."]}
            description="Five layers, from the protection at the bottom to the testing and upkeep at the top. Select a layer to see what we do, how we prove it and where it has been applied."
            className="pb-10"
          />
          <LayerAccordion layers={signallingLayers} accent="signalling" />
        </div>
      </section>

      <section className="relative border-t border-line bg-navy section-tight">
        <div className="edge grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="label text-eng">Plant &amp; equipment</span>
            <h2 className="mt-5 font-display text-[clamp(1.7rem,3vw,2.6rem)] uppercase leading-[0.98] tracking-[-0.03em] text-eng">
              What we install and prove.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Equipment is supplied to the Railway's approved make and inspected before installation. Where a
              supplier's system requires it, we install and test with their engineers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
            {equipment.map((item, index) => (
              <div key={item} className="bg-navy p-4">
                <span className="font-mono text-[8px] tracking-[0.16em] text-tech">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-[0.8rem] leading-snug text-ink/85">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 section">
        <div className="edge">
          <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
            <SectionHeading index="02.3" label="Signalling works" title={["On the ground."]} />
            <Magnetic>
              <Link href="/projects" className="btn" data-cursor-label="All work">
                <span>All projects</span>
              </Link>
            </Magnetic>
          </div>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Signalling enquiry"
        title="Tender, siding or a circuit that needs to change?"
        body="Send the tender reference, drawings or the station details. Our signalling team will come back with the questions we need answered to quote."
      />
    </>
  );
}
