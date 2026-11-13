/**
 * SIG-TEL live-section plate palette — daylight only.
 *
 * The drawing is printed on warm paper, in engineering blue ink, with the
 * signal lamps as the only saturated colour. Values are literal hexes because
 * SVG gradient stops cannot reliably read custom properties, so they are
 * declared once here and shared by every drawing surface.
 */

const PLATE = {
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

export type PlatePalette = typeof PLATE;

/** The plate palette. The site has one theme, so this is a constant. */
export function platePalette(): PlatePalette {
  return PLATE;
}

export { PLATE as PLATE_PALETTE, PLATE as LIGHT_PALETTE, PLATE as NIGHT_PALETTE };
