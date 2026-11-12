/**
 * Layout and camera framing for the 3D live section.
 *
 * Kept free of imports so the same table can be projected by
 * `scripts/preview-scene.ts` outside the browser: the script renders every
 * camera pose to an image and checks that the selected component actually
 * fills the frame. Coordinates are metres: X runs along the track, Y is up,
 * Z is across the track with +Z toward the viewer.
 */

export type Vec3 = readonly [number, number, number];

export interface Mass {
  key?: string;
  /** centre of the box */
  pos: Vec3;
  /** full extent along x, y, z */
  size: Vec3;
  color: string;
  rotY?: number;
}

export interface CameraPose {
  position: Vec3;
  target: Vec3;
}

/* ------------------------------------------------------------------ tracks */

export const NEAR_LINE_Z = 1.75;
export const FAR_LINE_Z = -1.75;
export const GAUGE = 1.676;
export const TRACK_FROM = -26;
export const TRACK_TO = 26;

/** Cess, cable route and overhead equipment offsets. */
export const TROUGH_Z = 4.15;
export const DUCT_Z = 4.6;
export const MAST_NEAR_Z = 5.2;
export const MAST_FAR_Z = -4.9;

export const MAST_X_NEAR = [-21, -13, -5.5, 3.5, 11.5, 19.5];
export const MAST_X_FAR = [-17, -9, -1, 7, 15];

export const CROSSING_X = 7.6;

/* ------------------------------------------------------------------ masses */

/**
 * The large volumes of the scene. Components are modelled around these, and
 * the offline preview projects them, so framing is judged against what is
 * actually on screen rather than a guess.
 */
export const SCENE_MASSES: Mass[] = [
  { key: "ground", pos: [0, -0.16, 0], size: [74, 0.3, 34], color: "#070f19" },
  { key: "ballast", pos: [0, 0.06, 0], size: [54, 0.24, 7.6], color: "#10202f" },

  // running lines
  { pos: [0, 0.28, NEAR_LINE_Z - GAUGE / 2], size: [52, 0.13, 0.14], color: "#93a5b8" },
  { pos: [0, 0.28, NEAR_LINE_Z + GAUGE / 2], size: [52, 0.13, 0.14], color: "#93a5b8" },
  { pos: [0, 0.28, FAR_LINE_Z - GAUGE / 2], size: [52, 0.13, 0.14], color: "#7d8fa2" },
  { pos: [0, 0.28, FAR_LINE_Z + GAUGE / 2], size: [52, 0.13, 0.14], color: "#7d8fa2" },

  // cess furniture
  { key: "trough", pos: [0, 0.2, TROUGH_Z], size: [50, 0.28, 0.5], color: "#8a5a2b" },
  { key: "duct", pos: [0, 0.12, DUCT_Z], size: [50, 0.16, 0.34], color: "#163a33" },

  // station
  { key: "platform", pos: [-17.6, 0.45, -6.7], size: [9.2, 0.9, 3.1], color: "#24384c" },
  { key: "canopy", pos: [-17.6, 3.5, -6.9], size: [9.6, 0.14, 2.6], color: "#16283a" },

  // signalling buildings
  { key: "hut", pos: [-8.9, 1.3, -7.3], size: [3.4, 2.6, 2.8], color: "#1b2f45" },
  { key: "control", pos: [12.0, 1.5, -8.0], size: [5.2, 3.0, 3.2], color: "#24405c" },
  { key: "mastcab", pos: [5.4, 0.5, -10.4], size: [1.4, 1.0, 1.4], color: "#1b2f45" },

  // road and level crossing
  { key: "road", pos: [CROSSING_X, -0.02, 0.4], size: [6.4, 0.1, 26], color: "#101d29" },
  { key: "cabinetA", pos: [4.5, 0.55, 4.6], size: [0.7, 1.1, 0.5], color: "#1b2f45" },
  { key: "cabinetB", pos: [10.7, 0.55, 4.6], size: [0.7, 1.1, 0.5], color: "#1b2f45" },
  { key: "cabinetC", pos: [4.5, 0.55, -4.4], size: [0.7, 1.1, 0.5], color: "#1b2f45" },

  // track-side equipment
  { key: "signalPost", pos: [2.6, 2.6, 3.4], size: [0.22, 5.2, 0.22], color: "#5a7086" },
  { key: "signalHead", pos: [2.6, 5.7, 3.4], size: [0.66, 1.55, 0.5], color: "#0b1622" },
  { key: "cctv", pos: [9.6, 2.2, 4.6], size: [0.18, 4.4, 0.18], color: "#5a7086" },
  { key: "axle", pos: [-6.2, 0.35, NEAR_LINE_Z + 1.1], size: [0.5, 0.5, 0.4], color: "#16324a" },

  // radio mast (tapering lattice approximated by a column)
  { key: "mast", pos: [5.4, 6.4, -10.4], size: [0.9, 12.8, 0.9], color: "#3d556b" },
  { key: "dish", pos: [5.9, 9.6, -9.8], size: [1.5, 1.5, 0.4], color: "#c9d6e2" },
];

