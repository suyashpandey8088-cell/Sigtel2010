"use client";

import { infraNodes, type InfraMode } from "@/lib/content/infrastructure-3d";
import { useTheme } from "@/components/providers/theme";
import {
  LIGHT_PALETTE,
  NIGHT_PALETTE,
  type PlatePalette,
} from "@/lib/plate-palette";

/**
 * The live section — a measured engineering plate of a double-track section
 * carrying both disciplines: 4-aspect signal, points, axle counter, relay hut,
 * earthing and cable trough, level crossing with lifting barriers, CCTV, radio
 * mast, control room, and the OFC duct route beneath the cess.
 *
 * Deliberately a drawing rather than a 3D model: every component can be drawn
 * at a readable size, it stays crisp at any resolution, costs no WebGL context,
 * works with JavaScript disabled, and can carry the annotation a real signalling
 * plan carries. Motion is CSS-only (aspect sequence, boom operation, aviation
 * light) so nothing is hidden waiting for hydration.
 */

const WIDTH = 1600;
const HEIGHT = 900;
/** Visible window of the plate — the top 150px are empty sky. */
const VIEW_Y = 190;
const VIEW_H = 710;

const CATENARY_Y = 505;
const CONTACT_Y = 560;
const SAG = 46;
const MASTS = [300, 760, 1210, 1560];

const RED = "#EF4444";
const GREEN = "#24C78B";
const AMBER = "#F5B84B";

const STARS: [number, number, number, number][] = [
  [64, 78, 1.1, 0.5],
  [138, 42, 0.9, 0.35],
  [212, 108, 1, 0.45],
  [286, 56, 1.3, 0.6],
  [352, 132, 0.8, 0.3],
  [428, 74, 1, 0.4],
  [498, 148, 1.2, 0.5],
  [566, 48, 0.9, 0.35],
  [642, 118, 1.1, 0.45],
  [712, 62, 1, 0.4],
  [788, 96, 1.4, 0.55],
  [858, 38, 0.9, 0.3],
  [928, 126, 1, 0.4],
  [1004, 70, 1.2, 0.45],
  [1074, 140, 0.8, 0.3],
  [1148, 52, 1.1, 0.5],
  [1218, 104, 1, 0.35],
  [1288, 44, 1.3, 0.55],
  [1352, 122, 0.9, 0.3],
  [1428, 66, 1.1, 0.45],
  [1498, 136, 1, 0.35],
  [1564, 58, 1.2, 0.5],
  [176, 168, 0.8, 0.25],
  [1104, 190, 0.9, 0.25],
];

/** Chip anchor, leader point and label position for each component. */
const HOTSPOTS: Record<
  string,
  { anchor: [number, number]; chip: [number, number] }
> = {
  signal: { anchor: [908, 416], chip: [962, 336] },
  points: { anchor: [800, 700], chip: [686, 604] },
  axle: { anchor: [660, 642], chip: [614, 570] },
  hut: { anchor: [540, 632], chip: [494, 560] },
  cabling: { anchor: [468, 748], chip: [386, 806] },
  control: { anchor: [1458, 600], chip: [1492, 512] },
  tower: { anchor: [1312, 318], chip: [1366, 252] },
  ofc: { anchor: [886, 772], chip: [930, 828] },
  cctv: { anchor: [1243, 546], chip: [1178, 486] },
  platform: { anchor: [300, 632], chip: [214, 558] },
};

const SPANS = [0, ...MASTS, WIDTH];

/** Height of the catenary wire at x — a parabolic sag between masts. */
function catenaryY(x: number): number {
  for (let i = 0; i < SPANS.length - 1; i += 1) {
    const x0 = SPANS[i];
    const x1 = SPANS[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return (
        (1 - t) ** 2 * CATENARY_Y +
        2 * (1 - t) * t * (CATENARY_Y + SAG) +
        t ** 2 * CATENARY_Y
      );
    }
  }
  return CATENARY_Y;
}

/** Dropper positions and lengths, so the OHE reads like a real registration. */
function droppers(): { x: number; top: number }[] {
  const list: { x: number; top: number }[] = [];
  for (let i = 0; i < SPANS.length - 1; i += 1) {
    const x0 = SPANS[i];
    const x1 = SPANS[i + 1];
    for (const t of [0.16, 0.32, 0.5, 0.68, 0.84]) {
      const x = x0 + (x1 - x0) * t;
      list.push({ x, top: catenaryY(x) });
    }
  }
  return list;
}

const DROPPERS = droppers();

