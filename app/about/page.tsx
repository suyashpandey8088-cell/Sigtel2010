import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page/page-hero";
import { CtaBand } from "@/components/page/cta-band";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { company, clientGroups, whySigtel, states, credentials } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "About SIG-TEL",
  description:
    "Sigtel Signal & Telecommunication Pvt Ltd was incorporated in 2010 in Navi Mumbai. Signalling and telecom specialists working for Indian Railways, pipeline operators and industry, with in-house crews and long-term maintenance.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About SIG-TEL",
    description: "Signalling and telecom specialists since 2010 — one accountable engineering team.",
    images: ["/images/engineering-survey.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="10"
        eyebrow="About SIG-TEL"
        title={["SMALL ENOUGH", "TO ANSWER THE", "PHONE."]}
        description="Incorporated in 2010, operating from inside the Belapur Railway Station building in Navi Mumbai. Two disciplines with equal depth, one team accountable for what it builds."
        image="/images/engineering-survey.jpg"
        imageAlt="Engineers reviewing signalling drawings beside a railway track in daylight"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        meta={[
          { label: "Incorporated", value: "2010" },
          { label: "Head office", value: "Navi Mumbai" },
          { label: "Disciplines", value: "S&T · Telecom" },
          { label: "States", value: "MH · GA · KA · MP · UP" },
        ]}
      />

      <section className="relative border-t border-line bg-navy section">
        <div className="edge grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <span className="label text-muted">The company</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.6rem)] uppercase leading-[0.94] tracking-[-0.035em] text-eng">
              <RevealLines
                lines={["Built on two", "critical systems", "and one habit:"]}
              />
              <span className="mt-2 block text-signal">we stay.</span>
            </h2>

            <div className="mt-8 space-y-5 text-[0.97rem] leading-relaxed text-muted">
              <Reveal>
                <p>
                  {company.legalName} was incorporated in 2010 and has worked in railway signalling and
                  telecommunications since then. The office is not in a corporate park: it is inside the
                  Belapur Railway Station building, in CBD Belapur, Navi Mumbai — a reminder that the systems
                  we build sit beside running lines.
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <p>
                  Our register runs from relay-interlocking circuit modifications at working stations and
                  level-crossing gate interlocking, through block proving by axle counter for doubling and
                  S&amp;T works for new loop lines, to pipeline telecom networks carrying voice, video and
                  monitoring across states.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <p>
                  What connects that work is a method: survey, engineer, supply, install, test, hand over and
                  maintain. We keep our own site crews and site in-charges, so the people who commission a
                  system are the people who answer for it later.
                </p>
              </Reveal>
            </div>

            <div className="mt-10 grid border-t border-line sm:grid-cols-3">
              {credentials.slice(0, 3).map((item) => (
                <div key={item.label} className="border-b border-line py-5 pr-4 sm:border-b-0">
                  <p className="font-display text-3xl leading-none text-eng">{item.value}</p>
                  <p className="mt-3 label-tight text-tech">{item.label}</p>
                  <p className="mt-1 text-[0.72rem] leading-relaxed text-tech">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-line bg-navy-800">
              <Image
                src="/images/control-room.jpg"
                alt="A bright signalling control room with a track diagram panel and daylight through tall windows"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="border-t border-line pt-5">
              <p className="label-tight text-signal">Field note</p>
              <p className="mt-2 font-display text-xl uppercase leading-[1.15] tracking-[-0.02em] text-eng">
                “A signalling change is only finished when the controller can work the station without
                thinking about it.”
              </p>
            </div>

            <div className="border border-line bg-white p-6">
              <p className="label mb-4 text-muted">Office &amp; registered office</p>
              <p className="text-sm leading-relaxed text-muted">{company.address.office}</p>
              <p className="mt-4 label-tight text-tech">Regd. office</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{company.address.regd}</p>
              <div className="mt-5 grid gap-2 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/75">
                <a href={company.phone.primaryHref} className="hover:text-eng">{company.phone.primary}</a>
                <a href={company.phone.landlineHref} className="hover:text-eng">{company.phone.landline}</a>
                <a href={`mailto:${company.email}`} className="hover:text-eng">{company.email}</a>
                <span className="text-tech">GSTIN {company.gstin}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 section">
        <div className="edge">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="label text-eng">How we work</span>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,3rem)] uppercase leading-[0.96] tracking-[-0.03em] text-eng">
                Engineering discipline is the product.
              </h2>
            </div>
            <div className="grid border-t border-line sm:grid-cols-2">
              {whySigtel.map((item, index) => (
                <Reveal key={item.title} className="border-b border-line py-6 pr-6">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-signal">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-lg uppercase leading-tight text-eng">{item.title}</h3>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{item.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy section">
        <div className="edge">
          <div className="flex flex-col gap-6 pb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="label text-eng">Industries we serve</span>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,3rem)] uppercase leading-[0.96] tracking-[-0.03em] text-eng">
                Where our systems keep things moving.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Railways, pipelines and networks that cannot stop. Each gets the same team, the same testing
              discipline and the same after-sales care.
            </p>
          </div>

          <div className="grid border-t border-line md:grid-cols-2 lg:grid-cols-5">
            {clientGroups.map((group) => (
              <div key={group.title} className="group flex flex-col justify-between border-b border-line py-6 pr-5 transition-colors">
                <div>
                  <p className="label-tight text-signal">{group.tag}</p>
                  <h3 className="mt-4 font-display text-lg uppercase leading-tight text-eng">{group.title}</h3>
                  <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{group.body}</p>
                </div>
                <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-tech">
                  {group.names}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {states.map((state) => (
              <div key={state.name}>
                <p className="font-display text-base uppercase text-eng">{state.name}</p>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-tech">{state.sites}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 py-16">
        <div className="edge flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="label text-tech">A note on this website</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Company information, client relationships and the works register published here are drawn from
              SIG-TEL&apos;s own published material. No certifications, approvals, project values or statistics have
              been added. Photography is licensed for illustration and does not depict specific sites. Where a
              detail matters to a tender, ask us and we will confirm it in writing.
            </p>
          </div>
          <Magnetic>
            <Link href="/contact" className="btn" data-cursor-label="Contact">
              <span>Contact the team</span>
            </Link>
          </Magnetic>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
