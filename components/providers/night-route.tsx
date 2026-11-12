"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme";

/**
 * Routes that are pinned to the dark palette. The admin console is a working
 * tool rather than a marketing page, and its data tables were designed for
 * night mode. The header toggle is hidden there, so the switch never offers a
 * state it will not deliver.
 */
const DARK_ROUTES = ["/admin"];

export function NightRoute() {
  const pathname = usePathname();
  const { forceTheme } = useTheme();
  const night = DARK_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`),
  );

  useEffect(() => {
    forceTheme(night ? "dark" : null);
    return () => forceTheme(null);
  }, [night, forceTheme]);

  return null;
}
