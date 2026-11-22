import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getStore } from "@/lib/db";
import { PageHero } from "@/components/page/page-hero";
import { LayerAccordion } from "@/components/page/layer-accordion";
import { CtaBand } from "@/components/page/cta-band";
import { ProjectCard } from "@/components/projects/project-card";
import { EditorialHead, LedgerHead } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { telecomLayers } from "@/lib/content/site";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Telecommunications",
  description:
    "Telecom network engineering by SIG-TEL: OFC and HDPE duct, SDH and IP-MPLS transmission, CCTV and access control, EPABX, VHF radio, NMS and long-term CAMC for railways, pipelines and industry.",
  alternates: { canonical: "/telecommunications" },
  openGraph: {
    title: "Telecommunications · SIG-TEL",
    description: "OFC, IP-MPLS, SDH, CCTV, EPABX, radio and NMS — built and maintained along the route.",
    images: ["/images/telecom-fibre.jpg"],
  },
};

const stack = [
  { label: "Field", items: ["HDPE duct", "Fibre blowing", "Splicing & OTDR", "Cable plant"] },
  { label: "Transport", items: ["SDH nodes", "Ring protection", "IP-MPLS routers", "SDH → MPLS migration"] },
  { label: "Access", items: ["EPABX", "VHF radio", "Audio conferencing", "PA systems"] },
  { label: "Security", items: ["IP CCTV", "NVR recording", "Access control", "Tunnel coverage"] },
  { label: "Operations", items: ["NMS", "Fault response", "Card-level repair", "CAMC"] },
];

export default async function TelecomPage() {
  const projects = (await getStore().listProjects()).filter((project) => project.division === "telecom");

  return (
    <>
      <PageHero
        title={["NETWORKS THAT", "STAY UP WHEN", "IT MATTERS."]}
        description="Optical fibre, transmission, surveillance and voice for railways, oil & gas pipelines and industry — installed link by link, proven with OTDR traces and network tests, then maintained under long-term CAMC."
        image="/images/telecom-fibre.jpg"
        imageAlt="Fibre-optic splicing and testing in a light telecom enclosure"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Telecommunications" }]}
        meta={[
          { label: "Discipline", value: "Telecom networks" },
          { label: "Sectors", value: "Rail · Pipelines · Industry" },
          { label: "Clients", value: "BPCL · IOCL · BSNL" },
          { label: "Practice since", value: "2010" },
        ]}
      />

      <section className="relative border-t border-line bg-navy section">
        <div className="edge grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <span className="text-[0.86rem] text-eng">The discipline</span>
 <h2 className="mt-6 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.0] tracking-[-0.016em] text-eng">
              The network behind the railway — and the pipeline.
            </h2>
            <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-muted">
              <p>
                Signalling depends on telecom, and pipeline operations depend on both. We build the layer that
                carries control, voice and video: duct and fibre, SDH and IP-MPLS transmission, CCTV, EPABX and
                radio — then we monitor and maintain it along the route.
              </p>
              <p>
                Every link is handed over with evidence: OTDR traces for fibre, ring and link test reports for
                transmission, recording and coverage checks for CCTV, and configuration records for the network.
              </p>
            </div>

            <div className="mt-8 grid border-t border-line sm:grid-cols-2">
              {[
                { title: "Railway-grade discipline", body: "Work planned around traffic blocks and pipeline operations." },
                { title: "Single accountable team", body: "Fibre, transmission, security and voice under one contract." },
                { title: "Long-term upkeep", body: "AMC and CAMC with fault records and card-level repair." },
                { title: "Proof at handover", body: "OTDR, link tests, as-builts and configuration records." },
              ].map((item) => (
                <Reveal key={item.title}>
                  <div className="h-full border-b border-line py-4 pr-4">
 <p className="text-sm leading-tight text-eng">{item.title}</p>
                    <p className="mt-2 text-[0.8rem] leading-relaxed text-tech">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-800">
              <Image
                src="/images/radio-mast.jpg"
                alt="Telecom lattice tower with microwave dish antennae in daylight"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 border-t border-line">
              <p className="py-3 text-[0.84rem] text-tech">Network stack</p>
              <div className="divide-y divide-line border-t border-line">
                {stack.map((row) => (
                  <div key={row.label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
 <span className="w-16 shrink-0 text-[0.78rem] text-signal">
                      {row.label}
                    </span>
                    <span className="flex-1 text-[0.8rem] leading-relaxed text-ink/75">{row.items.join(" · ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 section">
        <div className="edge">
          <EditorialHead
            mark="Layer by layer"
            title={["The telecom stack."]}
            deck="From the duct in the ground to the monitoring platform in the control room. Select a layer to see the scope and the evidence we hand over."
            className="pb-10"
          />
          <LayerAccordion layers={telecomLayers} accent="telecom" />
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 section">
        <div className="edge">
          <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
            <LedgerHead
              title="Networks in service"
              meta="Selected from the register"
              className="w-full md:w-auto md:flex-1"
            />
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
        title="A route to connect, a network to maintain?"
        body="Share the route, the stations or the pipeline section. We'll come back with the survey questions and the documentation we would hand over."
      />
    </>
  );
}
