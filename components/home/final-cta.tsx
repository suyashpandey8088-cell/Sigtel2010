import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/content/site";
import { RevealLines, Reveal } from "@/components/ui/reveal";

/**
 * The last frame.
 *
 * No scrim, no overlay type: a bright photograph, then the closing statement on
 * paper beneath it, and the three ways to reach the office set as plain text.
 * The page ends light.
 */
export function FinalCta() {
  return (
    <section className="border-t border-line bg-navy">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy-800 md:aspect-[21/9]">
        <Image
          src="/images/station-daylight.jpg"
          alt="Daylight on a modern station platform, with canopy structure and tracks"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="edge pb-20 pt-10 md:pb-28 md:pt-12">
        <div className="grid-edit gap-y-8">
          <p className="mark lg:pt-2">Contact</p>
          <div className="edit-body">
            <h2 className="text-[clamp(2.4rem,6.2vw,5.8rem)] leading-[0.98] tracking-[-0.02em] text-eng">
              <RevealLines lines={["Let’s engineer", "what moves tomorrow."]} />
            </h2>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-[46ch] text-[1rem] leading-[1.7] text-ink/80">
                A tender, a siding, a network design or a system that needs
                maintaining — send the details and our engineering team will
                respond, usually the same working day.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link href="/contact" className="btn btn-solid" data-cursor-label="Start">
                  <span>Discuss your project</span>
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden>
                    <path d="M0 4.5h12M8.5 1L12 4.5 8.5 8" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </Link>
                <a
                  href={company.phone.primaryHref}
                  className="link-underline text-[0.95rem] text-eng"
                >
                  {company.phone.primary}
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="link-underline text-[0.95rem] text-muted"
                >
                  {company.email}
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
          {[
            { label: "Call", value: company.phone.landline, href: company.phone.landlineHref },
            { label: "WhatsApp", value: "Send drawings or tender PDFs", href: company.whatsapp },
            { label: "Office hours", value: company.hours, href: undefined },
          ].map((item) => {
            const content = (
              <>
                <span className="block text-[0.78rem] text-tech">{item.label}</span>
                <span className="mt-1 block text-[0.92rem] text-eng">{item.value}</span>
              </>
            );
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group block"
              >
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
