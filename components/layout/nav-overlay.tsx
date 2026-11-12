"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { company } from "@/lib/content/site";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  index: string;
}

const previews: Record<string, { image: string; caption: string }> = {
  "/signalling": { image: "/images/signalling-hero.jpg", caption: "Electronic interlocking · LC gates · earthing" },
  "/telecommunications": { image: "/images/telecom-hero.jpg", caption: "IP-MPLS · SDH · OFC · CCTV · NMS" },
  "/projects": { image: "/images/hero-railway.jpg", caption: "Works register across five states" },
  "/infrastructure": { image: "/images/project-cctv.jpg", caption: "Plant, process and proof" },
  "/about": { image: "/images/about-team.jpg", caption: "Signalling and telecom since 2010" },
  "/contact": { image: "/images/project-station.jpg", caption: "Navi Mumbai · same-day response" },
};

export function NavOverlay({
  onClose,
  nav,
  pathname,
}: {
  onClose: () => void;
  nav: NavItem[];
  pathname: string;
}) {
  const [hovered, setHovered] = useState<string>("/signalling");
  const preview = previews[hovered] ?? previews["/signalling"];

  return (
    <motion.div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="theme-night fixed inset-0 z-[95] overflow-y-auto bg-navy-900"
    >
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-60" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_20%,rgba(36,199,139,0.08),transparent_70%)]" aria-hidden />

      <div className="edge relative flex min-h-[100svh] flex-col justify-between pb-10 pt-[calc(var(--header-h)+2.5rem)]">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="label mb-8 flex items-center gap-3">
              <span className="h-1 w-1 bg-eng" />
              Navigation
            </div>
            <ul className="space-y-1">
              {nav.map((item, i) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.08 + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      onMouseEnter={() => setHovered(item.href)}
                      onFocus={() => setHovered(item.href)}
                      className="group flex items-baseline gap-4 border-b border-line py-3 sm:gap-8 sm:py-4"
                    >
                      <span className="label-tight w-6 shrink-0 text-tech">{item.index}</span>
                      <span
                        className={cn(
                          "font-display text-[clamp(1.55rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-0.03em] transition-colors duration-300",
                          active ? "text-eng" : "text-ink/85 group-hover:text-ink",
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="ml-auto hidden shrink-0 items-center gap-2 self-center opacity-0 transition-all duration-300 group-hover:opacity-100 sm:flex">
                        <span className="label-tight text-tech">Open</span>
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
                          <path d="M0 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.1" className="text-eng" />
                        </svg>
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/contact" onClick={onClose} className="btn btn-solid">
                <span>Discuss a Project</span>
              </Link>
              <a href={`tel:${company.phone.primaryHref}`} className="btn !border-line" onClick={onClose}>
                <span>{company.phone.primary}</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-line">
              <Image
                key={preview.image}
                src={preview.image}
                alt={preview.caption}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover opacity-80 transition-opacity duration-500"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="label-tight mb-2 text-eng">Division preview</p>
                <p className="font-display text-lg text-ink">{preview.caption}</p>
              </div>
              <span className="absolute right-4 top-4 label-tight text-ink/60">SIG-TEL / {preview.image.includes("signalling") ? "S" : "T"}</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <p className="label-tight mb-2 text-tech">Office</p>
                <p className="text-sm leading-relaxed text-muted">
                  Belapur Railway Station Building,
                  <br />
                  CBD Belapur, Navi Mumbai 400614
                </p>
              </div>
              <div>
                <p className="label-tight mb-2 text-tech">Email</p>
                <a href={`mailto:${company.email}`} className="link-underline text-sm text-ink">
                  {company.email}
                </a>
                <p className="mt-3 label-tight text-tech">Hours</p>
                <p className="text-sm text-muted">{company.hours}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-tight text-tech">SIG-TEL · {company.tagline} · Est. {company.founded}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="label-tight text-muted hover:text-ink">
              WhatsApp
            </a>
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="label-tight text-muted hover:text-ink">
              LinkedIn
            </a>
            <Link href="/privacy" onClick={onClose} className="label-tight text-muted hover:text-ink">
              Privacy
            </Link>
            <span className="label-tight text-tech">GSTIN {company.gstin}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
