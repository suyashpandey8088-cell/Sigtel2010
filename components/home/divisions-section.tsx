import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

const divisions = [
  {
    id: "DIVISION 01",
    title: "Railway signalling",
    href: "/signalling",
    image: "/images/signalling-hero.jpg",
    alt: "Electronic interlocking equipment racks in a railway relay room",
    lede: "For Indian Railways, private sidings and freight terminals.",
    body: "Electronic and relay interlocking, level crossings, signals and trackside works, protection and cabling, then testing, commissioning and upkeep. Signalling work is delivered inside running stations, where the system cannot stop for the installation.",
    capabilities: [
      "Electronic & relay interlocking",
      "Level-crossing gate automation",
      "Signals, axle counters & track circuits",
      "Earthing, SPD & fire-rated cabling",
      "Testing, commissioning & maintenance",
    ],
    accent: "text-signal",
    bar: "bg-signal",
  },
  {
    id: "DIVISION 02",
    title: "Telecommunications",
    href: "/telecommunications",
    image: "/images/telecom-hero.jpg",
    alt: "Telecommunications tower and fibre cabinet beside a railway line",
    lede: "For railways, oil & gas pipelines and industry.",
    body: "Optical fibre plant, SDH and IP-MPLS transmission, CCTV and security, voice, radio and network monitoring — installed, tested link by link, and then maintained under long-term CAMC along the route.",
    capabilities: [
      "OFC, HDPE duct & splicing",
      "SDH & IP-MPLS transmission",
      "CCTV, access control & PA",
      "EPABX, VHF radio & NMS",
      "Network monitoring & CAMC",
    ],
    accent: "text-eng",
    bar: "bg-eng",
  },
];

export function DivisionsSection() {
  return (
    <section id="capabilities" className="relative border-t border-line bg-navy-800/40">
      <div className="edge py-20 md:py-28">
        <div className="flex flex-col gap-6 pb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label flex items-center gap-3 text-tech">
              <span className="text-eng">05</span>
              <span className="h-px w-8 bg-line-strong" />
              Our core capabilities
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-display-md uppercase leading-[0.94] text-ink">
              Two disciplines,
              <br />
              equal depth.
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
              Railway clients get a signalling contractor that also understands the network behind it. Telecom
              clients get a network contractor that works to railway-grade discipline. Both get one accountable
              team.
            </p>
          </Reveal>
        </div>
      </div>

      {divisions.map((division, index) => (
        <div key={division.title} className="relative border-t border-line">
          <div className={`grid lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Reveal className="relative h-full" y={0}>
              <div className="group relative h-[52vw] max-h-[620px] min-h-[300px] w-full overflow-hidden lg:h-full lg:max-h-none">
                <Image
                  src={division.image}
                  alt={division.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover opacity-80 transition-transform duration-[1400ms] ease-engineering group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/25 to-transparent lg:bg-gradient-to-r lg:from-navy-900/60 lg:via-transparent" />
                <div className="absolute inset-0 grid-blueprint-sm opacity-20" aria-hidden />
                <div className="absolute left-6 top-6 flex items-center gap-3">
                  <span className={`h-[5px] w-[5px] rounded-full ${division.bar}`} />
                  <span className="label-tight text-ink/70">{division.id}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <p className="max-w-xs font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60">
                    {division.lede}
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="relative flex flex-col justify-center gap-8 px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
              <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-20" aria-hidden />
              <div className="relative">
                <h3 className="font-display text-[clamp(1.9rem,4vw,3.6rem)] uppercase leading-none tracking-[-0.03em] text-ink">
                  {division.title}
                </h3>
                <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted">{division.body}</p>
              </div>

              <ul className="relative grid gap-0 border-t border-line">
                {division.capabilities.map((capability, i) => (
                  <li
                    key={capability}
                    className="group flex items-center gap-4 border-b border-line py-3.5 transition-colors hover:bg-ink/[0.02]"
                  >
                    <span className="font-mono text-[9px] tracking-[0.18em] text-tech">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9rem] text-ink/85 transition-transform duration-500 ease-engineering group-hover:translate-x-1">
                      {capability}
                    </span>
                    <span className={`ml-auto h-px w-4 ${division.bar} opacity-40 transition-all duration-500 group-hover:w-8 group-hover:opacity-100`} />
                  </li>
                ))}
              </ul>

              <div className="relative">
                <Magnetic>
                  <Link href={division.href} className="btn" data-cursor-label="Explore">
                    <span>Explore {division.title.toLowerCase()}</span>
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
                      <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
