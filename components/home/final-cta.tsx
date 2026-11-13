import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/content/site";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

/**
 * The closing plate: a bright photograph of a station roof, a white scrim and
 * an oversized statement. The last frame of the film should be light, not dark.
 */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line">
      <Image
        src="/images/station-daylight.jpg"
        alt="Daylight on a modern station platform, with canopy structure and tracks"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.82)_42%,rgba(255,255,255,0.95)_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-50" aria-hidden />

      <div className="edge relative flex min-h-[82svh] flex-col justify-between py-16 md:py-24">
        <div className="flex items-center justify-between gap-4">
          <span className="label-tight flex items-center gap-2.5 text-muted">
            <span className="h-[5px] w-[5px] rounded-full bg-signal" />
            Start a conversation
          </span>
          <span className="flex items-center gap-2">
            <span className="h-[6px] w-[6px] animate-blink rounded-full bg-clear" />
            <span className="label-tight text-[8px] text-muted">Aspect clear</span>
          </span>
        </div>

        <div className="max-w-5xl py-14">
          <h2 className="font-display text-[clamp(2.5rem,7.4vw,6.6rem)] uppercase leading-[0.9] tracking-[-0.045em] text-eng">
            <RevealLines lines={["LET'S ENGINEER", "WHAT MOVES", "TOMORROW."]} />
          </h2>
          <Reveal delay={0.18}>
            <p className="mt-8 max-w-xl text-[0.98rem] leading-relaxed text-muted">
              A tender, a siding, a network design or a system that needs maintaining — send the details
              and our engineering team will respond, usually the same working day.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link href="/contact" className="btn btn-solid" data-cursor-label="Start">
                  <span>Discuss your project</span>
                  <svg width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden>
                    <path d="M0 4.5h13M9.5 1L13 4.5 9.5 8" stroke="currentColor" strokeWidth="1.1" />
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
                <span className="mt-1 block text-sm text-eng transition-colors group-hover:text-signal">
                  {item.value}
                </span>
              </span>
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden className="shrink-0 opacity-40 transition-opacity group-hover:opacity-100">
                <path d="M0 4.5h12M8.5 1L12 4.5 8.5 8" stroke="currentColor" strokeWidth="1" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
