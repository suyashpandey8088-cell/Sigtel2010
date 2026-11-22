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
    <footer className="relative overflow-hidden border-t border-line bg-navy-800">
      <div className="edge relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.3fr_0.6fr_0.6fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{company.positioning}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-[6px] w-[6px] rounded-full bg-clear" />
              <span className="text-[0.82rem] text-tech">
                Registered since {company.founded} · GSTIN {company.gstin}
              </span>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="mb-5 text-[0.86rem] text-tech">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline text-sm text-muted hover:text-eng">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-5 text-[0.86rem] text-tech">Contact</p>
            <address className="not-italic text-sm leading-relaxed text-muted">
              {company.address.office}
            </address>
            <div className="mt-5 space-y-2 text-sm">
              <a href={company.phone.primaryHref} className="block text-eng hover:text-signal">
                {company.phone.primary}
              </a>
              <a href={company.phone.landlineHref} className="block text-muted hover:text-eng">
                {company.phone.landline}
              </a>
              <a href={`mailto:${company.email}`} className="block text-muted hover:text-eng">
                {company.email}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.82rem] text-tech">
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="text-[0.82rem] text-muted hover:text-eng">
              LinkedIn ↗
            </a>
            <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[0.82rem] text-muted hover:text-eng">
              WhatsApp ↗
            </a>
            <Link href="/privacy" className="text-[0.82rem] text-muted hover:text-eng">
              Privacy policy
            </Link>
            <Link href="/admin" className="text-[0.82rem] text-tech hover:text-muted">
              Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="relative select-none overflow-hidden" aria-hidden>
        <p className="edge whitespace-nowrap pb-4 text-[clamp(3rem,11vw,10.5rem)] leading-[0.82] tracking-[-0.02em] text-eng/[0.07]">
          Signals that clear
        </p>
      </div>
    </footer>
  );
}
