import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/contact-form";
import { RevealLines } from "@/components/ui/reveal";
import { company, faqs } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact — Discuss a project",
  description:
    "Talk to SIG-TEL's engineering team about signalling, telecom, tenders or maintenance. Navi Mumbai office: Belapur Railway Station Building. Call +91 93200 01996 or email sigtel2011@gmail.com.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact SIG-TEL",
    description: "Send a tender, drawings or route details. We usually respond the same working day.",
    images: ["/images/project-station.jpg"],
  },
};

export default function ContactPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="relative overflow-hidden border-b border-line bg-navy-900">
        <Image
          src="/images/project-station.jpg"
          alt="Railway station platform at blue hour"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 hero-scrim" aria-hidden />
        <div className="absolute inset-0 grid-blueprint opacity-25" aria-hidden />
        <div className="edge relative pb-14 pt-[calc(var(--header-h)+4.5rem)]">
          <div className="flex items-center gap-4">
            <span className="label-tight text-eng">06</span>
            <span className="h-px w-8 bg-line-strong" />
            <span className="label text-ink/70">Contact</span>
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.4rem,6vw,5.6rem)] uppercase leading-[0.92] tracking-[-0.045em] text-ink">
            <RevealLines lines={["TALK TO", "ENGINEERS."]} />
          </h1>
          <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-muted">
            A tender, a siding, a network design or a system that needs maintaining — send the details and our
            engineering team will respond, usually the same working day.
          </p>

          <div className="mt-10 grid gap-6 border-t border-ink/15 pt-6 sm:grid-cols-3">
            {[
              { label: "Call", value: company.phone.primary, href: company.phone.primaryHref, note: company.hours },
              { label: "Email", value: company.email, href: `mailto:${company.email}`, note: "Enquiries and RFQs" },
              { label: "WhatsApp", value: "Send drawings or tender PDFs", href: company.whatsapp, note: "Fastest for site photos" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="group" target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                <p className="label-tight text-tech">{item.label}</p>
                <p className="mt-2 text-[0.95rem] text-ink transition-colors group-hover:text-eng">{item.value}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-tech">{item.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy py-16 md:py-24" id="enquiry">
        <div className="edge grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span className="label-tight text-eng">Enquiry</span>
              <span className="h-px w-8 bg-line-strong" />
              <span className="label text-tech">Tell us about the work</span>
            </div>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.2vw,2.8rem)] uppercase leading-[0.98] tracking-[-0.03em] text-ink">
              Project enquiry form
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Fields marked <span className="text-signal">*</span> are required. Attach drawings or a tender PDF if
              you have them — it saves a round of questions.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" id="details">
            <div className="border border-line bg-navy-800/50">
              <div className="border-b border-line px-5 py-3">
                <p className="label text-tech">Office</p>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-muted">{company.address.office}</p>
                <a
                  href={company.address.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 border-b border-eng/40 pb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-eng"
                >
                  Open in Google Maps ↗
                </a>
              </div>
              <div className="border-t border-line p-5">
                <p className="label-tight text-tech">Registered office</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{company.address.regd}</p>
              </div>
            </div>

            <div className="border border-line bg-navy-800/50">
              <div className="border-b border-line px-5 py-3">
                <p className="label text-tech">Direct</p>
              </div>
              <dl className="divide-y divide-line">
                {[
                  ["Phone", company.phone.primary],
                  ["Landline", company.phone.landline],
                  ["Email", company.email],
                  ["Hours", company.hours],
                  ["GSTIN", company.gstin],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 px-5 py-3">
                    <dt className="label-tight text-tech">{label}</dt>
                    <dd className="text-right font-mono text-[10px] uppercase tracking-[0.08em] text-ink/85">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden border border-line">
              <Image
                src="/images/level-crossing.jpg"
                alt="Automated level crossing gate at night"
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink/70">
                Site visits by appointment · Navi Mumbai
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/40 py-16 md:py-24">
        <div className="edge grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="label text-eng">Before you write</span>
            <h2 className="mt-5 font-display text-[clamp(1.7rem,3vw,2.6rem)] uppercase leading-[0.98] tracking-[-0.03em] text-ink">
              Questions we are asked.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              If your question is not here, ask it in the form — we would rather answer than have you guess.
            </p>
          </div>
          <div className="border-t border-line">
            {faqs.map((faq, index) => (
              <details key={faq.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-[9px] tracking-[0.18em] text-tech">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-display text-lg uppercase leading-snug tracking-[-0.01em] text-ink/85 group-open:text-ink">
                    {faq.q}
                  </span>
                  <span className="relative mt-2 flex h-4 w-4 shrink-0 items-center justify-center">
                    <span className="absolute h-px w-3 bg-ink/60" />
                    <span className="absolute h-3 w-px bg-ink/60 transition-transform duration-300 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 pl-8 text-[0.9rem] leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