/* ----------------------------------------------------------------- cameras */

export interface Focus {
  centre: Vec3;
  /** radius of the component's bounding sphere, in metres */
  radius: number;
  /** azimuth (radians, from +Z toward +X) and elevation used to view it */
  az: number;
  el: number;
}

/**
 * Framing volumes. The camera pose for each component is derived from these,
 * so if a component moves the shot follows it, and every shot comes from a
 * deliberate direction instead of a hand-placed vector.
 */
export const FOCUS: Record<string, Focus> = {
  platform: { centre: [-17.4, 1.9, -6.7], radius: 5.0, az: -0.62, el: 0.2 },
  hut: { centre: [-8.9, 1.4, -7.3], radius: 2.3, az: 0.9, el: 0.24 },
  cabling: { centre: [-3.0, 0.4, 4.2], radius: 2.6, az: 0.34, el: 0.26 },
  axle: { centre: [-6.0, 0.5, 2.2], radius: 1.8, az: -0.42, el: 0.24 },
  points: { centre: [-1.4, 0.5, 1.6], radius: 2.6, az: -0.78, el: 0.26 },
  signal: { centre: [2.4, 4.0, 3.4], radius: 2.6, az: -1.16, el: 0.13 },
  ofc: { centre: [-1.0, 0.4, 4.6], radius: 2.6, az: 0.48, el: 0.28 },
  cctv: { centre: [9.6, 2.8, 4.6], radius: 2.4, az: 0.86, el: 0.18 },
  tower: { centre: [5.4, 6.4, -10.4], radius: 6.6, az: 0.72, el: 0.12 },
  control: { centre: [12.0, 1.6, -8.0], radius: 3.1, az: 1.02, el: 0.22 },
};

export const CAMERA_FOV = 34;
export const CAMERA_MIN_DISTANCE = 4;
export const CAMERA_MAX_DISTANCE = 62;
/** Fraction of the frame's short side a component should span. */
const FRAME_FILL = 0.72;

export function poseFor(key: string): CameraPose | null {
  const focus = FOCUS[key];
  if (!focus) return null;
  const half = THREE_HALF_FOV;
  const distance = Math.min(
    Math.max((focus.radius / (FRAME_FILL * Math.tan(half))) * 1.05, CAMERA_MIN_DISTANCE),
    CAMERA_MAX_DISTANCE,
  );
  const [cx, cy, cz] = focus.centre;
  return {
    position: [
      round(cx + Math.sin(focus.az) * Math.cos(focus.el) * distance),
      round(cy + Math.sin(focus.el) * distance),
      round(cz + Math.cos(focus.az) * Math.cos(focus.el) * distance),
    ],
    target: focus.centre,
  };
}

const THREE_HALF_FOV = (CAMERA_FOV * Math.PI) / 360;
const round = (value: number) => Math.round(value * 100) / 100;

export const NODE_CAMERAS: Record<string, CameraPose> = Object.fromEntries(
  Object.keys(FOCUS)
    .map((key) => [key, poseFor(key)] as const)
    .filter((entry): entry is readonly [string, CameraPose] => entry[1] !== null),
);

/** Fixed viewpoint for the drawing-style overview before anything is selected. */
export const OVERVIEW_CAMERA: CameraPose = {
  position: [2.0, 15.5, 34.0],
  target: [-1.0, 1.6, -1.5],
};

/** Wide opening shot: the whole yard, seen from the near side. */
export const DEFAULT_CAMERA: CameraPose = {
  position: [3.0, 11.0, 32.0],
  target: [-1.0, 2.6, -1.0],
};

export function poseDistance(pose: CameraPose): number {
  return Math.hypot(
    pose.position[0] - pose.target[0],
    pose.position[1] - pose.target[1],
    pose.position[2] - pose.target[2],
  );
}

