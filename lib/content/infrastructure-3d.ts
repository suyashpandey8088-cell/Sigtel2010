export type InfraMode = "signalling" | "telecom";

export interface InfraNode {
  key: string;
  label: string;
  short: string;
  division: InfraMode | "both";
  purpose: string;
  capability: string;
  tags: string[];
  /** position and anchor are in plate coordinates, kept for reference */
  position: [number, number, number];
  anchor: [number, number, number];
}

/**
 * Components of the interactive infrastructure model. Copy for every node is
 * drawn from SIG-TEL's published capability list.
 */
export const infraNodes: InfraNode[] = [
  {
    key: "signal",
    label: "4-aspect colour light signal",
    short: "Signal",
    division: "signalling",
    purpose:
      "The visible output of the interlocking. Aspect, route and overlap are proved electrically before a signal can clear.",
    capability: "Signal erection, wiring, testing and commissioning — including 25 kV AC traction modifications.",
    tags: ["Signals", "Aspects", "Route setting"],
    position: [6.4, 0, 2.4],
    anchor: [6.4, 4.4, 2.4],
  },
  {
    key: "points",
    label: "Points & point machine",
    short: "Points",
    division: "signalling",
    purpose:
      "Points divert a train between lines. The point machine drives and detects the switch, and the interlocking refuses a route unless detection is proved.",
    capability: "Point machine installation and rodding, connection and detection testing for new loop lines and yards.",
    tags: ["Point machines", "Detection", "Yard remodelling"],
    position: [0.8, 0, 0],
    anchor: [0.8, 2.2, 0],
  },
  {
    key: "axle",
    label: "Axle counter & track circuit",
    short: "Detection",
    division: "signalling",
    purpose:
      "Detection proves a section is clear. Axle counters count wheels in and out; track circuits detect the vehicle through the rails.",
    capability: "Block proving by axle counter for doubling, track circuits and BPAC commissioning.",
    tags: ["BPAC", "Axle counters", "Track circuits"],
    position: [-4.2, 0, 0.9],
    anchor: [-4.2, 2.0, 0.9],
  },
  {
    key: "hut",
    label: "Location hut & EI relay room",
    short: "Interlocking",
    division: "signalling",
    purpose:
      "Houses the interlocking and location equipment: relays, EI racks, cable terminations and surge protection for the section.",
    capability: "Electronic and relay interlocking installation, indoor wiring and circuit modification at working stations.",
    tags: ["EI", "Relay interlocking", "SPD"],
    position: [-8.6, 0, 4.2],
    anchor: [-8.6, 4.0, 4.2],
  },
  {
    key: "cabling",
    label: "Earthing & cable route",
    short: "Earthing",
    division: "signalling",
    purpose:
      "Signalling cable in protected channels, with earthing and surge protection at every location — the layer that keeps the rest working through lightning and power faults.",
    capability: "Section-wide earthing improvement, SPD installation and fire-rated polyolefin cable channels.",
    tags: ["Earthing", "SPD", "Fire-rated channels"],
    position: [-6.2, 0, -1.6],
    anchor: [-6.2, 1.6, -1.6],
  },
  {
    key: "control",
    label: "Control & telecom room",
    short: "Control",
    division: "both",
    purpose:
      "Where the section is supervised: the control desk, network monitoring and recording systems that operations staff work from.",
    capability: "Control desk interfaces, NMS integration and system handover with joint commissioning records.",
    tags: ["NMS", "Control desk", "Recording"],
    position: [9.4, 0, 5.4],
    anchor: [9.4, 4.2, 5.4],
  },
  {
    key: "tower",
    label: "Telecom & radio mast",
    short: "Radio",
    division: "telecom",
    purpose:
      "Radio and point-to-point links for operational communication and pipeline telemetry where cabled routes are impractical.",
    capability: "VHF radio, telecom shelters and radio mast installation with end-to-end channel testing.",
    tags: ["VHF radio", "Masts", "Telemetry"],
    position: [3.2, 0, -4.8],
    anchor: [3.2, 8.2, -4.8],
  },
  {
    key: "ofc",
    label: "OFC route in HDPE duct",
    short: "OFC",
    division: "telecom",
    purpose:
      "Optical fibre is the backbone behind signalling control, CCTV and network monitoring — laid in duct, spliced and tested link by link.",
    capability: "HDPE duct laying, fibre blowing, splicing and OTDR-tested handover along rail and pipeline routes.",
    tags: ["OFC", "HDPE", "OTDR"],
    position: [-1.5, 0, -2.6],
    anchor: [-1.5, 1.8, -2.6],
  },
  {
    key: "cctv",
    label: "CCTV & surveillance",
    short: "CCTV",
    division: "telecom",
    purpose:
      "Eyes on tunnels, depots, stations and plants — with recording and access control so events can be reviewed, not just watched.",
    capability: "IP CCTV, NVR recording and access control for tunnels, depots and pipeline stations.",
    tags: ["IP CCTV", "NVR", "Access control"],
    position: [-2.8, 0, 1.9],
    anchor: [-2.8, 3.6, 1.9],
  },
  {
    key: "platform",
    label: "Station platform & PA",
    short: "Station",
    division: "both",
    purpose:
      "The passenger-facing layer: platform equipment, public address and station telecom working alongside the signalling system.",
    capability: "Station S&T works, public address, EPABX and audio systems integration.",
    tags: ["PA", "EPABX", "Station S&T"],
    position: [-12.6, 0, -2.2],
    anchor: [-12.6, 4.4, -2.2],
  },
];

export const modeMeta: Record<InfraMode, { title: string; blurb: string; accent: string }> = {
  signalling: {
    title: "Signalling mode",
    blurb: "Interlocking, signals, detection and protection — the layer that proves it is safe to move.",
    accent: "#E44D43",
  },
  telecom: {
    title: "Telecommunication mode",
    blurb: "Fibre, radio, surveillance and monitoring — the layer that keeps operations connected.",
    accent: "#43866B",
  },
};
