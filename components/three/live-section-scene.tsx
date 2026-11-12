"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { AdaptiveDpr, Html } from "@react-three/drei";
import * as THREE from "three";
import { infraNodes, type InfraMode } from "@/lib/content/infrastructure-3d";
import {
  CAMERA_FOV,
  CAMERA_MAX_DISTANCE,
  CAMERA_MIN_DISTANCE,
  CROSSING_X,
  DUCT_Z,
  FAR_LINE_Z,
  GAUGE,
  MAST_FAR_Z,
  MAST_NEAR_Z,
  MAST_X_FAR,
  MAST_X_NEAR,
  NEAR_LINE_Z,
  NODE_CAMERAS,
  OVERVIEW_CAMERA,
  SCENE_MASSES,
  TROUGH_Z,
  poseFor,
  type CameraPose,
} from "@/lib/content/live-section-3d";

export type Aspect = "red" | "amber" | "green";

interface SceneProps {
  mode: InfraMode;
  selected: string;
  hovered: string;
  aspect: Aspect;
  /** true while the level crossing is closed to road traffic */
  gateDown: boolean;
  reducedMotion: boolean;
  onHover: (key: string) => void;
  onSelect: (key: string) => void;
  onReady: () => void;
}

const C = {
  ballast: "#0e1c2a",
  rail: "#9aacbd",
  railDim: "#7b8c9e",
  sleeper: "#22374b",
  concrete: "#33485e",
  steel: "#5d7488",
  steelDark: "#3c5165",
  body: "#16293c",
  bodyLight: "#1f3a52",
  glass: "#0d2a3c",
  amber: "#f5b942",
  red: "#ef4444",
  green: "#24c78b",
  white: "#dbe5ee",
  copper: "#a9733c",
};

/* ------------------------------------------------------------------ helpers */

/**
 * A `THREE.Line` built from points. Rendered through `<primitive>` rather than
 * the `line` JSX tag so it does not collide with the SVG line element in the
 * JSX namespace.
 */
function Wire({
  points,
  color,
  opacity = 1,
}: {
  points: THREE.Vector3[];
  color: string;
  opacity?: number;
}) {
  const object = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: opacity < 1,
      opacity,
    });
    return new THREE.Line(geometry, material);
  }, [points, color, opacity]);
  return <primitive object={object} />;
}

function useMaterialsOpacity(
  group: React.RefObject<THREE.Group | null>,
  target: () => number,
  reducedMotion: boolean,
) {
  const settled = useRef<number | null>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const want = target();
    // nothing to do once every material has reached the target
    if (settled.current !== null && Math.abs(settled.current - want) < 0.002)
      return;
    g.traverse((child) => {
      const mesh = child as THREE.Mesh & {
        material?: THREE.Material | THREE.Material[];
      };
      if (!mesh.isMesh || !mesh.material) return;
      const list = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const material of list) {
        const m = material as THREE.MeshStandardMaterial;
        if (!("opacity" in m)) continue;
        if (m.type === "MeshBasicMaterial") continue; // rings and beacons animate themselves
        const next = reducedMotion
          ? want
          : THREE.MathUtils.damp(m.opacity, want, 7, delta);
        if (
          Math.abs(next - m.opacity) < 0.003 &&
          Math.abs(m.opacity - want) < 0.003
        )
          continue;
        m.opacity = next;
        // only pay the transparency cost while a part is actually ghosted
        m.transparent = next < 0.995;
        m.depthWrite = next > 0.5;
      }
    });
    settled.current = want;
  });
}

/**
 * A selectable cluster. Handles hover, click, the accent ring on the ground,
 * dimming when the other discipline is in focus, and the 3D label.
 */
function Part({
  nodeKey,
  at,
  mode,
  selected,
  hovered,
  reducedMotion,
  radius = 1.6,
  anchorY,
  onHover,
  onSelect,
  children,
}: {
  nodeKey: string;
  /** world position of the component's origin */
  at: [number, number, number];
  mode: InfraMode;
  selected: string;
  hovered: string;
  reducedMotion: boolean;
  radius?: number;
  anchorY?: number;
  onHover: (key: string) => void;
  onSelect: (key: string) => void;
  children: React.ReactNode;
}) {
  const node = infraNodes.find((item) => item.key === nodeKey)!;
  const group = useRef<THREE.Group>(null);
  const outTimer = useRef<number | null>(null);
  const ring = useRef<THREE.MeshBasicMaterial>(null);
  const active = selected === nodeKey || hovered === nodeKey;
  const relevant = node.division === "both" || node.division === mode;
  const accent =
    node.division === "telecom"
      ? C.green
      : node.division === "signalling"
        ? C.red
        : C.white;

  useMaterialsOpacity(group, () => (relevant ? 1 : 0.18), reducedMotion);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.scale.setScalar(
      THREE.MathUtils.damp(g.scale.x, active ? 1.03 : 1, 9, delta),
    );
    if (ring.current) {
      ring.current.opacity = THREE.MathUtils.damp(
        ring.current.opacity,
        active ? 0.85 : relevant ? 0.16 : 0.05,
        8,
        delta,
      );
    }
  });

  useEffect(
    () => () => {
      if (outTimer.current) window.clearTimeout(outTimer.current);
    },
    [],
  );

  const index = infraNodes.findIndex((item) => item.key === nodeKey);
  const number = String(index + 1).padStart(2, "0");

  return (
    <group
      ref={group}
      position={at}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        if (outTimer.current) window.clearTimeout(outTimer.current);
        onHover(nodeKey);
      }}
      onPointerOut={() => {
        // children fire out/over in sequence; wait a beat before clearing so
        // the hover does not flicker as the pointer moves inside one part
        if (outTimer.current) window.clearTimeout(outTimer.current);
        outTimer.current = window.setTimeout(() => onHover(""), 60);
      }}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect(nodeKey);
      }}
    >
      {children}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
        <ringGeometry args={[radius, radius + 0.1, 64]} />
        <meshBasicMaterial
          ref={ring}
          color={accent}
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Html
        position={[0, anchorY ?? 2.4, 0]}
        center
        zIndexRange={[40, 10]}
        style={{ pointerEvents: "none" }}
        wrapperClass="pointer-events-none"
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className={`ls-chip-3d ${active ? "is-active" : ""} ${relevant ? "" : "is-dim"}`}
          style={{ color: accent }}
          onMouseEnter={() => onHover(nodeKey)}
          onMouseLeave={() => onHover("")}
          onClick={() => onSelect(nodeKey)}
        >
          {number}
        </button>
      </Html>
    </group>
  );
}

