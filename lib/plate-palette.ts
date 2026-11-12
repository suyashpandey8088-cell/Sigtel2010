"use client";

/**
 * Inline theme resolution for the plate.
 *
 * The drawing's palette is chosen in CSS, but `stopColor`/`fill` attributes
 * cannot read custom properties inside SVG gradients reliably across browsers,
 * so the plate resolves the tokens it needs from the cascade once, before it
 * paints, and falls back to the night palette if it is rendered somewhere with
 * no document (tests, SSR strings).
 */

const NIGHT = {
  skyTop: "#04090f",
  skyMid: "#08131f",
  skyLow: "#0d1f2e",
  horizon: "#1b3b4a",
  groundTop: "#0b1826",
  groundLow: "#050b12",
  fore: "#03070c",
  haze: "#16303f",
  ridge: "#0a1825",
  ridge2: "#0b1b29",
  hillGlow: "#F5B84B",
  ballastBase: "#16222e",
  ballastSpeck: ["#263744", "#2b3d4c", "#1f2f3c", "#22323f"],
  sleeperRear: "#1d2c3a",
  sleeperFront: "#222f3d",
  railGlow: "#d7e2ec",
  trough: "#121d28",
  troughLid: "#1e2d3a",
  build: "#182b3d",
  buildDark: "#0e1b27",
  buildRoof: "#1c2f43",
  buildPanel: "#0b1824",
  metal: "#6f8497",
  rail: "#9fb0c2",
  railSoft: "#7c8fa2",
  line: "#345069",
  lineSoft: "#263947",
  lineMid: "#3c5364",
  steel: "#1d3040",
  pole: "#1b2c3d",
  copper: "#b7834d",
  board: "#d3dee8",
  boardInk: "#7f93a6",
  road: "#12202c",
  roadEdge: "#26333f",
  roadLine: "#2b3a47",
  deck: "#1d2b39",
  deckEdge: "#2f4356",
  deckRib: "#3a4f63",
  cabinet: "#182634",
  chip: "#071320",
  chipActive: "#0c1a26",
  chipInk: "#8397aa",
  void: "#0a1621",
  lens: "#243444",
  lattice: "#3d566c",
  antenna: "#243746",
  sand: "#f5b84b",
  fog: "#16303f",
  ballastInk: "#101c27",
  cessInk: "#0f1b26",
  sleeperHatch: "#22303d",
  headLens: "#0b1723",
  headRim: "#263949",
  hood: "#1d2c3c",
  plate: "#0d1a26",
  wire: "#5c7386",
  dropper: "#4f6477",
  mastFill: "#20323f",
  mastFoot: "#1b2b37",
  lensGlow: "#7fd6ff",
  mastBand: "#22364a",
  lampPole: "#243746",
};

const LIGHT = {
  skyTop: "#fbf8f2",
  skyMid: "#f6f2e9",
  skyLow: "#efe9dc",
  horizon: "#e4dccb",
  groundTop: "#ece6d8",
  groundLow: "#e0d8c7",
  fore: "#d7cfbe",
  haze: "#e6dfd0",
  ridge: "#e2dbca",
  ridge2: "#d8d0bd",
  hillGlow: "#c98a22",
  ballastBase: "#c3bba6",
  ballastSpeck: ["#9d9682", "#ada592", "#8f8875", "#b6ae9a"],
  sleeperRear: "#8e8674",
  sleeperFront: "#7f7867",
  railGlow: "#93a2ae",
  trough: "#b6ad99",
  troughLid: "#a49b87",
  build: "#e2dbcc",
  buildDark: "#c9c0ac",
  buildRoof: "#d3cab7",
  buildPanel: "#6d747c",
  metal: "#4c5b67",
  rail: "#46555f",
  railSoft: "#66757f",
  line: "#6a7680",
  lineSoft: "#8b949b",
  lineMid: "#78838c",
  steel: "#6e7a84",
  pole: "#7a8288",
  copper: "#a0703c",
  board: "#25394b",
  boardInk: "#4a5c6b",
  road: "#cdc5b2",
  roadEdge: "#b3ab98",
  roadLine: "#8a9299",
  deck: "#b0a894",
  deckEdge: "#948c7a",
  deckRib: "#7e7668",
  cabinet: "#c6bea9",
  chip: "#f8f6f1",
  chipActive: "#ffffff",
  chipInk: "#2f4354",
  void: "#7d7a70",
  lens: "#706e66",
  lattice: "#6f7b85",
  antenna: "#a49b87",
  sand: "#b8791a",
  fog: "#e6dfd0",
  ballastInk: "#cfc7b4",
  cessInk: "#c3bba8",
  sleeperHatch: "#8e8674",
  headLens: "#2a3138",
  headRim: "#6f7b85",
  hood: "#55636e",
  plate: "#f2ede2",
  wire: "#5a6a76",
  dropper: "#7b8791",
  mastFill: "#9aa3aa",
  mastFoot: "#a89f8c",
  lensGlow: "#2f8fb8",
  mastBand: "#8b959d",
  lampPole: "#9aa3aa",
};

export type PlatePalette = typeof NIGHT;

/**
 * Resolves the palette for the active theme. Called during render; the
 * attribute is already on <html> by then (it is set pre-paint), so this is
 * correct on the first client render as well as after a toggle.
 */
export function platePalette(theme?: string): PlatePalette {
  if (theme === "dark") return NIGHT;
  if (typeof document === "undefined") return LIGHT;
  const attr = document.documentElement.dataset.theme ?? "light";
  return attr === "dark" ? NIGHT : LIGHT;
}

/** Re-render the plate when the theme attribute changes. */
export function usePlateTheme(theme: "light" | "dark"): PlatePalette {
  return theme === "dark" ? NIGHT : LIGHT;
}

export { NIGHT as NIGHT_PALETTE, LIGHT as LIGHT_PALETTE };
