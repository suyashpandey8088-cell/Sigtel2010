"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { company } from "@/lib/content/site";

/** Sticky contact bar for small screens — appears after the hero. */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-white/95 backdrop-blur-md transition-transform duration-500 ease-engineering md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="grid grid-cols-[1fr_1fr_1.2fr] divide-x divide-line">
        <a
          href={company.phone.primaryHref}
          className="flex flex-col items-center justify-center gap-1 py-3"
          aria-label={`Call ${company.phone.primary}`}
        >
          <span className="label-tight text-[8px] text-tech">Call</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink">Now</span>
        </a>
        <a
          href={company.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-3"
        >
          <span className="label-tight text-[8px] text-tech">WhatsApp</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink">Send</span>
        </a>
        <Link href="/contact" className="flex items-center justify-center gap-2 bg-eng py-3 text-white">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em]">Discuss a project</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
            <path d="M0 4h10M7 1l3 3-3 3" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
