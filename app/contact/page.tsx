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
    images: ["/images/station-daylight.jpg"],
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
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div className="edge relative pb-12 pt-[calc(var(--header-h)+2.6rem)]">
          <p className="text-[0.86rem] text-muted">Contact</p>
          <h1 className="mt-6 max-w-[20ch] text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.99] tracking-[-0.02em] text-eng">
            <RevealLines lines={["Talk to engineers."]} />
          </h1>
          <div className="mt-7 grid gap-8 border-t border-line pt-6 lg:grid-cols-[1.3fr_0.7fr]">
            <p className="max-w-xl text-[0.98rem] leading-relaxed text-muted">
              A tender, a siding, a network design or a system that needs maintaining — send the details and
              our engineering team will respond, usually the same working day.
            </p>
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
              {[
                { label: "Call", value: company.phone.primary, href: company.phone.primaryHref, note: company.hours },
                { label: "Email", value: company.email, href: `mailto:${company.email}`, note: "Enquiries and RFQs" },
                { label: "WhatsApp", value: "Send drawings or tender PDFs", href: company.whatsapp, note: "Fastest for site photos" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group border-b border-line pb-3"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  <p className="text-[0.8rem] text-tech">{item.label}</p>
                  <p className="mt-1.5 text-[0.92rem] text-eng transition-colors group-hover:text-signal">{item.value}</p>
 <p className="mt-1 text-[0.8rem] text-tech">{item.note}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy section-tight" id="enquiry">
        <div className="edge grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <p className="text-[0.86rem] text-muted">Tell us about the work</p>
            <h2 className="mt-5 text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05] tracking-[-0.014em] text-eng">
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
            <div>
              <p className="border-b border-line pb-3 text-[0.86rem] text-tech">Office</p>
              <div className="pt-4">
                <p className="text-[0.9rem] leading-relaxed text-muted">{company.address.office}</p>
                <a
                  href={company.address.maps}
                  target="_blank"
                  rel="noopener noreferrer"
 className="mt-3 inline-flex items-center gap-2 border-b border-eng/40 pb-1 text-[0.8rem] text-eng"
                >
                  Open in Google Maps ↗
                </a>
              </div>
              <div className="border-t border-line p-5">
                <p className="text-[0.8rem] text-tech">Registered office</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{company.address.regd}</p>
              </div>
            </div>

            <div>
              <p className="border-b border-line pb-3 text-[0.86rem] text-tech">Direct</p>
              <dl className="divide-y divide-line">
                {[
                  ["Phone", company.phone.primary],
                  ["Landline", company.phone.landline],
                  ["Email", company.email],
                  ["Hours", company.hours],
                  ["GSTIN", company.gstin],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-[0.82rem] text-tech">{label}</dt>
                    <dd className="text-right text-[0.88rem] text-ink/85">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
              <Image
                src="/images/cctv-daylight.jpg"
                alt="IP CCTV cameras mounted on a galvanised pole beside a station platform"
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
              <p className="absolute inset-x-3 bottom-3 text-[0.8rem] leading-relaxed text-white/90">
                Site visits by appointment, Navi Mumbai
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative border-t border-line bg-navy-800/60 section-tight">
        <div className="edge grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[0.86rem] text-eng">Before you write</p>
            <h2 className="mt-5 text-[clamp(1.9rem,3vw,2.7rem)] leading-[1.05] tracking-[-0.014em] text-eng">
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
                  <span className="text-[0.8rem] text-tech tabular">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-[1.12rem] leading-snug tracking-[-0.01em] text-ink/80 transition-colors group-open:text-eng">
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
