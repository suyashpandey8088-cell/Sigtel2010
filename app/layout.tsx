import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Cursor } from "@/components/ui/cursor";
import { MobileCta } from "@/components/ui/mobile-cta";
import { HideOnAdmin } from "@/components/layout/hide-on-admin";
import { Analytics } from "@/components/providers/analytics";
import { HydrationFlag } from "@/components/providers/hydration-flag";
import { OrganizationSchema } from "@/components/seo/organization-schema";
import { company } from "@/lib/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: "SIG-TEL — Railway Signalling & Telecommunications Engineering",
    template: "%s · SIG-TEL",
  },
  description:
    "SIG-TEL engineers railway signalling and telecommunications systems for Indian Railways, private sidings and pipeline networks — Electronic Interlocking, LC gates, axle counters, IP-MPLS, SDH, OFC, CCTV and long-term maintenance. Incorporated 2010, Navi Mumbai.",
  keywords: [
    "railway signalling",
    "telecommunications",
    "electronic interlocking",
    "level crossing gate",
    "axle counter",
    "IP-MPLS",
    "SDH",
    "OFC",
    "CCTV railway",
    "Indian Railways contractor",
    "SIG-TEL",
    "Navi Mumbai",
  ],
  authors: [{ name: company.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: company.siteUrl,
    siteName: company.name,
    title: "SIG-TEL — Engineering the systems that keep India moving",
    description:
      "Integrated railway signalling and telecommunications engineering: Electronic Interlocking, level crossings, axle counters, IP-MPLS, SDH, OFC, CCTV and maintenance.",
    images: [{ url: "/images/hero-railway.jpg", width: 1200, height: 630, alt: "Railway signalling infrastructure at dusk" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIG-TEL — Railway Signalling & Telecommunications",
    description: "Signalling and telecom systems engineered for dependable railway infrastructure.",
    images: ["/images/hero-railway.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07111F",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className="grain bg-navy text-ink antialiased">
        <script
          // Failsafe: reveal animation-hidden content if the client bundle never
          // hydrates (blocked JavaScript, runtime error, extremely slow device).
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{window.setTimeout(function(){if(!window.__sigtelHydrated){document.documentElement.classList.add('motion-fallback');}},2500);}catch(e){}})();",
          }}
        />
        <noscript>
          <style>{`[style*="opacity"]{opacity:1!important}.mask-line>*{transform:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <SiteHeader />
          <main id="main">{children}</main>
          <HideOnAdmin>
            <div className="h-[58px] md:hidden" aria-hidden />
            <SiteFooter />
          </HideOnAdmin>
        </SmoothScroll>
        <MobileCta />
        <Cursor />
        <Analytics />
        <HydrationFlag />
        <OrganizationSchema />
        <style>{`
          .skip-link{position:fixed;top:-100px;left:1rem;z-index:200;background:#24C78B;color:#04120C;padding:0.85rem 1.2rem;font-family:"IBM Plex Mono",monospace;font-size:0.75rem;letter-spacing:0.14em;text-transform:uppercase;transition:top .2s ease}
          .skip-link:focus{top:0.75rem}
        `}</style>
      </body>
    </html>
  );
}
