"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { infraNodes, type InfraMode } from "@/lib/content/infrastructure-3d";

interface SceneProps {
  mode: InfraMode;
  selected: string;
  hovered: string;
  onHover: (key: string) => void;
  onSelect: (key: string) => void;
}

const COLORS = {
  ballast: "#0d1a27",
  rail: "#93a5b8",
  sleeper: "#25384c",
  structure: "#1b2f45",
  structureLight: "#24405c",
  concrete: "#31465c",
  metal: "#5a7086",
  glass: "#0e2b3d",
  red: "#ef4444",
  green: "#24c78b",
  amber: "#f5b942",
  cable: "#c8863c",
};

function Part({
  nodeKey,
  mode,
  selected,
  hovered,
  onHover,
  onSelect,
  children,
  radius = 1.6,
}: {
  nodeKey: string;
  mode: InfraMode;
  selected: string;
  hovered: string;
  onHover: (key: string) => void;
  onSelect: (key: string) => void;
  children: React.ReactNode;
  radius?: number;
}) {
  const node = infraNodes.find((item) => item.key === nodeKey)!;
  const group = useRef<THREE.Group>(null);
  const [pointer, setPointer] = useState(false);
  const active = selected === nodeKey || hovered === nodeKey;
  const relevant = node.division === "both" || node.division === mode;
  const accent = node.division === "telecom" ? COLORS.green : node.division === "signalling" ? COLORS.red : "#e2e8ef";

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const targetScale = active ? 1.045 : 1;
    const s = THREE.MathUtils.damp(g.scale.x, targetScale, 8, delta);
    g.scale.setScalar(s);

    const targetOpacity = relevant ? 1 : 0.16;
    g.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        const mat = material as THREE.MeshStandardMaterial;
        if (mat && "opacity" in mat) {
          mat.transparent = true;
          mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 8, delta);
        }
      });
    });
  });

  return (
    <group
      ref={group}
      position={node.position}
      onPointerOver={(event) => {
        event.stopPropagation();
        setPointer(true);
        onHover(nodeKey);
      }}
      onPointerOut={() => {
        setPointer(false);
        onHover("");
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(nodeKey);
      }}
    >
      {children}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.17, 0]}>
        <ringGeometry args={[radius, radius + 0.09, 64]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={active || pointer ? 0.85 : relevant ? 0.14 : 0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
      {active ? (
        <Html position={[0, radius * 1.8, 0]} center style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
          <div className="whitespace-nowrap border border-white/15 bg-[#050c16]/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            {node.short}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Track() {
  const sleepers = useMemo(() => Array.from({ length: 40 }, (_, i) => -18.5 + i * 0.94), []);
  return (
    <group>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[40, 0.16, 3.9]} />
        <meshStandardMaterial color={COLORS.ballast} roughness={0.95} />
      </mesh>
      {[-0.72, 0.72].map((z) => (
        <mesh key={z} position={[0, 0.29, z]}>
          <boxGeometry args={[40, 0.13, 0.13]} />
          <meshStandardMaterial color={COLORS.rail} metalness={0.9} roughness={0.28} />
        </mesh>
      ))}
      {sleepers.map((x) => (
        <mesh key={x} position={[x, 0.18, 0]}>
          <boxGeometry args={[0.3, 0.1, 3.2]} />
          <meshStandardMaterial color={COLORS.sleeper} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Catenary() {
  const masts = useMemo(() => [-16, -8, 0, 8, 16], []);
  return (
    <group>
      {masts.map((x) => (
        <group key={x} position={[x, 0, 3.05]}>
          <mesh position={[0, 2.9, 0]}>
            <cylinderGeometry args={[0.055, 0.08, 5.8, 8]} />
            <meshStandardMaterial color={COLORS.metal} metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[-0.75, 5.6, -1.15]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 2.4, 6]} />
            <meshStandardMaterial color={COLORS.metal} metalness={0.6} roughness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 5.9, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 38, 4]} />
        <meshStandardMaterial color="#54687d" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Signal() {
  const green = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 1.6 + Math.sin(t * 1.6) * 0.25;
    if (green.current) green.current.emissiveIntensity = pulse;
    if (glow.current) glow.current.intensity = 2.2 + Math.sin(t * 1.6) * 0.4;
  });

  return (
    <group>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.075, 0.11, 3.4, 10]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.55} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 0.28, 12]} />
        <meshStandardMaterial color={COLORS.concrete} roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[0, 3.9, 0]}>
        <boxGeometry args={[0.62, 1.5, 0.42]} />
        <meshStandardMaterial color="#0b1622" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.9, 0.24]}>
        <boxGeometry args={[0.72, 1.62, 0.08]} />
        <meshStandardMaterial color="#0e1b28" roughness={0.5} />
      </mesh>
      {[
        { y: 4.35, color: COLORS.red, on: false },
        { y: 4.05, color: COLORS.amber, on: false },
        { y: 3.72, color: COLORS.green, on: true },
        { y: 3.42, color: "#8fa0b3", on: false },
      ].map((lamp) => (
        <mesh key={lamp.y} position={[0, lamp.y, 0.3]}>
          <sphereGeometry args={[0.14, 20, 20]} />
          {lamp.on ? (
            <meshStandardMaterial ref={green} color={lamp.color} emissive={lamp.color} emissiveIntensity={1.6} toneMapped={false} />
          ) : (
            <meshStandardMaterial color={lamp.on ? lamp.color : "#13212f"} emissive={lamp.color} emissiveIntensity={0.08} />
          )}
        </mesh>
      ))}
      <mesh position={[0, 3.72, 0.3]}>
        <circleGeometry args={[0.2, 24]} />
        <meshBasicMaterial color={COLORS.green} transparent opacity={0.12} />
      </mesh>
      <pointLight ref={glow} position={[0, 3.72, 0.7]} color={COLORS.green} intensity={2} distance={5} />
      {/* ladder */}
      {[0.6, 1.1, 1.6, 2.1].map((y) => (
        <mesh key={y} position={[0.3, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 5]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      ))}
    </group>
  );
}

