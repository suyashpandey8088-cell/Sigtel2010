"use client";

import { infraNodes, type InfraMode } from "@/lib/content/infrastructure-3d";
import { cn } from "@/lib/utils";

/**
 * Lightweight engineering schematic used on small screens and when the visitor
 * prefers reduced motion. Same nodes, same interaction, no WebGL.
 */
export function InfraSchematic({
  mode,
  selected,
  onSelect,
}: {
  mode: InfraMode;
  selected: string;
  onSelect: (key: string) => void;
}) {
  const points: Record<string, { x: number; y: number }> = {
    platform: { x: 96, y: 150 },
    cabling: { x: 214, y: 196 },
    axle: { x: 300, y: 250 },
    points: { x: 386, y: 250 },
    signal: { x: 512, y: 196 },
    cctv: { x: 448, y: 168 },
    ofc: { x: 264, y: 300 },
    hut: { x: 170, y: 268 },
    control: { x: 616, y: 150 },
    tower: { x: 566, y: 280 },
  };

  return (
    <div className="relative overflow-hidden border border-line bg-navy-900">
      <div className="pointer-events-none absolute inset-0 grid-blueprint-sm opacity-50" aria-hidden />
      <svg viewBox="0 0 720 380" className="relative block h-auto w-full" role="img" aria-label="Schematic of a railway section showing signalling and telecom components">
        <defs>
          <linearGradient id="schemGlow" x1="0" x2="1">
            <stop offset="0%" stopColor="#24C78B" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#24C78B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#24C78B" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* station + buildings */}
        <rect x="40" y="140" width="112" height="26" fill="#132436" stroke="#31465c" />
        <rect x="46" y="128" width="100" height="8" fill="#1b2f45" stroke="#31465c" strokeWidth="0.6" />
        <rect x="132" y="246" width="76" height="44" fill="#132436" stroke="#31465c" />
        <rect x="580" y="128" width="96" height="44" fill="#16293c" stroke="#31465c" />
        <rect x="586" y="136" width="84" height="3" fill="#24C78B" opacity="0.45" />

        {/* track */}
        <line x1="40" y1="238" x2="680" y2="238" stroke="#8fa0b3" strokeWidth="2" />
        <line x1="40" y1="262" x2="680" y2="262" stroke="#8fa0b3" strokeWidth="2" />
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={i} x1={44 + i * 22} y1="234" x2={44 + i * 22} y2="266" stroke="#25384c" strokeWidth="3" />
        ))}
        <line x1="40" y1="250" x2="680" y2="250" stroke="url(#schemGlow)" strokeWidth="1" strokeDasharray="4 6" />

        {/* fibre route */}
        <polyline points="96,300 264,300 400,318 566,300 640,262" fill="none" stroke="#24C78B" strokeWidth="1.4" strokeDasharray="6 5" opacity="0.65" />
        {points.ofc ? <circle cx={points.ofc.x} cy={points.ofc.y} r="3" fill="#24C78B" /> : null}

        {/* radio waves */}
        {[10, 18, 26].map((r) => (
          <circle key={r} cx="566" cy="252" r={r} fill="none" stroke="#24C78B" strokeWidth="0.7" opacity={0.5 - r / 90} />
        ))}

        {infraNodes.map((node, index) => {
          const point = points[node.key];
          if (!point) return null;
          const relevant = node.division === "both" || node.division === mode;
          const active = selected === node.key;
          const color = node.division === "telecom" ? "#24C78B" : node.division === "signalling" ? "#EF4444" : "#E2E8EF";
          return (
            <g
              key={node.key}
              role="button"
              tabIndex={0}
              aria-label={node.label}
              onClick={() => onSelect(node.key)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(node.key);
                }
              }}
              className="cursor-pointer outline-none"
              opacity={relevant ? 1 : 0.3}
            >
              <circle cx={point.x} cy={point.y} r="16" fill="transparent" />
              <circle cx={point.x} cy={point.y} r={active ? 8 : 5.5} fill="#050c16" stroke={color} strokeWidth="1.4" />
              <circle cx={point.x} cy={point.y} r={active ? 3 : 2} fill={color} />
              {active ? (
                <circle cx={point.x} cy={point.y} r="14" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" />
              ) : null}
              <text
                x={point.x}
                y={point.y - 14}
                textAnchor="middle"
                fontSize="8"
                fill={active ? "#F4F5F3" : "#A8B4C2"}
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="0.6"
              >
                {String(index + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="border-t border-line px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-tech">
        Tap a node to inspect the component · schematic, not to scale
      </p>
    </div>
  );
}
