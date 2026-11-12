import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { company } from "@/lib/content/site";

const columns = [
  {
    title: "Disciplines",
    links: [
      { href: "/signalling", label: "Railway signalling" },
      { href: "/telecommunications", label: "Telecommunications" },
      { href: "/infrastructure", label: "Infrastructure & capabilities" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/about", label: "About SIG-TEL" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-navy-900">
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-40" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-eng/40 to-transparent" aria-hidden />

      <div className="edge relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{company.positioning}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-eng shadow-[0_0_12px_rgba(36,199,139,0.9)]" />
              </span>
              <span className="label-tight text-tech">Registered since {company.founded} · GSTIN {company.gstin}</span>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="label mb-5 text-tech">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline text-sm text-muted hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="label mb-5 text-tech">Contact</p>
            <address className="not-italic text-sm leading-relaxed text-muted">
              {company.address.office}
            </address>
            <div className="mt-5 space-y-2 text-sm">
              <a href={company.phone.primaryHref} className="block text-ink hover:text-eng">
                {company.phone.primary}
              </a>
              <a href={company.phone.landlineHref} className="block text-muted hover:text-ink">
                {company.phone.landline}
              </a>
              <a href={`mailto:${company.email}`} className="block text-muted hover:text-ink">
                {company.email}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 md:flex-row md:items-center md:justify-between">
          <p className="label-tight text-tech">
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="label-tight text-muted hover:text-ink">
              LinkedIn ↗
            </a>
            <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="label-tight text-muted hover:text-ink">
              WhatsApp ↗
            </a>
            <Link href="/privacy" className="label-tight text-muted hover:text-ink">
              Privacy Policy
            </Link>
            <Link href="/admin" className="label-tight text-tech hover:text-muted">
              Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="relative select-none overflow-hidden pb-4" aria-hidden>
        <p className="edge whitespace-nowrap font-display text-[clamp(3.5rem,14vw,13rem)] leading-[0.8] tracking-[-0.05em] text-ink/[0.045]">
          ENGINEERED TO CLEAR
        </p>
      </div>
    </footer>
  );
}