function Points() {
  return (
    <group>
      {[0.5, -0.5].map((direction) => (
        <group key={direction} rotation={[0, direction * 0.16, 0]} position={[direction * 0.6, 0, 0]}>
          {[-0.72, 0.72].map((z) => (
            <mesh key={z} position={[0, 0.3, z]}>
              <boxGeometry args={[4.2, 0.12, 0.11]} />
              <meshStandardMaterial color={COLORS.rail} metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[1.6, 0.16, 1.25]}>
        <boxGeometry args={[0.75, 0.32, 0.5]} />
        <meshStandardMaterial color="#b9c6d4" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[1.15, 0.2, 0.85]} rotation={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.3, 6]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[1.6, 0.33, 1.25]}>
        <boxGeometry args={[0.42, 0.04, 0.2]} />
        <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Detection() {
  const blink = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (blink.current) blink.current.emissiveIntensity = 0.7 + Math.abs(Math.sin(clock.getElapsedTime() * 2)) * 1.4;
  });
  return (
    <group>
      {[
        [-0.9, 0.72],
        [0.9, -0.72],
      ].map(([x, z]) => (
        <group key={`${x}`} position={[x, 0, z]}>
          <mesh position={[0, 0.32, z > 0 ? 0.28 : -0.28]}>
            <boxGeometry args={[0.22, 0.18, 0.16]} />
            <meshStandardMaterial color="#d7b24a" emissive="#a8801f" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 0.2, z > 0 ? 0.12 : -0.12]}>
            <boxGeometry args={[0.03, 0.16, 0.03]} />
            <meshStandardMaterial color={COLORS.cable} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.2, 1.05]}>
        <boxGeometry args={[0.5, 0.36, 0.26]} />
        <meshStandardMaterial color="#16324a" roughness={0.7} />
      </mesh>
      <mesh position={[0.17, 0.26, 1.19]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshStandardMaterial ref={blink} color={COLORS.green} emissive={COLORS.green} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Hut() {
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3.4, 2, 2.4]} />
        <meshStandardMaterial color={COLORS.structure} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.06, 0]}>
        <boxGeometry args={[3.7, 0.12, 2.7]} />
        <meshStandardMaterial color="#0f1e2d" roughness={0.7} />
      </mesh>
      <mesh position={[-0.9, 2.2, 0.5]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <mesh position={[0.7, 0.85, 1.21]}>
        <boxGeometry args={[0.75, 1.6, 0.06]} />
        <meshStandardMaterial color="#0a1521" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[-1.05, 1.3, 1.21]}>
        <boxGeometry args={[0.75, 0.4, 0.05]} />
        <meshStandardMaterial color={COLORS.glass} emissive={COLORS.amber} emissiveIntensity={0.35} toneMapped={false} />
      </mesh>
      {[0.6, 1].map((y) => (
        <mesh key={y} position={[0, y, -1.25]}>
          <boxGeometry args={[2.6, 0.04, 0.04]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      ))}
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.09, 1.55]}>
          <boxGeometry args={[0.12, 0.18, 0.9]} />
          <meshStandardMaterial color="#2a3f57" />
        </mesh>
      ))}
    </group>
  );
}

