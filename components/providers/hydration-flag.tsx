"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __sigtelHydrated?: boolean;
  }
}

/**
 * Marks the document as hydrated. A small inline script in the root layout
 * checks this flag a few seconds after boot; if the client bundle never ran
 * (blocked script, runtime error, very slow device), it switches on the
 * `motion-fallback` styles so animation-hidden content becomes visible instead
 * of leaving sections blank.
 */
export function HydrationFlag() {
  useEffect(() => {
    window.__sigtelHydrated = true;
    document.documentElement.classList.remove("motion-fallback");
  }, []);

  return null;
}