/* -------------------------------------------------------------------- track */

function SleeperField({
  z,
  from,
  to,
  spacing = 0.62,
}: {
  z: number;
  from: number;
  to: number;
  spacing?: number;
}) {
  const count = Math.floor((to - from) / spacing);
  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i += 1) {
      matrix.makeTranslation(from + i * spacing + spacing / 2, 0.2, z);
      m.setMatrixAt(i, matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [count, from, spacing, z]);
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      receiveShadow
    >
      <boxGeometry args={[0.26, 0.13, 2.5]} />
      <meshStandardMaterial color={C.sleeper} roughness={0.95} />
    </instancedMesh>
  );
}

function Track() {
  const ballast = SCENE_MASSES.find((m) => m.key === "ballast")!;
  const ballastTop = ballast.pos[1] + ballast.size[1] / 2;
  return (
    <group>
      <mesh
        position={[ballast.pos[0], ballast.pos[1], ballast.pos[2]]}
        receiveShadow
      >
        <boxGeometry
          args={[ballast.size[0], ballast.size[1], ballast.size[2]]}
        />
        <meshStandardMaterial color={C.ballast} roughness={1} />
      </mesh>
      {/* cess shoulder, slightly proud of the ballast */}
      <mesh
        position={[0, ballastTop - 0.02, (TROUGH_Z + 3.7) / 2 + 3.8 / 2]}
        receiveShadow
      >
        <boxGeometry args={[54, 0.08, 3.4]} />
        <meshStandardMaterial color="#101f2c" roughness={1} />
      </mesh>

      {[NEAR_LINE_Z, FAR_LINE_Z].map((z, trackIndex) => (
        <group key={z}>
          <SleeperField z={z} from={-26} to={26} />
          {[-GAUGE / 2, GAUGE / 2].map((offset) => (
            <group key={offset}>
              <mesh position={[0, 0.3, z + offset]}>
                <boxGeometry args={[52, 0.14, 0.13]} />
                <meshStandardMaterial
                  color={trackIndex === 0 ? C.rail : C.railDim}
                  metalness={0.85}
                  roughness={0.32}
                />
              </mesh>
              {/* rail head highlight */}
              <mesh position={[0, 0.372, z + offset]}>
                <boxGeometry args={[52, 0.014, 0.085]} />
                <meshStandardMaterial
                  color="#cfdae4"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* cable trough along the cess */}
      <mesh position={[0, 0.2, TROUGH_Z]} castShadow>
        <boxGeometry args={[50, 0.28, 0.5]} />
        <meshStandardMaterial color={C.copper} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.345, TROUGH_Z]}>
        <boxGeometry args={[50, 0.03, 0.54]} />
        <meshStandardMaterial color="#c08a4e" roughness={0.8} />
      </mesh>

      {/* fibre duct with route markers */}
      <mesh position={[0, 0.12, DUCT_Z]}>
        <boxGeometry args={[50, 0.16, 0.34]} />
        <meshStandardMaterial color="#15352f" roughness={0.9} />
      </mesh>
      {Array.from({ length: 21 }, (_, i) => -25 + i * 2.5).map((x) => (
        <group key={x} position={[x, 0, DUCT_Z]}>
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.34, 0.2, 0.26]} />
            <meshStandardMaterial color="#1b4b3f" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshStandardMaterial
              color={C.green}
              emissive={C.green}
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------- OHE */

function Catenary() {
  const wireY = 6.15;
  const messengerY = 7.05;
  const sag = 0.24;

  const spans = useMemo(() => {
    const xs = [...MAST_X_NEAR].sort((a, b) => a - b);
    return xs.slice(0, -1).map((x1, i) => [x1, xs[i + 1]] as const);
  }, []);

  const wires = useMemo(() => {
    const out: {
      messenger: THREE.Vector3[];
      contact: THREE.Vector3[];
      droppers: THREE.Vector3[][];
    }[] = [];
    for (const z of [NEAR_LINE_Z, FAR_LINE_Z]) {
      for (const [x1, x2] of spans) {
        const mid = (x1 + x2) / 2;
        const messenger: THREE.Vector3[] = [];
        const contact: THREE.Vector3[] = [];
        const droppers: THREE.Vector3[][] = [];
        for (let i = 0; i <= 8; i += 1) {
          const t = i / 8;
          const x = x1 + (x2 - x1) * t;
          // parabolic sag between supports
          const drop = sag * 4 * t * (1 - t);
          messenger.push(new THREE.Vector3(x, messengerY - drop, z));
          contact.push(new THREE.Vector3(x, wireY - drop * 0.12, z));
        }
        for (const t of [0.25, 0.5, 0.75]) {
          const x = x1 + (x2 - x1) * t;
          const drop = sag * 4 * t * (1 - t);
          droppers.push([
            new THREE.Vector3(x, messengerY - drop, z),
            new THREE.Vector3(x, wireY - drop * 0.12, z),
          ]);
        }
        out.push({ messenger, contact, droppers });
      }
    }
    return out;
  }, [spans]);

  return (
    <group>
      {[MAST_NEAR_Z, MAST_FAR_Z].map((z, index) => (
        <group key={z}>
          {(index === 0 ? MAST_X_NEAR : MAST_X_FAR).map((x) => {
            const inward = z > 0 ? -1 : 1;
            return (
              <group key={`${z}-${x}`} position={[x, 0, z]}>
                <mesh position={[0, 0.14, 0]}>
                  <boxGeometry args={[0.6, 0.28, 0.6]} />
                  <meshStandardMaterial color={C.concrete} roughness={0.95} />
                </mesh>
                <mesh position={[0, 3.9, 0]} castShadow>
                  <cylinderGeometry args={[0.085, 0.14, 7.8, 10]} />
                  <meshStandardMaterial
                    color={C.steel}
                    metalness={0.55}
                    roughness={0.55}
                  />
                </mesh>
                {/* cantilever tube reaching over the tracks */}
                <mesh
                  position={[0, 7.2, inward * 1.0]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <cylinderGeometry args={[0.05, 0.05, 2.0, 8]} />
                  <meshStandardMaterial
                    color={C.steel}
                    metalness={0.5}
                    roughness={0.6}
                  />
                </mesh>
                {/* stay tube back to the mast */}
                <mesh
                  position={[0, 6.55, inward * 1.05]}
                  rotation={[Math.PI / 2 - inward * 0.35, 0, 0]}
                >
                  <cylinderGeometry args={[0.03, 0.03, 2.1, 6]} />
                  <meshStandardMaterial
                    color={C.steelDark}
                    metalness={0.4}
                    roughness={0.7}
                  />
                </mesh>
                {/* registration arm, insulator and steady arm */}
                <mesh position={[0, 6.16, inward * 1.78]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.36, 8]} />
                  <meshStandardMaterial color={C.white} roughness={0.4} />
                </mesh>
                <mesh
                  position={[0, 6.15, inward * 1.55]}
                  rotation={[0, 0, Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.022, 0.022, 0.6, 6]} />
                  <meshStandardMaterial color={C.steel} metalness={0.6} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {wires.map((wire, index) => (
        <group key={index}>
          <Wire points={wire.messenger} color="#5f7d95" opacity={0.9} />
          <Wire points={wire.contact} color="#93aabd" />
          {wire.droppers.map((dropper, i) => (
            <Wire key={i} points={dropper} color="#3f566b" opacity={0.75} />
          ))}
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------- signal */

function Signal({ aspect }: { aspect: Aspect }) {
  const lamps: { key: Aspect; y: number }[] = [
    { key: "red", y: 6.05 },
    { key: "amber", y: 5.68 },
    { key: "green", y: 5.31 },
  ];
  const glow = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (glow.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.8) * 0.12;
      glow.current.intensity = 5.4 * pulse;
    }
  });

  return (
    <group>
      <mesh position={[0, 2.6, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 5.2, 12]} />
        <meshStandardMaterial
          color={C.steel}
          metalness={0.5}
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.36, 0.42, 0.24, 12]} />
        <meshStandardMaterial color={C.concrete} roughness={0.95} />
      </mesh>
      {/* head + backing board */}
      <mesh position={[0, 5.68, 0.02]}>
        <boxGeometry args={[0.9, 2.1, 0.07]} />
        <meshStandardMaterial
          color="#16293c"
          metalness={0.35}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 5.68, 0.12]}>
        <boxGeometry args={[0.62, 1.72, 0.4]} />
        <meshStandardMaterial color="#101f2d" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* white rim / border that reads at a distance */}
      <mesh position={[0, 5.68, -0.04]}>
        <boxGeometry args={[0.98, 2.18, 0.04]} />
        <meshStandardMaterial color={C.white} roughness={0.7} />
      </mesh>
      {lamps.map((lamp) => {
        const on = lamp.key === aspect;
        return (
          <group key={lamp.key} position={[0, lamp.y, 0.3]}>
            <mesh>
              <sphereGeometry args={[0.115, 22, 22]} />
              <meshStandardMaterial
                color={
                  on
                    ? lamp.key === "red"
                      ? C.red
                      : lamp.key === "amber"
                        ? C.amber
                        : C.green
                    : "#101d29"
                }
                emissive={
                  lamp.key === "red"
                    ? C.red
                    : lamp.key === "amber"
                      ? C.amber
                      : C.green
                }
                emissiveIntensity={on ? 3.2 : 0.03}
                toneMapped={false}
              />
            </mesh>
            {/* hood */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]}>
              <cylinderGeometry args={[0.15, 0.15, 0.2, 14, 1, true]} />
              <meshStandardMaterial
                color="#0a1520"
                side={THREE.DoubleSide}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}
      <pointLight
        ref={glow}
        position={[
          0,
          aspect === "red" ? 6.05 : aspect === "amber" ? 5.68 : 5.31,
          0.9,
        ]}
        color={
          aspect === "red" ? C.red : aspect === "amber" ? C.amber : C.green
        }
        distance={7}
        intensity={5}
      />
      {/* number plate + location case + ladder */}
      <mesh position={[0, 4.42, 0.16]}>
        <boxGeometry args={[0.34, 0.16, 0.02]} />
        <meshStandardMaterial
          color={C.white}
          emissive={C.white}
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[0.42, 1.1, 0.1]}>
        <boxGeometry args={[0.42, 0.9, 0.3]} />
        <meshStandardMaterial color="#1b3245" roughness={0.85} />
      </mesh>
      {[1.4, 1.9, 2.4, 2.9, 3.4].map((y) => (
        <mesh key={y} position={[0.22, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.44, 6]} />
          <meshStandardMaterial color={C.steel} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------- points */

function Points() {
  return (
    <group>
      {/* switch rails diverging toward the other line */}
      {[-GAUGE / 2, GAUGE / 2].map((offset, index) => (
        <mesh
          key={offset}
          position={[0, 0.36, offset]}
          rotation={[0, (index === 0 ? -1 : 1) * 0.055, 0]}
        >
          <boxGeometry args={[4.6, 0.11, 0.1]} />
          <meshStandardMaterial
            color="#b9c8d6"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* stretcher bars tying the switch rails together */}
      {[-1.1, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.26, 0]}>
          <boxGeometry args={[0.08, 0.06, 1.7]} />
          <meshStandardMaterial color={C.steelDark} metalness={0.6} />
        </mesh>
      ))}
      {/* point machine, drive rodding and detection box */}
      <mesh position={[0.9, 0.32, 1.5]} castShadow>
        <boxGeometry args={[0.85, 0.42, 0.5]} />
        <meshStandardMaterial
          color="#b8c6d4"
          metalness={0.35}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0.9, 0.55, 1.5]}>
        <boxGeometry args={[0.5, 0.06, 0.24]} />
        <meshStandardMaterial
          color={C.amber}
          emissive={C.amber}
          emissiveIntensity={0.35}
        />
      </mesh>
      {[0.2, -0.5, -1.2, -1.9].map((x) => (
        <mesh key={x} position={[x, 0.24, 1.28]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.8, 6]} />
          <meshStandardMaterial
            color={C.steel}
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}
      <mesh position={[-2.4, 0.2, 1.5]}>
        <boxGeometry args={[0.5, 0.26, 0.4]} />
        <meshStandardMaterial color="#1b3245" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------- detection */

function Detection() {
  const led = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (led.current)
      led.current.emissiveIntensity =
        0.4 + Math.abs(Math.sin(clock.getElapsedTime() * 2.4)) * 2.2;
  });
  return (
    <group>
      {/* axle counter heads straddling the rails */}
      {[-GAUGE / 2 - 0.1, GAUGE / 2 + 0.1].map((offset, index) => (
        <group key={offset} position={[index * 0.2, 0, offset]}>
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[0.26, 0.22, 0.18]} />
            <meshStandardMaterial
              color="#d8b04a"
              emissive="#8a6a19"
              emissiveIntensity={0.18}
            />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <meshStandardMaterial color={C.copper} />
          </mesh>
        </group>
      ))}
      {/* trackside junction box with a live indication */}
      <mesh position={[0.3, 0.55, 1.55]} castShadow>
        <boxGeometry args={[0.62, 0.44, 0.34]} />
        <meshStandardMaterial color="#14324a" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[0.3, 0.55, 1.73]}>
        <boxGeometry args={[0.14, 0.1, 0.03]} />
        <meshStandardMaterial
          ref={led}
          color={C.green}
          emissive={C.green}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.3, 0.2, 1.55]}>
        <cylinderGeometry args={[0.1, 0.12, 0.4, 8]} />
        <meshStandardMaterial color={C.concrete} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ buildings */

function Hut() {
  return (
    <group>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[3.9, 0.18, 3.2]} />
        <meshStandardMaterial color={C.concrete} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.39, 0]} castShadow>
        <boxGeometry args={[3.5, 2.5, 2.8]} />
        <meshStandardMaterial color={C.body} roughness={0.88} />
      </mesh>
      <mesh position={[0, 2.72, 0]}>
        <boxGeometry args={[3.8, 0.16, 3.1]} />
        <meshStandardMaterial color="#0d1b27" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.9, 0]}>
        <boxGeometry args={[3.2, 0.2, 2.6]} />
        <meshStandardMaterial color={C.bodyLight} roughness={0.8} />
      </mesh>
      {/* door + louvre panels */}
      <mesh position={[1.0, 1.05, 1.42]}>
        <boxGeometry args={[0.8, 2.0, 0.05]} />
        <meshStandardMaterial color="#0a1622" metalness={0.3} roughness={0.6} />
      </mesh>
      {[0.9, 1.4, 1.9].map((y) => (
        <mesh key={y} position={[-0.9, y, 1.42]}>
          <boxGeometry args={[1.2, 0.3, 0.04]} />
          <meshStandardMaterial color="#12293c" roughness={0.8} />
        </mesh>
      ))}
      {/* roof equipment */}
      <mesh position={[-0.9, 3.12, 0.4]}>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color={C.steel} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* earthing strip to the pit */}
      <mesh position={[-2.1, 0.1, 0.7]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.1, 0.05, 0.06]} />
        <meshStandardMaterial
          color={C.copper}
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[-2.7, 0.14, 0.7]}>
        <boxGeometry args={[0.34, 0.28, 0.34]} />
        <meshStandardMaterial color="#20364a" roughness={0.9} />
      </mesh>
      {/* cable duct into the ground */}
      <mesh position={[0, 0.28, -1.6]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[2.2, 0.16, 0.3]} />
        <meshStandardMaterial color={C.copper} roughness={0.9} />
      </mesh>
    </group>
  );
}

function ControlRoom() {
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[5.7, 0.24, 3.7]} />
        <meshStandardMaterial color={C.concrete} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.62, 0]} castShadow>
        <boxGeometry args={[5.2, 3.0, 3.2]} />
        <meshStandardMaterial color={C.bodyLight} roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[5.5, 0.18, 3.5]} />
        <meshStandardMaterial color="#0d1d2b" roughness={0.7} />
      </mesh>
      {/* lit window band */}
      <mesh position={[0, 1.9, 1.62]}>
        <boxGeometry args={[3.6, 1.0, 0.06]} />
        <meshStandardMaterial
          color={C.glass}
          emissive="#3fd6a5"
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x, 1.9, 1.66]}>
          <boxGeometry args={[0.06, 1.0, 0.02]} />
          <meshStandardMaterial color="#08141f" />
        </mesh>
      ))}
      <mesh position={[2.0, 1.05, 1.62]}>
        <boxGeometry args={[0.8, 2.1, 0.06]} />
        <meshStandardMaterial color="#08141f" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* RTU cabinet outside, cable tray, antenna */}
      <mesh position={[-2.2, 0.75, 1.85]} castShadow>
        <boxGeometry args={[0.8, 1.3, 0.5]} />
        <meshStandardMaterial color="#16324a" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[-2.2, 1.42, 1.85]}>
        <boxGeometry args={[0.84, 0.06, 0.54]} />
        <meshStandardMaterial color={C.steel} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[1.6, 3.42, 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 6]} />
        <meshStandardMaterial color={C.steel} />
      </mesh>
      <mesh position={[1.6, 3.78, 0.4]} rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.22]} />
        <meshStandardMaterial
          color={C.white}
          emissive={C.white}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 1.9, 1.9]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial
          color={C.red}
          emissive={C.red}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Platform() {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[9.2, 0.9, 3.1]} />
        <meshStandardMaterial color="#23384c" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[9.3, 0.06, 3.2]} />
        <meshStandardMaterial color="#31485f" roughness={0.8} />
      </mesh>
      {/* yellow edge line on the track side */}
      <mesh position={[0, 0.955, 1.32]}>
        <boxGeometry args={[9.3, 0.02, 0.16]} />
        <meshStandardMaterial
          color={C.amber}
          emissive={C.amber}
          emissiveIntensity={0.35}
          toneMapped={false}
        />
      </mesh>
      {/* canopy */}
      {[-3.4, 0, 3.4].map((x) => (
        <mesh key={x} position={[x, 2.2, -0.5]}>
          <cylinderGeometry args={[0.06, 0.06, 2.6, 8]} />
          <meshStandardMaterial
            color={C.steel}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}
      <mesh position={[0, 3.56, -0.6]} rotation={[0.05, 0, 0]} castShadow>
        <boxGeometry args={[9.4, 0.12, 2.7]} />
        <meshStandardMaterial color="#152738" roughness={0.75} />
      </mesh>
      {[-3, 0, 3].map((x) => (
        <mesh key={`lamp-${x}`} position={[x, 3.38, -0.2]}>
          <boxGeometry args={[0.5, 0.06, 0.14]} />
          <meshStandardMaterial
            color="#ffe6b8"
            emissive="#ffd9a0"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      ))}
      {[-3, 0, 3].map((x) => (
        <pointLight
          key={`pl-${x}`}
          position={[x, 3.2, 0.2]}
          color="#ffd9a0"
          intensity={3.4}
          distance={5}
        />
      ))}
      {/* bench, name board, PA speaker */}
      <mesh position={[1.6, 1.16, -0.8]}>
        <boxGeometry args={[1.5, 0.09, 0.42]} />
        <meshStandardMaterial color="#3a5570" roughness={0.8} />
      </mesh>
      <mesh position={[1.6, 1.44, -1.0]}>
        <boxGeometry args={[1.5, 0.4, 0.07]} />
        <meshStandardMaterial color="#3a5570" roughness={0.8} />
      </mesh>
      {[-0.55, 0.55].map((dx) => (
        <mesh key={dx} position={[1.6 + dx, 1.03, -0.8]}>
          <boxGeometry args={[0.07, 0.24, 0.36]} />
          <meshStandardMaterial color="#22384c" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[-3.9, 1.35, -0.2]}>
        <boxGeometry args={[1.7, 0.5, 0.06]} />
        <meshStandardMaterial
          color={C.white}
          emissive={C.white}
          emissiveIntensity={0.14}
        />
      </mesh>
      <mesh position={[-3.9, 1.8, -0.2]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
        <meshStandardMaterial color="#0d1b27" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------------------- comms */

function GuyWires({ height }: { height: number }) {
  const wires = useMemo(
    () =>
      [
        [7.2, 6.4],
        [-7.2, 6.4],
        [0, -7.6],
      ].map(([x, z]) => [
        new THREE.Vector3(0, height - 1.2, 0),
        new THREE.Vector3(x, 0.2, z),
      ]),
    [height],
  );
  return (
    <group>
      {wires.map((points, index) => (
        <Wire key={index} points={points} color="#33485c" opacity={0.7} />
      ))}
    </group>
  );
}

function Tower() {
  const beacon = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (!beacon.current) return;
    const on = Math.sin(clock.getElapsedTime() * 2.1) > 0.3;
    beacon.current.emissiveIntensity = on ? 3.2 : 0.12;
  });

  const height = 12.6;
  const legs = [
    [-0.55, -0.55],
    [0.55, -0.55],
    [-0.55, 0.55],
    [0.55, 0.55],
  ];
  const braceYs = Array.from({ length: 7 }, (_, i) => 1.1 + i * 1.65);
  const taper = (y: number) => 1 - (y / height) * 0.55;

  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.9, 0.2, 1.9]} />
        <meshStandardMaterial color={C.concrete} roughness={0.95} />
      </mesh>
      {legs.map(([x, z]) => (
        <mesh
          key={`${x}-${z}`}
          position={[x * 0.85, height / 2, z * 0.85]}
          rotation={[z * 0.028, 0, -x * 0.028]}
        >
          <cylinderGeometry args={[0.045, 0.075, height, 6]} />
          <meshStandardMaterial
            color={C.steel}
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
      ))}
      {braceYs.map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry
              args={[0.016, 0.016, 0.95 * taper(y) * 1.75, 4]}
            />
            <meshStandardMaterial color={C.steelDark} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[0.016, 0.016, 0.95 * taper(y) * 1.75, 4]}
            />
            <meshStandardMaterial color={C.steelDark} />
          </mesh>
          <mesh rotation={[0, Math.PI / 4, 0]} position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 1.15 * taper(y), 4]} />
            <meshStandardMaterial color={C.steelDark} />
          </mesh>
        </group>
      ))}
      {/* head frame, microwave dish, sector antennas */}
      <mesh position={[0, height - 0.3, 0]}>
        <boxGeometry args={[1.2, 0.08, 1.2]} />
        <meshStandardMaterial color={C.steel} metalness={0.5} />
      </mesh>
      <mesh position={[0, height - 0.9, 0.85]} rotation={[Math.PI / 2.1, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.06, 0.3, 20, 1, true]} />
        <meshStandardMaterial
          color="#e6eef6"
          side={THREE.DoubleSide}
          metalness={0.15}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, height - 0.9, 0.72]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color={C.steel} />
      </mesh>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, index) => (
        <group
          key={index}
          rotation={[0, angle, 0]}
          position={[0, height - 2.6, 0]}
        >
          <mesh position={[0, 0, 0.7]}>
            <boxGeometry args={[0.14, 0.72, 0.22]} />
            <meshStandardMaterial
              color={C.white}
              emissive={C.white}
              emissiveIntensity={0.12}
              roughness={0.55}
            />
          </mesh>
          <mesh position={[0, 0, 0.56]}>
            <boxGeometry args={[0.06, 0.5, 0.06]} />
            <meshStandardMaterial color={C.steelDark} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, height + 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 5]} />
        <meshStandardMaterial color={C.steel} />
      </mesh>
      <mesh position={[0, height + 0.78, 0]}>
        <sphereGeometry args={[0.09, 14, 14]} />
        <meshStandardMaterial
          ref={beacon}
          color={C.red}
          emissive={C.red}
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, height + 0.8, 0]}
        color={C.red}
        intensity={1.6}
        distance={7}
      />
      {/* guy wires */}
      <GuyWires height={height} />
      {/* shelter at the base */}
      <mesh position={[1.35, 0.55, 0.4]} castShadow>
        <boxGeometry args={[1.2, 1.1, 1.1]} />
        <meshStandardMaterial color={C.body} roughness={0.85} />
      </mesh>
      <mesh position={[1.35, 1.14, 0.4]}>
        <boxGeometry args={[1.3, 0.08, 1.2]} />
        <meshStandardMaterial color="#0d1b27" />
      </mesh>
    </group>
  );
}

