import Image from "next/image";
import Link from "next/link";
import { signallingLayers, telecomLayers } from "@/lib/content/site";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

const divisions = [
  {
    chapter: "Chapter 02",
    index: "DIVISION 01",
    title: "Railway signalling",
    href: "/signalling",
    image: "/images/signalling-daylight.jpg",
    alt: "Four-aspect colour-light signal on a lattice post beside an electrified line, with a relay location box in the foreground",
    lede: "For Indian Railways, private sidings and freight terminals.",
    body: "Electronic and relay interlocking, level crossings, signals and trackside works, protection and cabling, then testing, commissioning and upkeep. Signalling work is delivered inside running stations, where the system cannot stop for the installation.",
    layers: signallingLayers,
    accent: "signal" as const,
  },
  {
    chapter: "Chapter 03",
    index: "DIVISION 02",
    title: "Telecommunications",
    href: "/telecommunications",
    image: "/images/telecom-fibre.jpg",
    alt: "Fibre-optic splicing in a white enclosure with a fusion splicer and blue pigtails",
    lede: "For railways, oil & gas pipelines and industry.",
    body: "Optical fibre plant, SDH and IP-MPLS transmission, CCTV and security, voice, radio and network monitoring — installed, tested link by link, and then maintained under long-term CAMC along the route.",
    layers: telecomLayers,
    accent: "clear" as const,
  },
];

export function ChapterDisciplines() {
  return (
    <section id="chapter-03" className="relative bg-navy">
      {divisions.map((division, index) => {
        const accentBg = division.accent === "signal" ? "bg-signal" : "bg-clear";
        const accentText = division.accent === "signal" ? "text-signal" : "text-clear";
        return (
          <div
            key={division.title}
            className={cn(
              "relative border-t border-line",
              index % 2 === 0 ? "bg-navy" : "bg-navy-800/60",
            )}
          >
            <div className="edge section">
              <Reveal>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <span className="label-tight flex items-center gap-2.5 text-muted">
                    <span className={cn("h-[5px] w-[5px] rounded-full", accentBg)} />
                    {division.chapter} / {division.index}
                  </span>
                  <span className="label-tight text-tech">{division.lede}</span>
                </div>
              </Reveal>

              <div
                className={cn(
                  "mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16",
                  index % 2 === 1 && "lg:[&>*:first-child]:order-2",
                )}
              >
                {/* the headline column */}
                <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
                  <h2 className="font-display text-[clamp(2.3rem,5.4vw,4.6rem)] uppercase leading-[0.94] tracking-[-0.04em] text-eng">
                    <RevealLines lines={[division.title]} />
                  </h2>
                  <Reveal delay={0.1}>
                    <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed text-muted">{division.body}</p>
                  </Reveal>

                  <Reveal delay={0.15}>
                    <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden bg-navy-700">
                      <Image
                        src={division.image}
                        alt={division.alt}
                        fill
                        sizes="(min-width: 1024px) 46vw, 100vw"
                        className="object-cover transition-transform duration-[1600ms] ease-engineering hover:scale-[1.03]"
                      />
                      <span className="absolute left-3 top-3 flex items-center gap-2 bg-white px-2 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-eng">
                        <span className={cn("h-[4px] w-[4px] rounded-full", accentBg)} />
                        {division.index}
                      </span>
                    </div>
                  </Reveal>

                  <Reveal delay={0.2}>
                    <div className="mt-7">
                      <Magnetic>
                        <Link href={division.href} className="btn" data-cursor-label="Explore">
                          <span>Explore {division.title.toLowerCase()}</span>
                          <svg width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden>
                            <path d="M0 4.5h13M9.5 1L13 4.5 9.5 8" stroke="currentColor" strokeWidth="1.1" />
                          </svg>
                        </Link>
                      </Magnetic>
                    </div>
                  </Reveal>
                </div>

                {/* the layer stack — a measured list, top layer first */}
                <div className="border-t border-line">
                  {division.layers.map((layer, i) => (
                    <Reveal key={layer.level} delay={i * 0.05}>
                      <Link
                        href={division.href}
                        className="group grid grid-cols-[auto_1fr] items-start gap-4 border-b border-line py-5 transition-colors hover:bg-white/70 sm:grid-cols-[auto_1fr_auto] sm:gap-6"
                        data-cursor-label="Detail"
                      >
                        <span className="mt-1 font-mono text-[10px] tracking-[0.16em] text-tech">{layer.level}</span>
                        <span>
                          <span className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "h-[4px] w-[4px] rounded-full transition-transform duration-500 group-hover:scale-150",
                                accentBg,
                              )}
                            />
                            <span className="font-display text-[clamp(1.05rem,1.8vw,1.42rem)] uppercase leading-tight tracking-[-0.015em] text-eng">
                              {layer.title}
                            </span>
                          </span>
                          <span className="mt-2 block max-w-md text-[0.84rem] leading-relaxed text-muted">
                            {layer.summary}
                          </span>
                        </span>
                        <span className="hidden self-center sm:block">
                          <span className={cn("block h-px w-5 transition-all duration-500 group-hover:w-9", accentText)} />
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                  <Reveal>
                    <p className="mt-5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-tech">
                      Five layers, one accountable scope · from the duct in the ground to the record a controller signs
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
