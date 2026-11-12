import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SIG-TEL collects, uses and protects information submitted through this website, including enquiry forms, attachments and analytics.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "Who we are",
    body: [
      `${company.legalName} ("SIG-TEL", "we", "us") is an Indian company incorporated in 2010, with its office at ${company.address.office} and registered office at ${company.address.regd}. GSTIN ${company.gstin}.`,
      "This policy explains what happens to information you provide through this website.",
    ],
  },
  {
    title: "Information we collect",
    body: [
      "When you submit an enquiry we collect the name, company or railway office, email address, phone number, enquiry category, project location and message you provide. If you attach a file, we store that file.",
      "We also record the time of submission and, for security purposes, may record the originating IP address and a rate-limit counter to prevent abuse. We do not use advertising cookies.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "To respond to your enquiry, prepare a quotation or capability response, and keep a record of the communication for follow-up. Where you have asked us to, we use your contact details to reply about the specific project you described.",
      "We do not sell data, and we do not add you to a marketing list without a separate, explicit request.",
    ],
  },
  {
    title: "Legal basis and consent",
    body: [
      "We process enquiry data on the basis of your consent, given when you submit the form with the privacy checkbox selected, and on the basis of our legitimate interest in responding to business enquiries.",
      "You may withdraw consent at any time by contacting us; we will then delete the enquiry record unless we are required to retain it for a contractual or statutory reason.",
    ],
  },
  {
    title: "Storage, retention and security",
    body: [
      "Enquiry records are stored in our website database and are accessible only to authorised SIG-TEL staff through a password-protected, role-controlled admin area. Sessions are signed and time-limited.",
      "We retain enquiries for up to 24 months after the last communication, unless a project or tender requires longer. Attachments are stored with access restricted to authorised staff.",
      "Our hosting and email providers process data on our behalf under their own security commitments. Email notifications are sent through a transactional email provider.",
    ],
  },
  {
    title: "Sharing",
    body: [
      "We do not share your information with third parties for marketing. We may share it with suppliers or partners only where it is necessary to respond to your enquiry (for example, an OEM whose system the enquiry concerns), and only with your knowledge.",
      "We may disclose information where required by law or by a lawful request from a public authority.",
    ],
  },
  {
    title: "Analytics",
    body: [
      "If analytics is enabled on this website, we use privacy-friendly, cookie-less measurement (for example Plausible) or Google Analytics 4 with IP anonymisation. Analytics data is aggregated and is not used to identify individuals.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You may ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Write to us at the email below and we will respond within a reasonable period.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "If this policy changes, the updated version will be published on this page with a new date. Material changes affecting existing enquiries will be communicated where we hold a working email address.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="relative border-b border-line bg-navy-900 pb-12 pt-[calc(var(--header-h)+4rem)]">
        <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-25" aria-hidden />
        <div className="edge relative">
          <div className="flex items-center gap-4">
            <span className="label-tight text-eng">Legal</span>
            <span className="h-px w-8 bg-line-strong" />
            <span className="label text-tech">Privacy</span>
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.4rem)] uppercase leading-[0.94] tracking-[-0.04em] text-ink">
            Privacy policy
          </h1>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            A short, plain-language policy covering the enquiry form, attachments and analytics on this website.
          </p>
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-tech">Last updated: 12 November 2026</p>
        </div>
      </section>

      <section className="relative bg-navy py-16">
        <div className="edge grid gap-12 lg:grid-cols-[220px_1fr]">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="label mb-4 text-tech">Contents</p>
            <ol className="space-y-2">
              {sections.map((section, index) => (
                <li key={section.title}>
                  <a
                    href={`#section-${index + 1}`}
                    className="flex gap-3 text-[0.82rem] text-muted transition-colors hover:text-ink"
                  >
                    <span className="font-mono text-[8.5px] tracking-[0.16em] text-tech">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl space-y-12">
            {sections.map((section, index) => (
              <div key={section.title} id={`section-${index + 1}`} className="scroll-mt-24">
                <div className="flex items-baseline gap-3 border-b border-line pb-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-eng">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="font-display text-xl uppercase tracking-[-0.01em] text-ink">{section.title}</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-[0.92rem] leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="border border-line bg-navy-800/50 p-6">
              <p className="label mb-3 text-tech">Contact for privacy</p>
              <p className="text-sm leading-relaxed text-muted">
                {company.legalName}
                <br />
                {company.address.office}
                <br />
                Email: <a href={`mailto:${company.email}`} className="text-ink hover:text-eng">{company.email}</a>
                <br />
                Phone: <a href={company.phone.primaryHref} className="text-ink hover:text-eng">{company.phone.primary}</a>
              </p>
              <Link href="/contact" className="mt-4 inline-block border-b border-eng/40 pb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-eng">
                Go to contact form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