function FibreRoute() {
  const packet = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!packet.current) return;
    const t = (clock.getElapsedTime() * 0.14) % 1;
    packet.current.position.x = -20 + t * 40;
  });
  return (
    <group>
      <mesh ref={packet} position={[-20, 0.34, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshBasicMaterial color={C.green} toneMapped={false} />
      </mesh>
      {/* manholes */}
      {[-9, 1.5, 12].map((x) => (
        <group key={x} position={[x, 0, 0.4]}>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[1.1, 0.12, 1.1]} />
            <meshStandardMaterial color="#22404c" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[0.8, 0.03, 0.8]} />
            <meshStandardMaterial color="#2f5563" roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* joint chamber + splice case */}
      <mesh position={[-1.5, 0.3, 0.06]}>
        <boxGeometry args={[0.6, 0.5, 0.42]} />
        <meshStandardMaterial color="#1b4b3f" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Cctv({ aspectOn }: { aspectOn: boolean }) {
  const led = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (led.current)
      led.current.emissiveIntensity =
        1 + Math.abs(Math.sin(clock.getElapsedTime() * 3)) * 2;
  });
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.2, 10]} />
        <meshStandardMaterial color={C.concrete} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 4.2, 10]} />
        <meshStandardMaterial
          color={C.steel}
          metalness={0.55}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0.3, 4.28, 0.1]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.72, 0.24, 0.26]} />
        <meshStandardMaterial color="#d8e2ec" roughness={0.5} />
      </mesh>
      <mesh position={[0.66, 4.18, 0.1]} rotation={[0, 0, -0.32]}>
        <cylinderGeometry args={[0.11, 0.11, 0.12, 14]} />
        <meshStandardMaterial color="#0a1521" />
      </mesh>
      <mesh position={[0.72, 4.15, 0.1]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          color={C.red}
          emissive={C.red}
          emissiveIntensity={aspectOn ? 1.6 : 0.9}
          toneMapped={false}
        />
      </mesh>
      {/* NVR cabinet at the base */}
      <mesh position={[-0.5, 0.55, 0.35]}>
        <boxGeometry args={[0.6, 1.1, 0.45]} />
        <meshStandardMaterial
          color="#16324a"
          roughness={0.6}
          metalness={0.25}
        />
      </mesh>
      <mesh position={[-0.5, 0.68, 0.58]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial
          ref={led}
          color={C.green}
          emissive={C.green}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------- level crossing */

function LevelCrossing({
  gateDown,
  reducedMotion,
}: {
  gateDown: boolean;
  reducedMotion: boolean;
}) {
  const near = useRef<THREE.Group>(null);
  const far = useRef<THREE.Group>(null);

  // one shared material per flashing lamp pair: every crossbuck alternates
  // between A and B, exactly as the real installation does
  const lampA = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C.red,
        emissive: C.red,
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    [],
  );
  const lampB = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C.red,
        emissive: C.red,
        emissiveIntensity: 0.1,
        toneMapped: false,
      }),
    [],
  );

  useFrame(({ clock }, delta) => {
    // booms swing parallel to the road when up, across it when down
    const target = gateDown ? 0 : -Math.PI / 2;
    for (const ref of [near, far]) {
      const g = ref.current;
      if (!g) continue;
      g.rotation.y = reducedMotion
        ? target
        : THREE.MathUtils.damp(g.rotation.y, target, 2.2, delta);
    }
    const flashOn = !gateDown && Math.sin(clock.getElapsedTime() * 6) > 0;
    lampA.emissiveIntensity = flashOn ? 4.2 : 0.12;
    lampB.emissiveIntensity = flashOn ? 0.12 : 4.2;
  });

  const boom = (
    ref: React.RefObject<THREE.Group | null>,
    x: number,
    z: number,
    flip: number,
  ) => (
    <group
      ref={ref}
      position={[x, 0, z]}
      rotation={[0, gateDown ? 0 : -Math.PI / 2, 0]}
    >
      {/* mast, pivot housing and counterweight */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.11, 0.14, 1.1, 10]} />
        <meshStandardMaterial color="#c9d4de" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <boxGeometry args={[0.36, 0.36, 0.32]} />
        <meshStandardMaterial color="#8d9aa7" roughness={0.6} />
      </mesh>
      {/* boom with its red bands */}
      <mesh position={[flip * 2.7, 1.55, 0]}>
        <boxGeometry args={[5.4, 0.1, 0.085]} />
        <meshStandardMaterial color="#e4ecf3" roughness={0.5} />
      </mesh>
      {[0.45, 1.35, 2.25, 3.15, 4.05, 4.95].map((offset) => (
        <mesh key={offset} position={[flip * offset, 1.55, 0]}>
          <boxGeometry args={[0.4, 0.105, 0.09]} />
          <meshStandardMaterial
            color={C.red}
            emissive={C.red}
            emissiveIntensity={0.22}
          />
        </mesh>
      ))}
    </group>
  );

  return (
    <group>
      {/* road crossing the lines at right angles */}
      <mesh position={[CROSSING_X, 0.26, 0.4]} receiveShadow>
        <boxGeometry args={[6.4, 0.12, 26]} />
        <meshStandardMaterial color="#0f1c28" roughness={1} />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => -11 + i * 2.4).map((z) => (
        <mesh
          key={z}
          position={[CROSSING_X, 0.335, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.16, 1.2]} />
          <meshStandardMaterial color="#c8d4de" transparent opacity={0.45} />
        </mesh>
      ))}
      {/* deck plates sit flush with the rail head over the crossing */}
      <mesh position={[CROSSING_X, 0.36, 0]}>
        <boxGeometry args={[6.2, 0.06, 7.6]} />
        <meshStandardMaterial color="#22333f" roughness={0.8} metalness={0.2} />
      </mesh>

      {boom(near, CROSSING_X - 3.0, 5.0, 1)}
      {boom(far, CROSSING_X + 3.0, -5.0, -1)}

      {/* crossbuck road signals with alternating flashing lamps */}
      {[
        { x: CROSSING_X - 3.2, z: 6.4, mirror: 1 },
        { x: CROSSING_X + 3.2, z: 6.4, mirror: -1 },
        { x: CROSSING_X - 3.2, z: -6.4, mirror: 1 },
        { x: CROSSING_X + 3.2, z: -6.4, mirror: -1 },
      ].map((signal, index) => (
        <group key={index} position={[signal.x, 0, signal.z]}>
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[0.1, 2.8, 0.1]} />
            <meshStandardMaterial color="#1d3040" roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.62, 0.07]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.1, 0.95, 0.03]} />
            <meshStandardMaterial color="#d3dee8" />
          </mesh>
          <mesh position={[0, 2.62, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.1, 0.95, 0.03]} />
            <meshStandardMaterial color="#d3dee8" />
          </mesh>
          {[-0.16, 0.16].map((offset, lampIndex) => (
            <group key={offset} position={[signal.mirror * offset, 2.18, 0.12]}>
              <mesh>
                <sphereGeometry args={[0.11, 14, 14]} />
                <primitive
                  object={lampIndex === 0 ? lampA : lampB}
                  attach="material"
                />
              </mesh>
              {/* hood */}
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.09]}>
                <cylinderGeometry args={[0.14, 0.14, 0.16, 12, 1, true]} />
                <meshStandardMaterial
                  color="#12212e"
                  side={THREE.DoubleSide}
                  roughness={0.8}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------- camera */

const ease = THREE.MathUtils.damp;

function CameraRig({
  pose,
  reducedMotion,
  interacting,
}: {
  pose: CameraPose;
  reducedMotion: boolean;
  interacting: boolean;
}) {
  const { camera, gl } = useThree();
  const state = useRef({
    azimuth: 0,
    polar: 0,
    distance: 40,
    target: new THREE.Vector3(),
    // desired values
    dAzimuth: 0,
    dPolar: 0,
    dDistance: 40,
    dTarget: new THREE.Vector3(),
    dragging: false,
    lastInput: 0,
    ready: false,
  });

  // seed the rig from a pose, preserving the current azimuth when possible so
  // the camera arcs to the new target instead of spinning through the scene
  const applyPose = (next: CameraPose, immediate: boolean) => {
    const s = state.current;
    const target = new THREE.Vector3(...next.target);
    const offset = new THREE.Vector3(...next.position).sub(target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    s.dTarget.copy(target);
    s.dDistance = spherical.radius;
    s.dPolar = spherical.phi;
    if (immediate || !s.ready) {
      s.azimuth = spherical.theta;
      s.polar = spherical.phi;
      s.distance = spherical.radius;
      s.target.copy(target);
      s.ready = true;
    }
    // take the short way round
    let delta = spherical.theta - s.azimuth;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    s.dAzimuth = s.azimuth + delta;
  };

  // seed from the wide shot so the first selection is an eased move in
  const seeded = useRef(false);

  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      applyPose(OVERVIEW_CAMERA, true);
    }
    applyPose(pose, reducedMotion);
    state.current.lastInput = performance.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose]);

  useEffect(() => {
    const dom = gl.domElement;
    const s = state.current;
    let last = { x: 0, y: 0 };

    const down = (event: PointerEvent) => {
      s.dragging = true;
      last = { x: event.clientX, y: event.clientY };
      s.lastInput = performance.now();
      dom.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!s.dragging) return;
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      last = { x: event.clientX, y: event.clientY };
      s.dAzimuth -= dx * 0.005;
      s.azimuth -= dx * 0.005;
      s.dPolar = THREE.MathUtils.clamp(s.dPolar - dy * 0.004, 0.14, 1.32);
      s.polar = THREE.MathUtils.clamp(s.polar - dy * 0.004, 0.14, 1.32);
      s.lastInput = performance.now();
    };
    const up = (event: PointerEvent) => {
      s.dragging = false;
      if (dom.hasPointerCapture(event.pointerId))
        dom.releasePointerCapture(event.pointerId);
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      s.dDistance = THREE.MathUtils.clamp(
        s.dDistance + event.deltaY * 0.02,
        CAMERA_MIN_DISTANCE,
        CAMERA_MAX_DISTANCE,
      );
      s.distance = THREE.MathUtils.clamp(
        s.distance + event.deltaY * 0.02,
        CAMERA_MIN_DISTANCE,
        CAMERA_MAX_DISTANCE,
      );
      s.lastInput = performance.now();
    };

    dom.addEventListener("pointerdown", down);
    dom.addEventListener("pointermove", move);
    dom.addEventListener("pointerup", up);
    dom.addEventListener("pointercancel", up);
    dom.addEventListener("wheel", wheel, { passive: false });
    return () => {
      dom.removeEventListener("pointerdown", down);
      dom.removeEventListener("pointermove", move);
      dom.removeEventListener("pointerup", up);
      dom.removeEventListener("pointercancel", up);
      dom.removeEventListener("wheel", wheel);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const s = state.current;
    const dt = Math.min(delta, 0.05);
    const lambda = reducedMotion ? 60 : 3.1;

    // the wide shot is the resting pose: no selection means no component focus
    // idle orbit once the visitor has left it alone
    const idle =
      performance.now() - s.lastInput > 7000 && !s.dragging && !interacting;
    if (idle && !reducedMotion) {
      s.dAzimuth += dt * 0.055;
    }

    s.azimuth = ease(s.azimuth, s.dAzimuth, lambda, dt);
    s.polar = THREE.MathUtils.clamp(
      ease(s.polar, s.dPolar, lambda, dt),
      0.1,
      1.36,
    );
    s.distance = ease(s.distance, s.dDistance, lambda, dt);
    s.target.x = ease(s.target.x, s.dTarget.x, lambda, dt);
    s.target.y = ease(s.target.y, s.dTarget.y, lambda, dt);
    s.target.z = ease(s.target.z, s.dTarget.z, lambda, dt);

    const spherical = new THREE.Spherical(s.distance, s.polar, s.azimuth);
    const position = new THREE.Vector3()
      .setFromSpherical(spherical)
      .add(s.target);
    camera.position.copy(position);
    camera.lookAt(s.target);
    camera.updateMatrixWorld();
  });

  return null;
}