function Cabling() {
  const segments = useMemo(() => Array.from({ length: 16 }, (_, i) => -13.5 + i * 0.85), []);
  return (
    <group>
      {segments.map((x, i) => (
        <mesh key={x} position={[x, 0.14, 0]} rotation={[0, i % 2 ? 0.02 : -0.02, 0]}>
          <boxGeometry args={[0.78, 0.14, 0.36]} />
          <meshStandardMaterial color="#8a5a2b" roughness={0.9} />
        </mesh>
      ))}
      {[-11, -5, 1].map((x) => (
        <group key={x} position={[x, 0, 0.6]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.24, 10]} />
            <meshStandardMaterial color="#0f1e2d" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
            <meshStandardMaterial color="#c7a06a" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color={COLORS.green} emissive={COLORS.green} emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ControlRoom() {
  return (
    <group>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[4.6, 2.4, 3.2]} />
        <meshStandardMaterial color={COLORS.structureLight} roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.46, 0]}>
        <boxGeometry args={[4.9, 0.14, 3.5]} />
        <meshStandardMaterial color="#0e1c2a" />
      </mesh>
      <mesh position={[0, 1.35, 1.62]}>
        <boxGeometry args={[3.2, 0.95, 0.06]} />
        <meshStandardMaterial color={COLORS.glass} emissive="#3fd6a5" emissiveIntensity={0.55} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.35, 1.66]}>
        <boxGeometry args={[0.05, 0.95, 0.02]} />
        <meshStandardMaterial color="#0a1521" />
      </mesh>
      <mesh position={[1.5, 2.2, 1.7]}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial color={COLORS.red} emissive={COLORS.red} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[1.9, 2.75, 0.4]} rotation={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.35, 0.05, 0.28, 16, 1, true]} />
        <meshStandardMaterial color="#d5dee7" side={THREE.DoubleSide} metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[1.9, 2.6, 0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
    </group>
  );
}

function Tower() {
  const beacon = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (beacon.current) {
      const on = Math.sin(clock.getElapsedTime() * 2.2) > 0.4;
      beacon.current.emissiveIntensity = on ? 2.4 : 0.15;
    }
  });
  const braces = useMemo(() => Array.from({ length: 6 }, (_, i) => 0.8 + i * 1.1), []);
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.6, 0.24, 1.6]} />
        <meshStandardMaterial color="#20374d" />
      </mesh>
      {[
        [-0.55, -0.55],
        [0.55, -0.55],
        [-0.55, 0.55],
        [0.55, 0.55],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x * 0.62, 3.8, z * 0.62]} rotation={[x * 0.035, 0, -z * 0.035]}>
          <cylinderGeometry args={[0.035, 0.05, 7.4, 6]} />
          <meshStandardMaterial color={COLORS.metal} metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      {braces.map((y) => (
        <group key={y}>
          <mesh position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.85, 4]} />
            <meshStandardMaterial color={COLORS.metal} />
          </mesh>
          <mesh position={[0, y + 0.28, 0]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.85, 4]} />
            <meshStandardMaterial color={COLORS.metal} />
          </mesh>
        </group>
      ))}
      {[
        [0.28, 7.6, 0, 0],
        [-0.28, 7.6, 0, 0],
        [0, 7.6, 0.28, Math.PI / 2],
      ].map(([x, y, z, rot], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, rot, 0]}>
          <boxGeometry args={[0.16, 0.5, 0.04]} />
          <meshStandardMaterial color="#dbe4ec" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 8.05, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9, 5]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <mesh position={[0, 8.5, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial ref={beacon} color={COLORS.red} emissive={COLORS.red} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 8.5, 0]} color={COLORS.red} intensity={0.7} distance={4} />
    </group>
  );
}

function FibreRoute() {
  const dots = useMemo(() => Array.from({ length: 13 }, (_, i) => -15 + i * 2.3), []);
  const packet = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!packet.current) return;
    const t = (clock.getElapsedTime() * 0.16) % 1;
    packet.current.position.x = -15 + t * 27;
  });
  return (
    <group>
      {dots.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.5, 0.06, 0.28]} />
            <meshStandardMaterial color="#1f3549" />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.34, 0.18, 0.22]} />
            <meshStandardMaterial color="#173a33" emissive={COLORS.green} emissiveIntensity={0.12} />
          </mesh>
        </group>
      ))}
      <mesh ref={packet} position={[-15, 0.3, 0]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshBasicMaterial color={COLORS.green} toneMapped={false} />
      </mesh>
      {[-10, 0, 9].map((x) => (
        <mesh key={x} position={[x, 0.1, 0.5]}>
          <boxGeometry args={[0.7, 0.2, 0.5]} />
          <meshStandardMaterial color="#2b4257" />
        </mesh>
      ))}
    </group>
  );
}

