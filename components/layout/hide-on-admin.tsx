"use client";

import { usePathname } from "next/navigation";

/** Keeps the marketing chrome (footer) out of the admin control room. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
