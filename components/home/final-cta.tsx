import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/content/site";
import { RevealLines, Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

export function FinalCta() {
  return (
    <section className="theme-night relative overflow-hidden border-t border-line bg-navy-900">
      <Image
        src="/images/project-station.jpg"
        alt="Railway station platform at blue hour with signal lights"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,22,0.92)_0%,rgba(5,12,22,0.55)_45%,rgba(5,12,22,0.95)_100%)]" aria-hidden />
      <div className="absolute inset-0 grid-blueprint opacity-20" aria-hidden />
      <div className="absolute inset-0 scanlines opacity-10" aria-hidden />

      <div className="edge relative flex min-h-[80vh] flex-col justify-between py-16 md:py-24">
        <div className="flex items-center justify-between">
          <span className="label flex items-center gap-3 text-tech">
            <span className="text-eng">11</span>
            <span className="h-px w-8 bg-line-strong" />
            Start a conversation
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-eng shadow-[0_0_12px_rgba(36,199,139,0.9)] animate-blink" />
            <span className="label-tight text-[8px] text-ink/60">Aspect clear</span>
          </span>
        </div>

        <div className="max-w-5xl py-14">
          <h2 className="font-display text-[clamp(2.4rem,7vw,6.4rem)] uppercase leading-[0.9] tracking-[-0.045em] text-ink">
            <RevealLines lines={['LET’S ENGINEER', 'WHAT MOVES', 'TOMORROW.']} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-[0.98rem] leading-relaxed text-muted">
              Have an infrastructure project in mind? Connect with our engineering team to discuss your
              requirements — a tender, a siding, a network or a system to maintain.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link href="/contact" className="btn btn-solid" data-cursor-label="Start">
                  <span>Discuss your project</span>
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
                    <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/contact#details" className="btn" data-cursor-label="Contact">
                  <span>Contact SIG-TEL</span>
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
          {[
            { label: "Call", value: company.phone.primary, href: company.phone.primaryHref },
            { label: "Email", value: company.email, href: `mailto:${company.email}` },
            { label: "WhatsApp", value: "Send drawings or tender PDFs", href: company.whatsapp },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 border-b border-line pb-3 sm:border-b-0"
            >
              <span>
                <span className="label-tight block text-tech">{item.label}</span>
                <span className="mt-1 block text-sm text-ink/85 transition-colors group-hover:text-eng">{item.value}</span>
              </span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden className="shrink-0 opacity-40 transition-opacity group-hover:opacity-100">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
