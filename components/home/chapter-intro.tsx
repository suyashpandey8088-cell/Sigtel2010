import Link from "next/link";
import { company, credentials } from "@/lib/content/site";
import { Reveal, RevealLines, ScrollWords } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";

/**
 * Chapter 01 — the opening statement. A centred editorial spread: a mono
 * chapter index, one oversized statement, a scroll-lit paragraph, and the
 * company's verified facts as a hairline table rather than cards.
 */
export function ChapterIntro() {
  return (
    <section id="chapter-01" className="relative overflow-hidden bg-navy">
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-40" aria-hidden />

      <div className="edge section relative">
        <Reveal>
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="label-index">Chapter 01 / Railway infrastructure</span>
            <span className="h-8 w-px bg-line-strong" aria-hidden />
          </div>
        </Reveal>

        <div className="mx-auto mt-10 max-w-[74rem] text-center">
          <h2 className="font-display text-[clamp(1.85rem,4.6vw,4.15rem)] uppercase leading-[1.02] tracking-[-0.035em] text-eng">
            <RevealLines
              lines={[
                "SIGNALLING AND TELECOM",
                "SPECIALISTS SINCE 2010 —",
                "ONE TEAM, FROM SURVEY",
                "TO YEARS OF MAINTENANCE.",
              ]}
              stagger={0.075}
            />
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-[48rem]">
          <ScrollWords
            className="text-center text-[clamp(1.02rem,1.5vw,1.28rem)] leading-[1.65]"
            text="Sigtel Signal & Telecommunication Pvt Ltd works in two disciplines with equal depth: railway signalling for Indian Railways, private sidings and freight terminals, and telecom networks for railways, oil & gas pipelines and industry. We keep what we build running through long-term maintenance."
          />
          <Reveal delay={0.2}>
            <div className="mt-8 flex justify-center">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-eng"
                data-cursor-label="About"
              >
                <span className="link-underline">The company</span>
                <span className="h-px w-8 bg-signal transition-all duration-500 group-hover:w-12" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* verified facts as a measured table */}
        <div className="mt-16 grid border-y border-line md:mt-24 md:grid-cols-4">
          {credentials.map((item, index) => (
            <Reveal
              key={item.label}
              delay={index * 0.07}
              className={`relative px-2 py-7 md:px-7 md:py-9 ${
                index !== 0 ? "border-t border-line md:border-l md:border-t-0" : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-none tracking-[-0.04em] text-eng">
                  <Counter value={item.value} suffix={item.suffix} />
                  {item.label === "Incorporated" ? null : <span className="text-signal">.</span>}
                </p>
                <span className="label-tight text-[8.5px] text-tech">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-4 label-tight text-eng/80">{item.label}</p>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted">{item.detail}</p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-6 flex flex-col gap-2 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <p className="label-tight text-tech">
              Office: Belapur Railway Station Building, CBD Belapur, Navi Mumbai
            </p>
            <p className="label-tight text-tech">
              GSTIN {company.gstin} · {company.hours}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
