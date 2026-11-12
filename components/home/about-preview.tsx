import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/content/site";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

export function AboutPreview() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-navy-800/40">
      <div className="grid lg:grid-cols-2">
        <div className="theme-night relative min-h-[360px] lg:min-h-[720px]">
          <Image
            src="/images/about-team.jpg"
            alt="SIG-TEL engineers reviewing signalling drawings beside the track at dusk"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-navy-800/40" />
          <div className="absolute left-6 top-6 border border-ink/15 bg-navy-900/60 px-3 py-2 backdrop-blur">
            <p className="label-tight text-[8px] text-ink/70">Navi Mumbai · Maharashtra</p>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
            {["Survey", "Install", "Test", "Maintain"].map((item, index) => (
              <span
                key={item}
                className="flex items-center gap-2 border border-ink/15 bg-navy-900/60 px-2.5 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-ink/70 backdrop-blur"
              >
                <span className="text-eng">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-20" aria-hidden />
          <div className="relative">
            <span className="label flex items-center gap-3 text-tech">
              <span className="text-eng">10</span>
              <span className="h-px w-8 bg-line-strong" />
              About SIG-TEL
            </span>
            <h2 className="mt-6 font-display text-display-md uppercase leading-[0.94] text-ink">
              <RevealLines
                lines={[
                  "Signalling and telecom",
                  "specialists",
                  "since 2010.",
                ]}
              />
            </h2>

            <div className="mt-8 max-w-lg space-y-4 text-[0.95rem] leading-relaxed text-muted">
              <Reveal>
                <p>
                  {company.legalName} was incorporated in 2010. Our office sits inside the Belapur Railway
                  Station building in Navi Mumbai — close enough to the running line that the working
                  constraints of a railway are never abstract to us.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  Both disciplines are staffed in-house: signalling crews who work inside relay rooms and
                  telecom crews who test fibre link by link. What we build, we maintain — through AMC and CAMC
                  scopes that run for years after commissioning.
                </p>
              </Reveal>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-2 gap-4 border-t border-line pt-6">
              <div>
                <p className="label-tight text-tech">Office</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-ink/75">
                  Belapur Railway Station Building, CBD Belapur, Navi Mumbai 400614
                </p>
              </div>
              <div>
                <p className="label-tight text-tech">Hours</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-ink/75">{company.hours}</p>
                <p className="mt-2 text-[0.8rem] text-ink/75">{company.phone.primary}</p>
              </div>
            </div>

            <div className="mt-9">
              <Magnetic>
                <Link href="/about" className="btn" data-cursor-label="Our story">
                  <span>Read our story</span>
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
                    <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
