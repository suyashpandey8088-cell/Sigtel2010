/**
 * Offline framing check for the 3D live section.
 *
 * There is no browser in this sandbox, so the camera poses are verified by
 * projecting the scene's mass table with three's own camera maths and drawing
 * a flat-shaded preview. Run it after touching the layout or the cameras:
 *
 *   node scripts/preview-scene.mjs            # every node camera
 *   node scripts/preview-scene.mjs signal     # just one
 *
 * Writes PNGs to /tmp/scene-<key>.png and prints how much of the frame the
 * selected component occupies.
 */
import * as THREE from "three";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const layout = await import("../lib/content/live-section-3d.ts");
const {
  SCENE_MASSES,
  NODE_CAMERAS,
  DEFAULT_CAMERA,
  OVERVIEW_CAMERA,
  CAMERA_FOV,
  NEAR_LINE_Z,
  FAR_LINE_Z,
  GAUGE,
  CROSSING_X,
} = layout;

const W = 1280;
const H = 800;

function boxCorners(mass) {
  const [px, py, pz] = mass.pos;
  const [sx, sy, sz] = mass.size;
  const rot = mass.rotY ?? 0;
  const corners = [];
  for (const dx of [-0.5, 0.5]) {
    for (const dy of [-0.5, 0.5]) {
      for (const dz of [-0.5, 0.5]) {
        const x = dx * sx;
        const z = dz * sz;
        const rx = x * Math.cos(rot) - z * Math.sin(rot);
        const rz = x * Math.sin(rot) + z * Math.cos(rot);
        corners.push(new THREE.Vector3(px + rx, py + dy * sy, pz + rz));
      }
    }
  }
  return corners;
}

const FACES = [
  [0, 1, 3, 2],
  [4, 6, 7, 5],
  [0, 4, 5, 1],
  [2, 3, 7, 6],
  [0, 2, 6, 4],
  [1, 5, 7, 3],
];

const LIGHT = new THREE.Vector3(-0.4, 0.85, 0.35).normalize();

function project(point, camera, viewMatrix) {
  const v = point.clone().project(camera);
  return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, z: v.z };
}

function shade(hex, amount) {
  const c = new THREE.Color(hex);
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, THREE.MathUtils.clamp(hsl.l * amount, 0.02, 0.95));
  return `#${c.getHexString()}`;
}

export function render(pose, focusKey) {
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, W / H, 0.1, 400);
  camera.position.set(...pose.position);
  camera.lookAt(new THREE.Vector3(...pose.target));
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);

  const parts = [];

  // ground grid
  for (let x = -30; x <= 30; x += 5) {
    const a = project(new THREE.Vector3(x, 0, -15), camera);
    const b = project(new THREE.Vector3(x, 0, 15), camera);
    parts.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#12212f" stroke-width="1"/>`);
  }
  for (let z = -15; z <= 15; z += 5) {
    const a = project(new THREE.Vector3(-32, 0, z), camera);
    const b = project(new THREE.Vector3(32, 0, z), camera);
    parts.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#12212f" stroke-width="1"/>`);
  }

  const faces = [];
  for (const mass of SCENE_MASSES) {
    const corners = boxCorners(mass);
    for (const face of FACES) {
      const [a, b, c, d] = face.map((i) => corners[i]);
      const normal = new THREE.Vector3()
        .subVectors(c, a)
        .cross(new THREE.Vector3().subVectors(d, b))
        .normalize();
      const centre = a.clone().add(b).add(c).add(d).multiplyScalar(0.25);
      const toCam = camera.position.clone().sub(centre);
      if (normal.dot(toCam) <= 0) continue; // back face
      // skip faces that straddle the camera, otherwise a vertex behind the
      // near plane projects to a mirrored position and swallows the frame
      if ([a, b, c, d].some((p) => p.clone().applyMatrix4(camera.matrixWorldInverse).z > -0.4)) continue;
      const depth = centre.distanceTo(camera.position);
      const light = Math.abs(normal.dot(LIGHT));
      faces.push({
        depth,
        points: [a, b, c, d].map((p) => project(p, camera)),
        fill: shade(mass.color, 0.55 + light * 0.9),
        opacity: mass.key && mass.key === focusKey ? 1 : 0.92,
        stroke: mass.key && mass.key === focusKey ? "#f5b942" : "none",
      });
    }
  }
  faces.sort((p, q) => q.depth - p.depth);
  for (const face of faces) {
    const pts = face.points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    parts.push(
      `<polygon points="${pts}" fill="${face.fill}" fill-opacity="${face.opacity}" stroke="${face.stroke}" stroke-width="${face.stroke === "none" ? 0 : 1.6}"/>`,
    );
  }

  // camera target crosshair
  const centre = project(new THREE.Vector3(...pose.target), camera);
  parts.push(
    `<circle cx="${centre.x}" cy="${centre.y}" r="7" fill="none" stroke="#ef4444" stroke-width="1.5"/>`,
    `<line x1="${centre.x - 14}" y1="${centre.y}" x2="${centre.x + 14}" y2="${centre.y}" stroke="#ef4444" stroke-width="1"/>`,
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#050c16"/>${parts.join("")}</svg>`;

  // how much of the frame the focused mass occupies
  let coverage = 0;
  if (focusKey) {
    const mass = SCENE_MASSES.find((m) => m.key === focusKey);
    if (mass) {
      const pts = boxCorners(mass).map((p) => project(p, camera));
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      const w = Math.max(...xs) - Math.min(...xs);
      const h = Math.max(...ys) - Math.min(...ys);
      coverage = Math.max(w / W, h / H);
    }
  }
  return { svg, centre, coverage };
}

const FOCUS_ALIAS = {
  signal: "signalHead",
  tower: "mast",
  ofc: "duct",
  cabling: "trough",
  points: "ballast",
};

const only = process.argv[2];
const poses = [
  ["overview", OVERVIEW_CAMERA, "ground"],
  ...Object.entries(NODE_CAMERAS).map(([key, pose]) => [key, pose, key]),
].filter(([key]) => !only || key === only);

for (const [key, pose, focus] of poses) {
  const { svg, centre, coverage } = render(pose, FOCUS_ALIAS[focus] ?? focus);
  await sharp(Buffer.from(svg)).png().toFile(`/tmp/scene-${key}.png`);
  const off = Math.hypot(centre.x - W / 2, centre.y - H / 2);
  console.log(
    `${key.padEnd(9)} target at (${centre.x.toFixed(0)}, ${centre.y.toFixed(0)}) off-centre ${off.toFixed(0)}px  coverage ${(coverage * 100).toFixed(0)}%`,
  );
}