/**
 * Reports readiness from the render loop rather than from context creation:
 * the stage only reveals the canvas once something has actually been drawn,
 * so a scene that fails to render still falls back to the drawing.
 */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 2) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

/* --------------------------------------------------------------------- world */

function Ground() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.14, 0]}
        receiveShadow
      >
        <circleGeometry args={[90, 64]} />
        <meshStandardMaterial color="#070f19" roughness={1} />
      </mesh>
      <gridHelper
        args={[120, 60, "#132434", "#0d1a26"]}
        position={[0, -0.13, 0]}
      />
      {/* distant yard lights on the horizon */}
      {[-34, -22, -12, 14, 24, 35].map((x, index) => (
        <group key={x} position={[x, 0, -22 - (index % 3) * 3]}>
          <mesh position={[0, 3.6, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 7.2, 6]} />
            <meshStandardMaterial color="#16283a" />
          </mesh>
          <mesh position={[0, 7.3, 0]}>
            <sphereGeometry args={[0.2, 10, 10]} />
            <meshBasicMaterial
              color={C.amber}
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SceneBody(props: SceneProps) {
  const {
    mode,
    selected,
    hovered,
    aspect,
    gateDown,
    reducedMotion,
    onHover,
    onSelect,
  } = props;
  const common = { mode, selected, hovered, reducedMotion, onHover, onSelect };

  return (
    <group>
      <Ground />
      <Track />
      <Catenary />

      <Part
        nodeKey="platform"
        at={[-17.6, 0, -6.7]}
        radius={4.6}
        anchorY={4.3}
        {...common}
      >
        <Platform />
      </Part>

      <Part
        nodeKey="hut"
        at={[-8.9, 0, -7.3]}
        radius={2.5}
        anchorY={4.0}
        {...common}
      >
        <Hut />
      </Part>

      <Part
        nodeKey="axle"
        at={[-6.2, 0, NEAR_LINE_Z]}
        radius={1.5}
        anchorY={1.9}
        {...common}
      >
        <Detection />
      </Part>

      <Part
        nodeKey="points"
        at={[-1.6, 0, NEAR_LINE_Z]}
        radius={2.1}
        anchorY={1.7}
        {...common}
      >
        <Points />
      </Part>

      <Part
        nodeKey="signal"
        at={[2.6, 0, 3.4]}
        radius={1.5}
        anchorY={7.6}
        {...common}
      >
        <Signal aspect={aspect} />
      </Part>

      {/* crossing is context rather than a hotspot */}
      <LevelCrossing gateDown={gateDown} reducedMotion={reducedMotion} />

      <Part
        nodeKey="cctv"
        at={[9.6, 0, 4.6]}
        radius={1.3}
        anchorY={5.6}
        {...common}
      >
        <Cctv aspectOn={mode === "telecom"} />
      </Part>

      <Part
        nodeKey="cabling"
        at={[-3.4, 0, 3.9]}
        radius={1.9}
        anchorY={1.6}
        {...common}
      >
        <group>
          <mesh position={[0, 0.2, 0.25]}>
            <boxGeometry args={[3.2, 0.3, 0.55]} />
            <meshStandardMaterial color={C.copper} roughness={0.9} />
          </mesh>
          {/* SPD cabinet */}
          <mesh position={[1.3, 0.55, 1.1]} castShadow>
            <boxGeometry args={[0.62, 1.1, 0.42]} />
            <meshStandardMaterial color="#1b3245" roughness={0.7} />
          </mesh>
          <mesh position={[1.3, 0.62, 1.32]}>
            <boxGeometry args={[0.18, 0.18, 0.02]} />
            <meshStandardMaterial
              color={C.amber}
              emissive={C.amber}
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* earth pit with riser */}
          <mesh position={[-1.1, 0.12, 1.3]}>
            <boxGeometry args={[0.4, 0.24, 0.4]} />
            <meshStandardMaterial color="#20364a" roughness={0.9} />
          </mesh>
          <mesh position={[-1.1, 0.3, 1.3]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
            <meshStandardMaterial
              color={C.copper}
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        </group>
      </Part>

      <Part
        nodeKey="ofc"
        at={[-1.0, 0, DUCT_Z]}
        radius={1.7}
        anchorY={1.3}
        {...common}
      >
        <FibreRoute />
      </Part>

      <Part
        nodeKey="tower"
        at={[5.4, 0, -10.4]}
        radius={2.6}
        anchorY={14.4}
        {...common}
      >
        <Tower />
      </Part>

      <Part
        nodeKey="control"
        at={[12.0, 0, -8.0]}
        radius={3.4}
        anchorY={4.6}
        {...common}
      >
        <ControlRoom />
      </Part>
    </group>
  );
}

export default function LiveSectionScene(props: SceneProps) {
  const pose = useMemo(
    () =>
      poseFor(props.selected) ??
      NODE_CAMERAS[props.selected] ??
      OVERVIEW_CAMERA,
    [props.selected],
  );
  const interacting = props.hovered !== "";

  return (
    <Canvas
      dpr={[1, 1.8]}
      shadows={false}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{
        position: OVERVIEW_CAMERA.position,
        fov: CAMERA_FOV,
        near: 0.1,
        far: 260,
      }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        scene.background = new THREE.Color("#050c16");
        scene.fog = new THREE.Fog("#060f19", 52, 128);
      }}
      onPointerMissed={() => props.onSelect("")}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#8fb4d6", "#050c16", 0.7]} />
      <directionalLight
        position={[16, 22, 18]}
        intensity={2.4}
        color="#dbe8f5"
      />
      <directionalLight
        position={[-18, 10, -14]}
        intensity={0.9}
        color="#2b6f96"
      />
      <directionalLight
        position={[0, 6, -26]}
        intensity={0.5}
        color="#8f6b3a"
      />
      <SceneBody {...props} />
      <FirstFrame onReady={props.onReady} />
      <CameraRig
        pose={pose}
        reducedMotion={props.reducedMotion}
        interacting={interacting}
      />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
