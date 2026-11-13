import Image from "next/image";
import Link from "next/link";
import { signallingLayers, telecomLayers } from "@/lib/content/site";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

const divisions = [
  {
    index: "01",
    title: "Railway signalling",
    href: "/signalling",
    image: "/images/signalling-daylight.jpg",
    alt: "Four-aspect colour-light signal on a lattice post beside an electrified line, with a relay location box in the foreground",
    lede: "Indian Railways, private sidings, freight terminals.",
    body: "Electronic and relay interlocking, level crossings, signals and trackside works, protection and cabling, then testing, commissioning and upkeep — delivered inside running stations, where the system cannot stop for the installation.",
    layers: signallingLayers,
  },
  {
    index: "02",
    title: "Telecommunications",
    href: "/telecommunications",
    image: "/images/telecom-fibre.jpg",
    alt: "Fibre-optic splicing in a white enclosure with a fusion splicer and blue pigtails",
    lede: "Railways, oil & gas pipelines, industry.",
    body: "Optical fibre plant, SDH and IP-MPLS transmission, CCTV and security, voice, radio and network monitoring — installed and tested link by link, then maintained under long-term CAMC along the route.",
    layers: telecomLayers,
  },
];

/**
 * Chapters 02 and 03 — the two disciplines.
 *
 * One full-bleed photograph per discipline, the name set in the display serif
 * over its own margin, and the five layers as plain numbered lines. No cards,
 * no alternating sticky columns, no coloured dots standing in for meaning.
 */
export function ChapterDisciplines() {
  return (
    <section id="chapter-02" className="bg-navy">
      {divisions.map((division, index) => (
        <article
          key={division.title}
          className={cn("border-t border-line", index === 1 && "bg-white")}
        >
          {/* photograph */}
          <Reveal y={0}>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-800 md:aspect-[21/9]">
              <Image
                src={division.image}
                alt={division.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="edge pb-16 pt-8 md:pb-24 md:pt-10">
            <div className="grid-edit gap-y-8">
              <p className="mark lg:pt-2">
                {division.index} — Discipline
              </p>

              <div className="edit-body">
                <h2 className="text-[clamp(2.2rem,5.4vw,4.6rem)] leading-[1.02] tracking-[-0.018em] text-eng">
                  {division.title}
                </h2>
                <p className="mt-4 text-[0.95rem] text-muted">{division.lede}</p>
                <p className="mt-6 max-w-[52ch] text-[1rem] leading-[1.7] text-ink/85">
                  {division.body}
                </p>

                {/* the five layers, as a numbered ledger */}
                <div className="mt-12">
                  <div className="border-t border-line">
                    {division.layers.map((layer, i) => (
                      <Reveal key={layer.level} delay={i * 0.04}>
                        <Link
                          href={division.href}
                          className="group grid grid-cols-[2rem_1fr] gap-x-5 gap-y-1 border-b border-line py-5 transition-colors hover:bg-navy-800/40 md:grid-cols-[2.5rem_1fr_1.1fr] md:items-baseline"
                          data-cursor-label="Detail"
                        >
                          <span className="text-[0.82rem] text-tech tabular">{layer.level}</span>
                          <span className="text-[1.05rem] leading-snug text-eng">
                            <span className="link-underline">{layer.title}</span>
                          </span>
                          <span className="col-start-2 mt-1 block max-w-[46ch] text-[0.88rem] leading-relaxed text-muted md:col-start-3 md:mt-0">
                            {layer.summary}
                          </span>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                  <p className="mt-5 text-[0.82rem] text-tech">
                    Five layers, one accountable scope — from the duct in the ground
                    to the record a controller signs.
                  </p>
                </div>

                <div className="mt-10">
                  <Magnetic>
                    <Link href={division.href} className="btn" data-cursor-label="Explore">
                      <span>{division.title}</span>
                      <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden>
                        <path d="M0 4.5h12M8.5 1L12 4.5 8.5 8" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