function CctvCamera() {
  return (
    <group>
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.055, 0.075, 3.5, 8]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.26, 0.3, 0.2, 10]} />
        <meshStandardMaterial color={COLORS.concrete} />
      </mesh>
      <mesh position={[0.18, 3.5, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.62, 0.22, 0.24]} />
        <meshStandardMaterial color="#d8e1ea" roughness={0.5} />
      </mesh>
      <mesh position={[0.5, 3.47, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 12]} />
        <meshStandardMaterial color="#0a1521" />
      </mesh>
      <mesh position={[0.56, 3.47, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={COLORS.red} emissive={COLORS.red} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Platform() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[6.4, 0.6, 2.6]} />
        <meshStandardMaterial color="#2a3f55" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[6.6, 0.05, 2.8]} />
        <meshStandardMaterial color="#3d5670" roughness={0.7} />
      </mesh>
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} position={[x, 2, 0.9]}>
          <cylinderGeometry args={[0.05, 0.05, 2.8, 8]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      ))}
      <mesh position={[0, 3.4, 0.6]} rotation={[0.06, 0, 0]}>
        <boxGeometry args={[6.6, 0.1, 2.2]} />
        <meshStandardMaterial color="#16283a" roughness={0.7} />
      </mesh>
      {[-2, 0, 2].map((x) => (
        <pointLight key={x} position={[x, 3.1, 0.4]} color="#ffd9a0" intensity={0.5} distance={3.4} />
      ))}
      {[-2, 0, 2].map((x) => (
        <mesh key={`lamp-${x}`} position={[x, 3.1, 0.4]}>
          <boxGeometry args={[0.4, 0.05, 0.12]} />
          <meshStandardMaterial color="#ffe3b0" emissive="#ffd9a0" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[2.4, 2.3, 0.9]} rotation={[0, -0.5, 0]}>
        <boxGeometry args={[0.34, 0.22, 0.2]} />
        <meshStandardMaterial color="#c8d3dd" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Scene({ mode, selected, hovered, onHover, onSelect }: SceneProps) {
  const common = { mode, selected, hovered, onHover, onSelect };
  return (
    <group position={[0, 0, 0]}>
      <Track />
      <Catenary />

      <Part nodeKey="signal" {...common} radius={1.2}>
        <Signal />
      </Part>
      <Part nodeKey="points" {...common} radius={1.9}>
        <Points />
      </Part>
      <Part nodeKey="axle" {...common} radius={1.5}>
        <Detection />
      </Part>
      <Part nodeKey="hut" {...common} radius={2.4}>
        <Hut />
      </Part>
      <Part nodeKey="cabling" {...common} radius={1.8}>
        <Cabling />
      </Part>
      <Part nodeKey="control" {...common} radius={2.9}>
        <ControlRoom />
      </Part>
      <Part nodeKey="tower" {...common} radius={1.9}>
        <Tower />
      </Part>
      <Part nodeKey="ofc" {...common} radius={2.2}>
        <FibreRoute />
      </Part>
      <Part nodeKey="cctv" {...common} radius={1.2}>
        <CctvCamera />
      </Part>
      <Part nodeKey="platform" {...common} radius={3.2}>
        <Platform />
      </Part>

      <Grid
        position={[0, -0.02, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#16283a"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#1d3a52"
        fadeDistance={54}
        fadeStrength={1.4}
        infiniteGrid
        followCamera={false}
      />
    </group>
  );
}

export default function RailwayScene(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [17, 13.5, 19], fov: 32, near: 0.1, far: 140 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => props.onSelect("")}
    >
      <color attach="background" args={["#050c16"]} />
      <fog attach="fog" args={["#050c16", 34, 78]} />
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#7fa6c9", "#050c16", 0.55]} />
      <directionalLight position={[12, 18, 10]} intensity={1.5} color="#cfe0f0" />
      <directionalLight position={[-14, 8, -10]} intensity={0.55} color="#2e6f8f" />
      <Scene {...props} />
      <OrbitControls
        makeDefault
        target={[0, 1.6, 0]}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.06}
        minPolarAngle={0.55}
        maxPolarAngle={Math.PI / 2.35}
        autoRotate
        autoRotateSpeed={0.32}
      />
    </Canvas>
  );
}
