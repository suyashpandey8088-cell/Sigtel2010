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

const previews: Record<string, { image: string; caption: string; ref: string }> = {
  "/signalling": {
    image: "/images/signalling-daylight.jpg",
    caption: "Colour-light signal, location box and cable route",
    ref: "SG-04",
  },
  "/telecommunications": {
    image: "/images/telecom-fibre.jpg",
    caption: "Fibre splicing and OTDR-tested handover",
    ref: "TC-12",
  },
  "/projects": {
    image: "/images/hero-daylight.jpg",
    caption: "Works register across five states",
    ref: "PR-20",
  },
  "/infrastructure": {
    image: "/images/cctv-daylight.jpg",
    caption: "Plant, process and proof at handover",
    ref: "IN-06",
  },
  "/about": {
    image: "/images/engineering-survey.jpg",
    caption: "Signalling and telecom specialists since 2010",
    ref: "CO-10",
  },
  "/contact": {
    image: "/images/station-daylight.jpg",
    caption: "Navi Mumbai · same working day response",
    ref: "CT-01",
  },
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
  const [hovered, setHovered] = useState<string>(
    nav.find((item) => pathname.startsWith(item.href))?.href ?? "/signalling",
  );
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
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[95] overflow-y-auto bg-white"
    >
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--header-h)+1px)] bg-white"
        aria-hidden
      />

      <div className="edge relative flex min-h-[100svh] flex-col justify-between pb-10 pt-[calc(var(--header-h)+2.5rem)]">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <div className="label mb-8 flex items-center gap-3 text-muted">
              <span className="h-px w-8 bg-line-strong" />
              Index
            </div>
            <ul>
              {nav.map((item, i) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.06 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      onMouseEnter={() => setHovered(item.href)}
                      onFocus={() => setHovered(item.href)}
                      className="group flex items-baseline gap-4 border-b border-line py-3.5 sm:gap-8 sm:py-4"
                    >
                      <span className="label-tight w-6 shrink-0 text-tech">{item.index}</span>
                      <span
                        className={cn(
                          "font-display text-[clamp(1.6rem,4.4vw,3.4rem)] leading-[1.04] tracking-[-0.03em] transition-colors duration-300",
                          active ? "text-eng" : "text-ink/80 group-hover:text-eng",
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="ml-auto hidden shrink-0 items-center gap-2 self-center opacity-0 transition-all duration-300 group-hover:opacity-100 sm:flex">
                        <span className="label-tight text-muted">Open</span>
                        <svg width="18" height="11" viewBox="0 0 18 11" fill="none" aria-hidden>
                          <path d="M0 5.5h15M11.5 1l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.1" className="text-signal" />
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
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/contact" onClick={onClose} className="btn btn-solid">
                <span>Discuss a project</span>
              </Link>
              <a href={company.phone.primaryHref} className="btn" onClick={onClose}>
                <span>{company.phone.primary}</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-navy-800">
              <Image
                key={preview.image}
                src={preview.image}
                alt={preview.caption}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <span className="plate absolute left-4 top-4 flex items-center gap-2 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-eng">
                <span className="h-[4px] w-[4px] rounded-full bg-signal" />
                {preview.ref}
              </span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-6 border-t border-line pt-4">
              <p className="max-w-[16rem] text-sm leading-snug text-ink/80">{preview.caption}</p>
              <p className="label-tight shrink-0 text-tech">SIG-TEL / Index</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8 border-t border-line pt-6">
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
                <a href={`mailto:${company.email}`} className="link-underline text-sm text-eng">
                  {company.email}
                </a>
                <p className="mt-3 label-tight text-tech">Hours</p>
                <p className="text-sm text-muted">{company.hours}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-tight text-tech">
            SIG-TEL · {company.tagline} · Est. {company.founded}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="label-tight text-muted hover:text-eng">
              WhatsApp
            </a>
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="label-tight text-muted hover:text-eng">
              LinkedIn
            </a>
            <Link href="/privacy" onClick={onClose} className="label-tight text-muted hover:text-eng">
              Privacy
            </Link>
            <span className="label-tight text-tech">GSTIN {company.gstin}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
