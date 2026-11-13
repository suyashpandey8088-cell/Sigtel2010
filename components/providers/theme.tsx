"use client";

/**
 * The site has one visual identity: a light, paper-and-engineering-blue theme.
 * There is no night mode, so no theme state, storage key or pre-paint script is
 * needed — the palette is declared once in `app/globals.css`.
 *
 * This module remains as the single place that describes the identity, and as a
 * convenience hook for components that want to name a surface by role.
 */

export const identity = {
  name: "light",
  surface: {
    page: "#F7F7F4",
    plate: "#FFFFFF",
    alternate: "#EEF1F3",
    softBlue: "#E6EEF3",
  },
  ink: {
    primary: "#182B3A",
    secondary: "#71808A",
    engineeringBlue: "#183B56",
    signalRed: "#E44D43",
    technicalGreen: "#43866B",
    border: "#DDE2E5",
  },
} as const;

export function useIdentity() {
  return identity;
}
