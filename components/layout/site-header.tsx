"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/brand/logo";
import { useTheme } from "@/components/providers/theme";
import { NavOverlay } from "@/components/layout/nav-overlay";
import { HideOnAdmin } from "@/components/layout/hide-on-admin";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/signalling", label: "Signalling", index: "01" },
  { href: "/telecommunications", label: "Telecommunications", index: "02" },
  { href: "/projects", label: "Projects", index: "03" },
  { href: "/infrastructure", label: "Infrastructure", index: "04" },
  { href: "/about", label: "About", index: "05" },
  { href: "/contact", label: "Contact", index: "06" },
];

/** Sun/moon toggle. Labelled, keyboard reachable, and only rendered where the
 *  page actually has a light theme to offer (see HideOnAdmin). */
function ThemeToggle() {
  const { theme, resolved, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={resolved ? dark : undefined}
      aria-label={
        dark ? "Switch to the light theme" : "Switch to the dark theme"
      }
      title={dark ? "Light theme" : "Dark theme"}
      data-cursor-label={dark ? "Light" : "Dark"}
      className="group relative flex h-11 w-11 items-center justify-center border border-line-strong transition-colors hover:border-eng"
    >
      <span className="relative block h-[15px] w-[15px]">
        {/* sun */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full transition-all duration-500 ease-engineering",
            dark ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <circle
            cx="8"
            cy="8"
            r="3.1"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-ink"
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="8"
              y1="1.1"
              x2="8"
              y2="2.6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              transform={`rotate(${angle} 8 8)`}
              className="text-ink"
            />
          ))}
        </svg>
        {/* moon */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full transition-all duration-500 ease-engineering",
            dark ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <path
            d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.8 5.8 0 1 0 6.8 6.8Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="text-ink"
          />
        </svg>
      </span>
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const lenis = (
      window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    ).__lenis;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-engineering",
          scrolled
            ? "border-b border-line bg-navy/85 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="edge flex h-[var(--header-h)] items-center justify-between gap-6">
          <Logo className="shrink-0" />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 lg:flex"
          >
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={cn(
                    "link-underline font-mono text-[10.5px] uppercase tracking-label transition-colors duration-300",
                    active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <HideOnAdmin>
              <ThemeToggle />
            </HideOnAdmin>
            <Link
              href="/contact"
              className="btn hidden !py-[0.8rem] !px-5 md:inline-flex"
              data-cursor-label="Enquire"
            >
              <span>Discuss a Project</span>
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                aria-hidden
              >
                <path
                  d="M0 5h12M8 1l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group relative flex h-11 w-11 items-center justify-center border border-line-strong transition-colors hover:border-eng"
              data-cursor-label={open ? "Close" : "Menu"}
            >
              <span className="relative block h-[9px] w-[18px]">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-ink transition-all duration-300",
                    open ? "top-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-ink transition-all duration-300",
                    open ? "top-1/2 -rotate-45" : "bottom-0",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
        <span
          className="absolute bottom-0 left-0 h-px w-full bg-line"
          aria-hidden
        >
          <span
            className="block h-px origin-left bg-eng transition-opacity duration-500"
            style={{
              transform: `scaleX(${progress})`,
              opacity: scrolled ? 1 : 0,
            }}
          />
        </span>
      </header>

      <AnimatePresence>
        {open ? (
          <NavOverlay
            key="overlay"
            onClose={() => setOpen(false)}
            nav={nav}
            pathname={pathname}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