export function LiveSectionDiagram({
  mode,
  selected,
  hovered = "",
  onSelect,
  onHover,
  theme: forcedTheme,
}: {
  mode: InfraMode;
  selected: string;
  hovered?: string;
  onSelect: (key: string) => void;
  onHover?: (key: string) => void;
  /** Overrides the page theme — the stage is a night panel in both themes. */
  theme?: "light" | "dark";
}) {
  const { theme: pageTheme } = useTheme();
  const theme = forcedTheme ?? pageTheme;
  const P = theme === "dark" ? NIGHT_PALETTE : LIGHT_PALETTE;

  // Structural colours come from the palette; the accents stay constant so the
  // lamps read the same on paper as at night.
  const LINE = P.line;
  const LINE_SOFT = P.lineSoft;
  const BUILD = P.build;
  const BUILD_DARK = P.buildDark;
  const METAL = P.metal;
  const RAIL = P.rail;
  const INK = theme === "dark" ? "#F4F5F3" : "#0E2233";

  const focusKey = hovered || selected;
  const nodeOf = (key: string) => infraNodes.find((node) => node.key === key);
  const dimmed = (key: string) => {
    const node = nodeOf(key);
    if (!node) return false;
    return node.division !== "both" && node.division !== mode;
  };
  const edge = (key: string) => (focusKey === key ? INK : LINE);

  const handlers = (key: string) => ({
    onClick: () => onSelect(key),
    onMouseEnter: () => onHover?.(key),
    onMouseLeave: () => onHover?.(""),
    className: "ls-part cursor-pointer",
    opacity: dimmed(key) ? 0.2 : 1,
  });

  return (
    <figure className="relative w-full">
      <div className="-mx-1 overflow-x-auto pb-1 lg:overflow-visible">
        <div className="min-w-[1180px] lg:min-w-0">
          <svg
            viewBox={`0 ${VIEW_Y} ${WIDTH} ${VIEW_H}`}
            className="block h-auto w-full"
            role="img"
            aria-labelledby="ls-title ls-desc"
          >
            <title id="ls-title">
              Live section — signalling and telecom equipment on a double line,
              drawn as an engineering plate
            </title>
            <desc id="ls-desc">
              Left to right: station platform, relay hut with earthing and surge
              protection, axle counter, points and point machine, four-aspect
              colour-light signal, level crossing with lifting barriers,
              overhead equipment masts and contact wire, CCTV pole, radio mast
              with microwave dish, control room, and the optical-fibre cable
              duct running along the cess. Select a numbered component for
              detail.
            </desc>

            <defs>
              <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={P.skyTop} />
                <stop offset="58%" stopColor={P.skyMid} />
                <stop offset="100%" stopColor={P.skyLow} />
              </linearGradient>
              <radialGradient id="ls-horizon" cx="0.62" cy="0.72" r="0.55">
                <stop offset="0%" stopColor={P.horizon} stopOpacity="0.55" />
                <stop offset="100%" stopColor={P.skyTop} stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ls-ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={P.groundTop} />
                <stop offset="100%" stopColor={P.groundLow} />
              </linearGradient>
              <linearGradient id="ls-fore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={P.groundLow} stopOpacity="0" />
                <stop offset="100%" stopColor={P.fore} stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="ls-haze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={P.haze} stopOpacity="0" />
                <stop offset="70%" stopColor={P.haze} stopOpacity="0.35" />
                <stop offset="100%" stopColor={P.haze} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ls-window" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AMBER} stopOpacity="0.5" />
                <stop offset="100%" stopColor={AMBER} stopOpacity="0.16" />
              </linearGradient>

              <radialGradient id="ls-glow-red">
                <stop offset="0%" stopColor={RED} stopOpacity="0.75" />
                <stop offset="45%" stopColor={RED} stopOpacity="0.28" />
                <stop offset="100%" stopColor={RED} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="ls-glow-amber">
                <stop offset="0%" stopColor={AMBER} stopOpacity="0.7" />
                <stop offset="45%" stopColor={AMBER} stopOpacity="0.24" />
                <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="ls-glow-green">
                <stop offset="0%" stopColor={GREEN} stopOpacity="0.75" />
                <stop offset="45%" stopColor={GREEN} stopOpacity="0.26" />
                <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
              </radialGradient>

              <pattern
                id="ls-ballast"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <rect width="16" height="16" fill={P.ballastBase} />
                <circle cx="3" cy="4" r="1" fill={P.ballastSpeck[0]} />
                <circle cx="10" cy="10" r="1.1" fill={P.ballastSpeck[1]} />
                <circle cx="13" cy="3" r="0.8" fill={P.ballastSpeck[2]} />
                <circle cx="6" cy="13" r="0.9" fill={P.sleeperFront} />
              </pattern>

              <pattern
                id="ls-hatch"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke={LINE_SOFT}
                  strokeWidth="1"
                />
              </pattern>

              <pattern
                id="ls-lattice"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path d="M0 10 L10 0" stroke={LINE_SOFT} strokeWidth="0.9" />
              </pattern>
            </defs>

            {/* ---------------------------------------------------------------- sky */}
            <rect width={WIDTH} height={HEIGHT} fill="url(#ls-sky)" rx="0" />
            <rect width={WIDTH} height={HEIGHT} fill="url(#ls-horizon)" />
            {theme === "dark" ? (
              <g aria-hidden pointerEvents="none">
                {STARS.map(([x, y, r, o], index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={r}
                    fill={INK}
                    opacity={o}
                  />
                ))}
              </g>
            ) : null}

            {/* ------------------------------------------------------------ ridgeline */}
            <g aria-hidden pointerEvents="none">
              <path
                d="M0 470 L110 452 L198 462 L286 438 L372 458 L470 440 L556 460 L648 444 L742 462 L836 446 L930 460 L1024 442 L1116 462 L1210 448 L1300 462 L1392 444 L1478 460 L1560 450 L1600 458 L1600 520 L0 520 Z"
                fill={P.ridge}
              />
              <path
                d="M0 498 L96 488 L184 496 L268 484 L356 496 L448 486 L540 497 L632 487 L724 498 L816 489 L908 498 L1000 488 L1092 498 L1184 489 L1276 498 L1368 488 L1460 498 L1552 490 L1600 496 L1600 520 L0 520 Z"
                fill={P.ridge2}
              />
              <rect
                y={514}
                width={WIDTH}
                height={HEIGHT - 514}
                fill="url(#ls-ground)"
              />
              <rect y={468} width={WIDTH} height={92} fill="url(#ls-haze)" />
              {[
                [214, 522],
                [428, 519],
                [706, 521],
                [966, 518],
                [1188, 520],
                [1432, 519],
              ].map(([x, y], index) => (
                <g key={`gl${index}`}>
                  <circle cx={x} cy={y} r={9} fill={P.sand} opacity="0.1" />
                  <circle cx={x} cy={y} r={1.6} fill={P.sand} opacity="0.55" />
                </g>
              ))}
            </g>

            {/* ------------------------------------------------------------- trackbed */}
            <g aria-hidden pointerEvents="none">
              {/* rear track — the second line, drawn shallower to give the section depth */}
              <path
                d="M0 660 L1600 660 L1600 682 L0 682 Z"
                fill={P.ballastInk}
              />
              {Array.from({ length: 62 }).map((_, i) => (
                <rect
                  key={`rs${i}`}
                  x={8 + i * 26}
                  y={662}
                  width={9}
                  height={14}
                  fill={P.sleeperRear}
                  rx="0.5"
                />
              ))}
              <rect
                y={658}
                width={WIDTH}
                height={3}
                fill={P.railSoft}
                opacity="0.75"
              />

              {/* ballast, near track */}
              <path
                d="M0 686 L1600 686 L1600 754 L0 754 Z"
                fill="url(#ls-ballast)"
              />
              <path d="M0 752 L1600 752 L1600 764 L0 764 Z" fill={P.cessInk} />

              {Array.from({ length: 68 }).map((_, i) => (
                <rect
                  key={`fs${i}`}
                  x={2 + i * 24}
                  y={694}
                  width={10}
                  height={20}
                  fill={P.sleeperFront}
                  rx="0.5"
                />
              ))}

              {/* cable trough with lids */}
              {[
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                18, 19, 20, 21,
              ].map((i) => (
                <rect
                  key={`t${i}`}
                  x={i * 72 + 6}
                  y={735}
                  width={64}
                  height={9}
                  fill={P.trough}
                  stroke={P.troughLid}
                  strokeWidth="0.6"
                />
              ))}
            </g>

            {/* ------------------------------------------------------------- platform */}
            <g {...handlers("platform")}>
              <rect
                x={56}
                y={686}
                width={376}
                height={16}
                fill={BUILD}
                stroke={edge("platform")}
                strokeWidth={focusKey === "platform" ? 1.4 : 1}
              />
              <rect
                x={56}
                y={702}
                width={376}
                height={20}
                fill={BUILD_DARK}
                stroke={LINE_SOFT}
                strokeWidth="0.8"
              />
              <rect
                x={56}
                y={702}
                width={376}
                height={20}
                fill="url(#ls-hatch)"
                opacity="0.35"
              />
              <rect
                x={56}
                y={684}
                width={376}
                height={3}
                fill={AMBER}
                opacity="0.65"
              />

              {/* shelter: four posts, slab roof, bench, lamp */}
              {[104, 210, 316, 398].map((x) => (
                <rect
                  key={x}
                  x={x}
                  y={604}
                  width={4}
                  height={82}
                  fill={P.pole}
                  stroke={LINE_SOFT}
                  strokeWidth="0.5"
                />
              ))}
              <rect
                x={80}
                y={596}
                width={352}
                height={8}
                fill={P.buildRoof}
                stroke={edge("platform")}
                strokeWidth="0.9"
              />
              <rect x={80} y={604} width={352} height={2} fill={LINE_SOFT} />
              <rect
                x={140}
                y={664}
                width={92}
                height={6}
                fill={P.sleeperFront}
                stroke={LINE_SOFT}
                strokeWidth="0.6"
              />
              <rect x={148} y={670} width={3} height={16} fill={P.pole} />
              <rect x={221} y={670} width={3} height={16} fill={P.pole} />
              <rect
                x={286}
                y={622}
                width={12}
                height={8}
                fill={P.antenna}
                stroke={LINE_SOFT}
                strokeWidth="0.5"
              />

              {/* platform lamp */}
              <rect x={352} y={566} width={3.4} height={120} fill={P.pole} />
              <path
                d="M338 566 L370 566 L363 554 L345 554 Z"
                fill={P.antenna}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <ellipse
                cx={354}
                cy={567}
                rx={16}
                ry={7}
                fill={AMBER}
                opacity="0.18"
              />

              {/* name board */}
              <rect
                x={92}
                y={640}
                width={54}
                height={16}
                fill={P.buildPanel}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <text
                x={119}
                y={651}
                textAnchor="middle"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1"
                fill={P.boardInk}
              >
                PLATFORM
              </text>
            </g>

            {/* ------------------------------------------------------------ relay hut */}
            <g {...handlers("hut")}>
              <rect
                x={462}
                y={700}
                width={158}
                height={14}
                fill={BUILD_DARK}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <rect
                x={470}
                y={620}
                width={142}
                height={82}
                fill={BUILD}
                stroke={edge("hut")}
                strokeWidth={focusKey === "hut" ? 1.6 : 1.1}
              />
              <rect
                x={462}
                y={610}
                width={158}
                height={11}
                fill={P.buildRoof}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <rect
                x={462}
                y={608}
                width={158}
                height={3}
                fill={METAL}
                opacity="0.35"
              />
              {/* door + handle */}
              <rect
                x={486}
                y={640}
                width={32}
                height={62}
                fill={P.buildPanel}
                stroke={LINE_SOFT}
                strokeWidth="0.8"
              />
              <circle cx={512} cy={672} r={1.6} fill={METAL} />
              {/* louvres */}
              {[636, 648, 660, 672].map((y) => (
                <rect
                  key={y}
                  x={546}
                  y={y}
                  width={34}
                  height={5}
                  fill={P.buildPanel}
                  stroke={LINE_SOFT}
                  strokeWidth="0.5"
                />
              ))}
              {/* cable entry + earthing strip */}
              <rect
                x={524}
                y={700}
                width={18}
                height={8}
                fill={P.buildPanel}
                stroke={LINE_SOFT}
                strokeWidth="0.6"
              />
              {[528, 532, 536].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1={708}
                  x2={x}
                  y2={734}
                  stroke={P.lineMid}
                  strokeWidth="1"
                />
              ))}
              <rect
                x={462}
                y={636}
                width={3}
                height={64}
                fill={P.copper}
                opacity="0.9"
              />
              <circle cx={463} cy={700} r={2.4} fill={P.copper} />
            </g>

            {/* -------------------------------------------------------- axle counter */}
            <g {...handlers("axle")}>
              <rect
                x={654}
                y={648}
                width={5}
                height={54}
                fill={P.pole}
                stroke={LINE_SOFT}
                strokeWidth="0.5"
              />
              <rect
                x={640}
                y={626}
                width={34}
                height={24}
                fill={BUILD}
                stroke={edge("axle")}
                strokeWidth={focusKey === "axle" ? 1.6 : 1.1}
              />
              <rect x={645} y={632} width={24} height={4} fill={P.buildPanel} />
              <circle cx={668} cy={644} r={2} fill={GREEN} opacity="0.9" />
              <rect
                x={634}
                y={700}
                width={46}
                height={16}
                fill={BUILD_DARK}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <path
                d="M680 708 C 700 708 706 700 720 698"
                fill="none"
                stroke={P.lineMid}
                strokeWidth="1.1"
              />
              <path d="M646 700 L646 690" stroke={P.lineMid} strokeWidth="1" />
              {/* trackside junction box on the rail */}
              <rect
                x={712}
                y={690}
                width={14}
                height={10}
                fill={P.buildPanel}
                stroke={LINE_SOFT}
                strokeWidth="0.6"
              />
            </g>

            {/* --------------------------------------------------------------- points */}
            <g {...handlers("points")}>
              {/* turnout: two switch rails leaving the running line for the second track */}
              <path
                d="M766 690 Q 812 690 846 670"
                fill="none"
                stroke={RAIL}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M786 690 Q 826 689 858 672"
                fill="none"
                stroke={P.railSoft}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M846 670 L920 662"
                stroke={P.railSoft}
                strokeWidth="2.4"
              />
              <path
                d="M858 672 L920 666"
                stroke={P.railSoft}
                strokeWidth="1.8"
              />
              {/* crossing sleepers under the diverging road */}
              {[812, 832, 852, 872, 892, 912].map((x, i) => (
                <line
                  key={x}
                  x1={x}
                  y1={692 - i * 4}
                  x2={x}
                  y2={704 - i * 4}
                  stroke={P.sleeperHatch}
                  strokeWidth="4"
                />
              ))}
              {/* stretcher bars, drive rodding, point machine */}
              <line
                x1={800}
                y1={684}
                x2={800}
                y2={694}
                stroke={P.lineMid}
                strokeWidth="2"
              />
              <line
                x1={818}
                y1={680}
                x2={818}
                y2={690}
                stroke={P.lineMid}
                strokeWidth="2"
              />
              <rect
                x={778}
                y={704}
                width={40}
                height={20}
                fill={BUILD}
                stroke={edge("points")}
                strokeWidth={focusKey === "points" ? 1.6 : 1.1}
              />
              <rect x={784} y={708} width={12} height={5} fill={P.buildPanel} />
              <circle cx={812} cy={714} r={2.2} fill={METAL} />
              <line
                x1={790}
                y1={704}
                x2={800}
                y2={694}
                stroke={P.lineMid}
                strokeWidth="1.6"
              />
              <line
                x1={800}
                y1={704}
                x2={818}
                y2={690}
                stroke={P.lineMid}
                strokeWidth="1.2"
              />
            </g>

            {/* --------------------------------------------------------------- signal */}
            <g {...handlers("signal")}>
              <rect
                x={894}
                y={690}
                width={24}
                height={11}
                fill={BUILD_DARK}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <rect
                x={901}
                y={506}
                width={8}
                height={184}
                fill={P.steel}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              {[532, 552, 572, 592, 612, 632, 652].map((y) => (
                <rect
                  key={y}
                  x={909}
                  y={y}
                  width={8}
                  height={1.8}
                  fill={LINE_SOFT}
                />
              ))}
              {/* head with backing board */}
              <rect
                x={884}
                y={412}
                width={48}
                height={98}
                fill={P.void}
                stroke={LINE_SOFT}
                strokeWidth="1"
              />
              <rect
                x={889}
                y={417}
                width={38}
                height={88}
                fill={P.void}
                stroke={edge("signal")}
                strokeWidth={focusKey === "signal" ? 1.8 : 1.2}
              />
              {[431, 453, 475, 495].map((y) => (
                <rect
                  key={y}
                  x={892}
                  y={y - 9}
                  width={32}
                  height={18}
                  fill={P.headLens}
                  stroke={P.headRim}
                  strokeWidth="0.5"
                />
              ))}
              {/* aspects: red, amber, double amber, green */}
              <circle
                className="ls-lamp-red"
                cx={908}
                cy={431}
                r={12.5}
                fill="url(#ls-glow-red)"
              />
              <circle
                className="ls-lamp-red"
                cx={908}
                cy={431}
                r={5.2}
                fill={RED}
              />
              <circle
                className="ls-lamp-amber"
                cx={908}
                cy={453}
                r={12.5}
                fill="url(#ls-glow-amber)"
              />
              <circle
                className="ls-lamp-amber"
                cx={908}
                cy={453}
                r={5.2}
                fill={AMBER}
              />
              <circle cx={908} cy={475} r={5.2} fill={P.lens} />
              <circle
                className="ls-lamp-green"
                cx={908}
                cy={495}
                r={12.5}
                fill="url(#ls-glow-green)"
              />
              <circle
                className="ls-lamp-green"
                cx={908}
                cy={495}
                r={5.2}
                fill={GREEN}
              />
              {[431, 453, 475, 495].map((y) => (
                <path
                  key={y}
                  d={`M899 ${y - 8} Q908 ${y - 16} 917 ${y - 8}`}
                  fill="none"
                  stroke={P.hood}
                  strokeWidth="1.4"
                />
              ))}
              {/* number plate + location case */}
              <rect
                x={894}
                y={516}
                width={22}
                height={10}
                fill={P.plate}
                stroke={LINE_SOFT}
                strokeWidth="0.6"
              />
              <rect
                x={922}
                y={666}
                width={30}
                height={28}
                fill={BUILD}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <rect x={926} y={672} width={22} height={4} fill={P.buildPanel} />
            </g>

            {/* ------------------------------------------- running line (nearest track) */}
            <g aria-hidden pointerEvents="none">
              <rect y={688} width={WIDTH} height={5} fill={RAIL} />
              <rect
                y={688}
                width={WIDTH}
                height={1.4}
                fill={P.railGlow}
                opacity="0.85"
              />
              <rect y={702} width={WIDTH} height={3.4} fill={P.railSoft} />
            </g>

            {/* ------------------------------------------------------- level crossing */}
            <g aria-hidden pointerEvents="none">
              {/* road approaching from the foreground, crossing the lines */}
              <path
                d="M966 846 L1002 646 L1082 646 L1178 846 Z"
                fill={P.road}
                stroke={P.roadEdge}
                strokeWidth="0.9"
              />
              <path
                d="M1002 646 L1082 646"
                stroke={P.lineMid}
                strokeWidth="1.4"
              />
              <path
                d="M986 846 L1016 646"
                stroke={P.roadLine}
                strokeWidth="1.1"
                strokeDasharray="14 12"
              />
              <path
                d="M1158 846 L1068 646"
                stroke={P.roadLine}
                strokeWidth="1.1"
                strokeDasharray="14 12"
              />
              {/* deck over the rails */}
              <path
                d="M1008 684 L1076 684 L1080 718 L1004 718 Z"
                fill={P.deck}
                stroke={P.deckEdge}
                strokeWidth="0.9"
              />
              {[1018, 1030, 1042, 1054, 1066].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1={688}
                  x2={x - 1}
                  y2={714}
                  stroke={P.deckRib}
                  strokeWidth="1.2"
                />
              ))}
              <path
                d="M1006 684 L1004 718 M1078 684 L1080 718"
                stroke={P.board}
                strokeWidth="1.1"
                opacity="0.55"
              />

              {/* far-side gate: cabinet, boom, pivot */}
              <rect
                x={936}
                y={696}
                width={28}
                height={40}
                fill={BUILD}
                stroke={LINE_SOFT}
                strokeWidth="0.9"
              />
              <circle cx={950} cy={726} r={2} fill={GREEN} opacity="0.85" />
              <g className="ls-boom-left">
                <rect x={958} y={711} width={146} height={5} fill={P.board} />
                {[0, 1, 2, 3].map((i) => (
                  <rect
                    key={i}
                    x={958 + i * 37}
                    y={711}
                    width={18}
                    height={5}
                    fill={RED}
                    opacity="0.92"
                  />
                ))}
                <circle
                  cx={958}
                  cy={713.5}
                  r={4.6}
                  fill={P.antenna}
                  stroke={LINE_SOFT}
                  strokeWidth="0.8"
                />
              </g>

              {/* near-side gate: cabinet, boom, pivot */}
              <rect
                x={1138}
                y={724}
                width={28}
                height={38}
                fill={BUILD}
                stroke={LINE_SOFT}
                strokeWidth="0.9"
              />
              <circle cx={1152} cy={752} r={2} fill={GREEN} opacity="0.85" />
              <g className="ls-boom-right">
                <rect x={1000} y={736} width={150} height={5} fill={P.board} />
                {[0, 1, 2, 3].map((i) => (
                  <rect
                    key={i}
                    x={1000 + i * 37}
                    y={736}
                    width={18}
                    height={5}
                    fill={RED}
                    opacity="0.92"
                  />
                ))}
                <circle
                  cx={1150}
                  cy={738.5}
                  r={4.6}
                  fill={P.antenna}
                  stroke={LINE_SOFT}
                  strokeWidth="0.8"
                />
              </g>

              {/* road signals with crossbuck */}
              {[1006, 1078].map((x, index) => (
                <g key={x}>
                  <rect
                    x={x - 2.6}
                    y={620}
                    width={5.2}
                    height={70}
                    fill={P.steel}
                    stroke={LINE_SOFT}
                    strokeWidth="0.5"
                  />
                  <rect
                    x={x - 6}
                    y={684}
                    width={12}
                    height={6}
                    fill={P.cabinet}
                  />
                  <path
                    d={`M${x - 14} ${602} L${x + 14} ${628} M${x + 14} ${602} L${x - 14} ${628}`}
                    stroke={P.board}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <circle
                    className="ls-lamp-red"
                    cx={x}
                    cy={638}
                    r={10}
                    fill="url(#ls-glow-red)"
                  />
                  <circle
                    className="ls-lamp-red"
                    cx={x}
                    cy={638}
                    r={4.6}
                    fill={RED}
                    style={{ animationDelay: index ? "0.55s" : "0s" }}
                  />
                  <circle
                    cx={x}
                    cy={654}
                    r={4.2}
                    fill={P.sleeperFront}
                    stroke={P.lineMid}
                    strokeWidth="0.6"
                  />
                </g>
              ))}
            </g>

            {/* --------------------------------------------------------------- OHE */}
            <g aria-hidden pointerEvents="none">
              {/* contact + catenary wires */}
              <line
                x1={0}
                y1={CONTACT_Y}
                x2={WIDTH}
                y2={CONTACT_Y}
                stroke={METAL}
                strokeWidth="1.3"
                opacity="0.85"
              />
              {SPANS.slice(0, -1).map((x0, index) => {
                const x1 = SPANS[index + 1];
                const mid = (x0 + x1) / 2;
                return (
                  <path
                    key={`cat${index}`}
                    d={`M${x0} ${CATENARY_Y} Q${mid} ${CATENARY_Y + SAG * 2} ${x1} ${CATENARY_Y}`}
                    fill="none"
                    stroke={P.wire}
                    strokeWidth="1"
                    opacity="0.8"
                  />
                );
              })}
              {DROPPERS.map((d, index) => (
                <line
                  key={`d${index}`}
                  x1={d.x}
                  y1={d.top}
                  x2={d.x}
                  y2={CONTACT_Y}
                  stroke={P.dropper}
                  strokeWidth="0.6"
                  opacity="0.65"
                />
              ))}

              {MASTS.map((x) => (
                <g key={x}>
                  <rect
                    x={x - 4}
                    y={470}
                    width={8}
                    height={222}
                    fill={P.mastFill}
                    stroke={LINE_SOFT}
                    strokeWidth="0.7"
                  />
                  <rect
                    x={x - 9}
                    y={686}
                    width={18}
                    height={8}
                    fill={P.mastFoot}
                    stroke={LINE_SOFT}
                    strokeWidth="0.6"
                  />
                  {/* cantilever + registration */}
                  <path
                    d={`M${x} 522 L${x + 66} 552`}
                    stroke={P.line}
                    strokeWidth="2.4"
                  />
                  <path
                    d={`M${x} 556 L${x + 70} 556`}
                    stroke={P.line}
                    strokeWidth="2"
                  />
                  <path
                    d={`M${x + 66} 552 L${x + 70} 560`}
                    stroke={P.line}
                    strokeWidth="1.6"
                  />
                  <rect
                    x={x + 30}
                    y={536}
                    width={9}
                    height={9}
                    fill={P.lineMid}
                    stroke={LINE_SOFT}
                    strokeWidth="0.5"
                  />
                  <rect
                    x={x + 44}
                    y={548}
                    width={9}
                    height={9}
                    fill={P.lineMid}
                    stroke={LINE_SOFT}
                    strokeWidth="0.5"
                  />
                  <rect
                    x={x - 6}
                    y={500}
                    width={12}
                    height={7}
                    fill={P.lineMid}
                    stroke={LINE_SOFT}
                    strokeWidth="0.5"
                  />
                </g>
              ))}
            </g>

            {/* --------------------------------------------------------------- CCTV */}
            <g {...handlers("cctv")}>
              <rect
                x={1236}
                y={548}
                width={7}
                height={146}
                fill={P.pole}
                stroke={LINE_SOFT}
                strokeWidth="0.6"
              />
              <rect x={1228} y={686} width={22} height={8} fill={P.mastFoot} />
              <rect
                x={1214}
                y={532}
                width={40}
                height={16}
                fill={BUILD}
                stroke={edge("cctv")}
                strokeWidth={focusKey === "cctv" ? 1.6 : 1.1}
              />
              <path
                d="M1254 534 L1268 538 L1268 542 L1254 546 Z"
                fill={P.antenna}
                stroke={LINE_SOFT}
                strokeWidth="0.6"
              />
              <circle
                cx={1266}
                cy={540}
                r={2.4}
                fill={P.lensGlow}
                opacity="0.8"
              />
              <rect
                x={1218}
                y={556}
                width={26}
                height={12}
                fill={BUILD}
                stroke={LINE_SOFT}
                strokeWidth="0.8"
              />
              <circle
                cx={1216}
                cy={562}
                r={3}
                fill={P.buildPanel}
                stroke={P.lineMid}
                strokeWidth="0.6"
              />
              {/* field of view */}
              <path
                d="M1268 540 L1382 604 M1268 540 L1382 512"
                stroke={GREEN}
                strokeWidth="0.7"
                strokeDasharray="5 6"
                opacity="0.35"
              />
              {/* NVR cabinet */}
              <rect
                x={1219}
                y={672}
                width={30}
                height={22}
                fill={BUILD_DARK}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <circle cx={1234} cy={683} r={2} fill={GREEN} opacity="0.9" />
            </g>

            {/* ---------------------------------------------------------- radio mast */}
            <g {...handlers("tower")}>
              <path
                d="M1286 690 L1304 250 L1318 250 L1336 690 Z"
                fill={P.build}
                stroke={edge("tower")}
                strokeWidth={focusKey === "tower" ? 1.6 : 1.1}
              />
              <path
                d="M1286 690 L1304 250 L1318 250 L1336 690 Z"
                fill="url(#ls-lattice)"
                opacity="0.5"
              />
              {Array.from({ length: 13 }).map((_, i) => {
                const y = 676 - i * 36;
                const t = (690 - y) / 440;
                const half = 24 - t * 17;
                const cxTop = 1311;
                return (
                  <g key={i}>
                    <line
                      x1={cxTop - half}
                      y1={y}
                      x2={cxTop + half - 1}
                      y2={y - 18}
                      stroke={P.lattice}
                      strokeWidth="1.3"
                    />
                    <line
                      x1={cxTop + half}
                      y1={y}
                      x2={cxTop - half + 1}
                      y2={y - 18}
                      stroke={P.lattice}
                      strokeWidth="1.3"
                    />
                    <line
                      x1={cxTop - half}
                      y1={y}
                      x2={cxTop + half}
                      y2={y}
                      stroke={P.lattice}
                      strokeWidth="1.3"
                    />
                  </g>
                );
              })}
              <rect
                x={1268}
                y={688}
                width={84}
                height={14}
                fill={BUILD_DARK}
                stroke={LINE_SOFT}
                strokeWidth="0.8"
              />
              <rect x={1268} y={684} width={84} height={5} fill={P.mastBand} />
              {/* crossarm at the top with the aviation light */}
              <line
                x1={1298}
                y1={266}
                x2={1324}
                y2={266}
                stroke={P.lattice}
                strokeWidth="2"
              />
              <circle
                className="ls-aviation"
                cx={1311}
                cy={246}
                r={16}
                fill="url(#ls-glow-red)"
              />
              <circle
                className="ls-aviation"
                cx={1311}
                cy={246}
                r={5}
                fill={RED}
              />
              {/* microwave dish on a headframe */}
              <line
                x1={1324}
                y1={330}
                x2={1348}
                y2={330}
                stroke={P.lattice}
                strokeWidth="2"
              />
              <circle
                cx={1356}
                cy={338}
                r={20}
                fill={P.void}
                stroke={P.railSoft}
                strokeWidth="1.6"
              />
              <circle
                cx={1356}
                cy={338}
                r={11}
                fill="none"
                stroke={P.lineMid}
                strokeWidth="1"
              />
              <line
                x1={1336}
                y1={330}
                x2={1356}
                y2={338}
                stroke={P.railSoft}
                strokeWidth="1.2"
              />
              <path
                d="M1356 338 L1374 330"
                stroke={P.railSoft}
                strokeWidth="1"
              />
              {/* sector antennas with brackets */}
              {[382, 418, 454].map((y) => (
                <g key={y}>
                  <line
                    x1={1324}
                    y1={y + 8}
                    x2={1332}
                    y2={y + 8}
                    stroke={P.lattice}
                    strokeWidth="1.6"
                  />
                  <rect
                    x={1332}
                    y={y}
                    width={9}
                    height={22}
                    fill={P.antenna}
                    stroke={P.lineMid}
                    strokeWidth="0.8"
                  />
                </g>
              ))}
              {[392, 402, 412].map((y) => (
                <path
                  key={y}
                  d={`M1341 ${y} Q1364 ${y - 10} 1386 ${y}`}
                  fill="none"
                  stroke={GREEN}
                  strokeWidth="0.7"
                  opacity="0.22"
                />
              ))}
              {/* guys */}
              <line
                x1={1309}
                y1={270}
                x2={1230}
                y2={700}
                stroke={P.lineMid}
                strokeWidth="0.7"
                strokeDasharray="7 6"
                opacity="0.55"
              />
              <line
                x1={1309}
                y1={270}
                x2={1390}
                y2={700}
                stroke={P.lineMid}
                strokeWidth="0.7"
                strokeDasharray="7 6"
                opacity="0.55"
              />
            </g>

            {/* --------------------------------------------------------- control room */}
            <g {...handlers("control")}>
              <rect
                x={1372}
                y={700}
                width={182}
                height={14}
                fill={BUILD_DARK}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <rect
                x={1380}
                y={578}
                width={166}
                height={122}
                fill={BUILD}
                stroke={edge("control")}
                strokeWidth={focusKey === "control" ? 1.6 : 1.1}
              />
              <rect
                x={1372}
                y={568}
                width={182}
                height={12}
                fill={P.buildRoof}
                stroke={LINE_SOFT}
                strokeWidth="0.7"
              />
              <rect
                x={1372}
                y={566}
                width={182}
                height={3}
                fill={METAL}
                opacity="0.35"
              />
              {[1396, 1436, 1476].map((x) => (
                <g key={x}>
                  <rect
                    x={x}
                    y={600}
                    width={28}
                    height={22}
                    fill="url(#ls-window)"
                    stroke={LINE_SOFT}
                    strokeWidth="0.7"
                  />
                  <line
                    x1={x + 14}
                    y1={600}
                    x2={x + 14}
                    y2={622}
                    stroke={LINE_SOFT}
                    strokeWidth="0.6"
                  />
                </g>
              ))}
              <rect
                x={1512}
                y={628}
                width={24}
                height={72}
                fill={P.buildPanel}
                stroke={LINE_SOFT}
                strokeWidth="0.8"
              />
              <circle cx={1517} cy={664} r={1.6} fill={METAL} />
              <rect
                x={1392}
                y={648}
                width={30}
                height={16}
                fill={P.buildPanel}
                stroke={LINE_SOFT}
                strokeWidth="0.6"
              />
              <rect
                x={1430}
                y={648}
                width={30}
                height={16}
                fill={P.buildPanel}
                stroke={LINE_SOFT}
                strokeWidth="0.6"
              />
              {/* roof antenna and tray */}
              <rect x={1452} y={510} width={4} height={58} fill={P.pole} />
              {[516, 528, 540].map((y) => (
                <line
                  key={y}
                  x1={1442}
                  y1={y}
                  x2={1466}
                  y2={y}
                  stroke={LINE_SOFT}
                  strokeWidth="1.6"
                />
              ))}
              <path
                d="M1380 692 L1312 700"
                stroke={P.lineMid}
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <text
                x={1462}
                y={556}
                textAnchor="middle"
                fontSize="9.5"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.4"
                fill={P.boardInk}
              >
                RTU
              </text>
            </g>

            {/* ------------------------------------------------- OFC duct along cess */}
            <g {...handlers("ofc")}>
              <line
                x1={40}
                y1={772}
                x2={1560}
                y2={772}
                stroke={GREEN}
                strokeWidth="2"
                strokeDasharray="12 7"
                opacity="0.75"
              />
              {[150, 520, 900, 1300].map((x) => (
                <g key={x}>
                  <rect
                    x={x - 11}
                    y={764}
                    width={22}
                    height={16}
                    fill={P.buildPanel}
                    stroke={edge("ofc")}
                    strokeWidth={focusKey === "ofc" ? 1.4 : 0.9}
                  />
                  <line
                    x1={x - 7}
                    y1={772}
                    x2={x + 7}
                    y2={772}
                    stroke={LINE_SOFT}
                    strokeWidth="0.8"
                  />
                </g>
              ))}
              {[220, 340, 640, 760, 1040, 1160, 1420].map((x) => (
                <g key={x}>
                  <rect x={x} y={752} width={2.6} height={20} fill={P.pole} />
                  <rect
                    x={x - 3}
                    y={748}
                    width={9}
                    height={5}
                    fill={GREEN}
                    opacity="0.75"
                  />
                </g>
              ))}
            </g>

            {/* --------------------------------------------- earthing & cable route */}
            <g {...handlers("cabling")}>
              {[452, 856, 1266].map((x) => (
                <g key={x}>
                  <rect
                    x={x - 9}
                    y={752}
                    width={22}
                    height={12}
                    fill={P.buildPanel}
                    stroke={edge("cabling")}
                    strokeWidth={focusKey === "cabling" ? 1.2 : 0.8}
                  />
                  <line
                    x1={x - 5}
                    y1={758}
                    x2={x + 8}
                    y2={758}
                    stroke={P.copper}
                    strokeWidth="1.6"
                  />
                  <line
                    x1={x + 2}
                    y1={758}
                    x2={x + 2}
                    y2={736}
                    stroke={P.copper}
                    strokeWidth="1"
                    opacity="0.7"
                  />
                </g>
              ))}
              {/* SPD cabinet beside the relay hut */}
              <rect
                x={624}
                y={664}
                width={26}
                height={36}
                fill={BUILD}
                stroke={edge("cabling")}
                strokeWidth={focusKey === "cabling" ? 1.4 : 0.9}
              />
              <rect x={629} y={670} width={16} height={4} fill={P.buildPanel} />
              <rect x={629} y={678} width={16} height={4} fill={P.buildPanel} />
              <circle cx={645} cy={694} r={1.8} fill={GREEN} opacity="0.9" />
            </g>

            {/* ------------------------------------------------------------- fencing */}
            <g aria-hidden pointerEvents="none" opacity="0.5">
              {Array.from({ length: 26 }).map((_, i) => {
                const x = 26 + i * 60;
                if (x > 930 && x < 1200) return null;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={784}
                    width={2}
                    height={26}
                    fill={P.sleeperFront}
                  />
                );
              })}
              <line
                x1={0}
                y1={792}
                x2={930}
                y2={792}
                stroke={P.sleeperFront}
                strokeWidth="1"
              />
              <line
                x1={1200}
                y1={792}
                x2={1600}
                y2={792}
                stroke={P.sleeperFront}
                strokeWidth="1"
              />
            </g>

            {/* ---------------------------------------------------------- foreground */}
            <rect
              y={800}
              width={WIDTH}
              height={100}
              fill="url(#ls-fore)"
              aria-hidden
              pointerEvents="none"
            />

            {/* ------------------------------------------------------------ readout */}
            <g aria-hidden pointerEvents="none">
              <rect
                x={40}
                y={836}
                width={524}
                height={40}
                fill={P.chip}
                fillOpacity="0.82"
                stroke={LINE_SOFT}
                strokeWidth="0.8"
              />
              <circle cx={60} cy={856} r={3.4} fill={RED} />
              <text
                x={74}
                y={861}
                fontSize="12"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.6"
                fill={P.boardInk}
              >
                SECTION&nbsp;READY
              </text>
              <text
                className="ls-readout-red"
                x={210}
                y={861}
                fontSize="12"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.6"
                fill={RED}
              >
                ASPECT&nbsp;RED&nbsp;·&nbsp;STOP
              </text>
              <text
                className="ls-readout-amber"
                x={210}
                y={861}
                fontSize="12"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.6"
                fill={AMBER}
              >
                ASPECT&nbsp;AMBER&nbsp;·&nbsp;CAUTION
              </text>
              <text
                className="ls-readout-green"
                x={210}
                y={861}
                fontSize="12"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.6"
                fill={GREEN}
              >
                ASPECT&nbsp;GREEN&nbsp;·&nbsp;CLEAR
              </text>
              <text
                x={858}
                y={861}
                fontSize="10.5"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.3"
                fill={P.boardInk}
              >
                SECTION&nbsp;ELEVATION&nbsp;·&nbsp;NOT&nbsp;TO&nbsp;SCALE
              </text>
            </g>

            {/* ------------------------------------------------------- static labels */}
            <g
              aria-hidden
              pointerEvents="none"
              className="ls-annotation"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="1.3"
              fill={P.chipInk}
            >
              <text x={940} y={480} fontSize="9">
                4-ASPECT
              </text>
              <text x={262} y={452} fontSize="9.5">
                OHE · 25 kV
              </text>
              <text x={600} y={790} fontSize="9">
                OFC · HDPE DUCT
              </text>
              <text x={1190} y={474} fontSize="9">
                CCTV
              </text>
            </g>

            {/* ------------------------------------------------------------ hotspots */}
            {infraNodes.map((node, index) => {
              const spot = HOTSPOTS[node.key];
              if (!spot) return null;
              const [ax, ay] = spot.anchor;
              const [cx, cy] = spot.chip;
              const active = focusKey === node.key;
              const dim = node.division !== "both" && node.division !== mode;
              const accent =
                node.division === "telecom"
                  ? GREEN
                  : node.division === "signalling"
                    ? RED
                    : INK;
              return (
                <g
                  key={node.key}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label} — show detail`}
                  aria-pressed={selected === node.key}
                  onClick={() => onSelect(node.key)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(node.key);
                    }
                  }}
                  onMouseEnter={() => onHover?.(node.key)}
                  onMouseLeave={() => onHover?.("")}
                  onFocus={() => onHover?.(node.key)}
                  onBlur={() => onHover?.("")}
                  opacity={dim ? 0.42 : 1}
                  className="ls-chip cursor-pointer outline-none"
                >
                  <line
                    x1={cx + 15}
                    y1={cy + 15}
                    x2={ax}
                    y2={ay}
                    stroke={active ? INK : P.lineMid}
                    strokeWidth={active ? 1.1 : 0.7}
                    strokeDasharray={active ? "0" : "3 3"}
                    opacity="0.9"
                  />
                  <circle
                    cx={ax}
                    cy={ay}
                    r={active ? 4 : 2.6}
                    fill={active ? accent : P.void}
                    stroke={active ? accent : P.chipInk}
                    strokeWidth="1.1"
                  />
                  <rect
                    className="ls-chip-box"
                    x={cx}
                    y={cy}
                    width={30}
                    height={30}
                    fill={active ? P.chipActive : P.chip}
                    stroke={active ? accent : P.lineMid}
                    strokeWidth={active ? 1.5 : 0.9}
                  />
                  <text
                    x={cx + 15}
                    y={cy + 19.5}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="IBM Plex Mono, monospace"
                    letterSpacing="0.6"
                    fill={active ? INK : P.chipInk}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </text>
                  {active ? (
                    <circle
                      cx={cx + 15}
                      cy={cy + 15}
                      r={22}
                      fill="none"
                      stroke={accent}
                      strokeWidth="0.8"
                      opacity="0.35"
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </figure>
  );
}
