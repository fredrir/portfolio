"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const REACTIONS = [
  "spin",
  "bounce",
  "wiggle",
  "flip",
  "wave",
  "nod",
  "jello",
  "disco",
] as const;

const SHIRT = "#B8A089";
const SHIRT_DARK = "#A08870";
const SKIN = "#F0C8AD";
const SKIN_SHADOW = "#E8BFA3";
const HAIR = "#8B6B4A";
const HAIR_DARK = "#5C3A1E";
const PANTS = "#1E3A5F";
const PANTS_DARK = "#162D4A";

function sr(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Hair() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const curls = useMemo(() => {
    const result: { pos: THREE.Vector3; s: number }[] = [];

    for (let i = 0; i < 150; i++) {
      const theta = sr(i * 7 + 1) * Math.PI * 2;
      const phi = sr(i * 13 + 3) * Math.PI * 0.6;
      const r = 0.44 + sr(i * 17 + 5) * 0.14;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      if (z > 0.2 && y < 0.1 && Math.abs(x) < 0.3) continue;
      if (z > 0.35 && sr(i * 41 + 9) > 0.3) continue;

      result.push({
        pos: new THREE.Vector3(x, y, z),
        s: 0.045 + sr(i * 23 + 7) * 0.05,
      });
    }

    for (let i = 0; i < 30; i++) {
      const angle = sr(i * 11 + 100) * Math.PI * 2;
      const isSide = Math.abs(Math.cos(angle)) > 0.5;
      if (!isSide && Math.sin(angle) > 0) continue;
      const y = -0.08 + sr(i * 19 + 200) * 0.35;
      const rad = 0.46 + sr(i * 29 + 300) * 0.1;
      result.push({
        pos: new THREE.Vector3(Math.cos(angle) * rad, y, Math.sin(angle) * rad),
        s: 0.04 + sr(i * 31 + 400) * 0.04,
      });
    }

    for (let i = 0; i < 18; i++) {
      result.push({
        pos: new THREE.Vector3(
          -0.2 + sr(i * 37 + 500) * 0.4,
          0.28 + sr(i * 41 + 600) * 0.16,
          0.3 + sr(i * 43 + 700) * 0.12,
        ),
        s: 0.03 + sr(i * 47 + 800) * 0.035,
      });
    }

    return result;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const v = new THREE.Vector3();
    curls.forEach((curl, i) => {
      v.set(curl.s, curl.s, curl.s);
      m.compose(curl.pos, q, v);
      meshRef.current!.setMatrixAt(i, m);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [curls]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, curls.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={HAIR} roughness={0.85} />
    </instancedMesh>
  );
}

function Eye({
  position,
  hovered,
}: {
  position: [number, number, number];
  hovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);
  const blinkRef = useRef({ next: 2 + Math.random() * 3, progress: 1 });

  useFrame((_, delta) => {
    if (!groupRef.current || !irisRef.current || !pupilRef.current) return;
    const target = hovered ? 1.3 : 1;
    const curr = irisRef.current.scale.x;
    const lerped = curr + (target - curr) * 0.12;
    irisRef.current.scale.setScalar(lerped);
    pupilRef.current.scale.setScalar(lerped);

    const b = blinkRef.current;
    b.next -= delta;
    if (b.next <= 0) {
      b.progress = 0;
      b.next = 4 + Math.random() * 6;
    }
    b.progress = Math.min(b.progress + delta * 4, 1);
    const openAmount =
      b.progress < 0.5 ? 1 - b.progress * 2 : (b.progress - 0.5) * 2;
    groupRef.current.scale.set(1, Math.max(openAmount, 0.05), 1);
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#F8F8F8" />
        </mesh>
        <mesh ref={irisRef} position={[0, 0, 0.035]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#0350F7" />
        </mesh>
        <mesh ref={pupilRef} position={[0, 0, 0.048]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.012, 0.012, 0.055]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
}

function Mouth({ expression }: { expression: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const talkRef = useRef({
    talking: false,
    next: 2 + Math.random() * 6,
    duration: 0,
  });

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    if (expression >= 0) {
      const heights = [0.8, 1.4, 0.3, 0.8, 1.2, 0.5, 1.0, 1.6];
      groupRef.current.scale.set(1, heights[expression], 1);
      return;
    }

    const s = talkRef.current;
    s.next -= delta;
    if (s.next <= 0) {
      if (s.talking) {
        s.talking = false;
        s.next = 5 + Math.random() * 10;
      } else {
        s.talking = true;
        s.duration = 1.5 + Math.random() * 3;
        s.next = s.duration;
      }
    }

    if (s.talking) {
      const t = clock.getElapsedTime();
      const wave =
        Math.sin(t * 8) * 0.4 + Math.sin(t * 13) * 0.3 + Math.sin(t * 5) * 0.2;
      const open = 0.3 + Math.max(0, wave) * 1.4;
      const wide = 1 + Math.max(0, wave) * 0.3;
      groupRef.current.scale.set(wide, open, 1);
    } else {
      const curr = groupRef.current.scale.y;
      const currX = groupRef.current.scale.x;
      groupRef.current.scale.set(
        currX + (1.15 - currX) * 0.1,
        curr + (0.6 - curr) * 0.1,
        1,
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.14, 0.41]}>
      <mesh scale={[1.4, 1, 1]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#C4756E" />
      </mesh>
      <mesh position={[-0.05, 0.025, 0.005]} scale={[0.7, 0.7, 0.7]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#C4756E" />
      </mesh>
      <mesh position={[0.05, 0.025, 0.005]} scale={[0.7, 0.7, 0.7]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#C4756E" />
      </mesh>
      <mesh position={[0, 0.02, 0.045]}>
        <boxGeometry args={[0.065, 0.018, 0.008]} />
        <meshBasicMaterial color="#F5F5F0" />
      </mesh>
      <mesh position={[-0.018, 0.02, 0.05]}>
        <boxGeometry args={[0.02, 0.016, 0.006]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 0.02, 0.05]}>
        <boxGeometry args={[0.02, 0.016, 0.006]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.018, 0.02, 0.05]}>
        <boxGeometry args={[0.02, 0.016, 0.006]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, -0.02, 0.048]}>
        <boxGeometry args={[0.065, 0.016, 0.008]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

function Collar() {
  return (
    <group position={[0, -0.56, 0.22]}>
      <mesh position={[-0.07, 0, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.13, 0.08, 0.015]} />
        <meshStandardMaterial color="#C8B89E" roughness={0.55} />
      </mesh>
      <mesh position={[0.07, 0, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.13, 0.08, 0.015]} />
        <meshStandardMaterial color="#C8B89E" roughness={0.55} />
      </mesh>
    </group>
  );
}

function Buttons() {
  const positions = [-0.6, -0.7, -0.8, -0.9, -1.0];
  return (
    <group>
      {positions.map((y, i) => (
        <mesh key={i} position={[0, y, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.01, 12]} />
          <meshStandardMaterial color="#F0EDE8" roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function AvatarModel({
  reaction,
  hovered,
  exprIdx,
}: {
  reaction: string;
  hovered: boolean;
  exprIdx: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const startRef = useRef(0);
  const prevRef = useRef("idle");

  useEffect(() => {
    if (reaction !== prevRef.current) {
      startRef.current = performance.now();
      prevRef.current = reaction;
    }
  }, [reaction]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const g = ref.current;
    const e = (performance.now() - startRef.current) / 1000;

    const BY = 0.75;
    g.rotation.set(0, 0, 0);
    g.position.set(0, BY, 0);
    g.scale.set(1, 1, 1);

    switch (reaction) {
      case "idle": {
        const t = clock.getElapsedTime();
        g.rotation.y = Math.sin(t * 0.5) * 0.06 + Math.sin(t * 0.17) * 0.03;
        g.rotation.x = Math.sin(t * 0.23) * 0.015 + Math.sin(t * 0.41) * 0.01;
        g.rotation.z = Math.sin(t * 0.35) * 0.02 + Math.sin(t * 0.13) * 0.008;
        const breath = Math.sin(t * 1.1) * 0.005;
        g.position.y = BY + Math.sin(t * 0.7) * 0.02 + breath;
        g.position.x = Math.sin(t * 0.19) * 0.008;
        g.scale.set(1, 1 + breath * 1.5, 1);
        break;
      }
      case "spin": {
        const p = Math.min(e / 0.8, 1);
        g.rotation.y = easeInOut(p) * Math.PI * 2;
        const s = 1 + Math.sin(p * Math.PI) * 0.12;
        g.scale.set(s, s, s);
        break;
      }
      case "bounce": {
        const p = Math.min(e / 0.9, 1);
        let yOff = 0;
        let sy = 1;
        if (p < 0.15) {
          sy = 1 - (p / 0.15) * 0.15;
        } else if (p < 0.35) {
          const t = (p - 0.15) / 0.2;
          yOff = t * 0.5;
          sy = 1 + t * 0.05;
        } else if (p < 0.55) {
          const t = (p - 0.35) / 0.2;
          yOff = (1 - t) * 0.5;
          sy = 1 + (1 - t) * 0.05;
        } else if (p < 0.72) {
          const t = (p - 0.55) / 0.17;
          yOff = t * 0.2;
          sy = 1 + t * 0.02;
        } else {
          const t = (p - 0.72) / 0.28;
          yOff = (1 - t) * 0.2;
          sy = 1 + (1 - t) * 0.02;
        }
        g.position.y = BY + yOff;
        g.scale.set(1, sy, 1);
        break;
      }
      case "wiggle": {
        const p = Math.min(e / 0.7, 1);
        g.rotation.z = Math.sin(p * 22) * 0.25 * (1 - p);
        break;
      }
      case "flip": {
        const p = Math.min(e / 0.8, 1);
        g.rotation.x = easeInOut(p) * Math.PI * 2;
        const s = 1 + Math.sin(p * Math.PI) * 0.12;
        g.scale.set(s, s, s);
        break;
      }
      case "wave": {
        const d = 1.0;
        const p = Math.min(e / d, 1);
        const decay = 1 - p * p;
        g.rotation.z = Math.sin(p * 16) * 0.2 * decay;
        g.position.x = Math.sin(p * 16) * 0.15 * decay;
        g.position.y = BY + Math.abs(Math.sin(p * 8)) * 0.1 * decay;
        break;
      }
      case "nod": {
        const d = 0.9;
        const p = Math.min(e / d, 1);
        const decay = 1 - p;
        g.rotation.x = Math.sin(p * 14) * 0.2 * decay;
        g.position.y = BY + Math.sin(p * 14) * 0.05 * decay;
        break;
      }
      case "jello": {
        const d = 1.2;
        const p = Math.min(e / d, 1);
        const decay = 1 - p;
        const freq = p * 20;
        g.scale.set(
          1 + Math.sin(freq) * 0.15 * decay,
          1 + Math.sin(freq + Math.PI) * 0.15 * decay,
          1 + Math.sin(freq + Math.PI * 0.5) * 0.1 * decay,
        );
        g.rotation.z = Math.sin(freq * 0.7) * 0.08 * decay;
        break;
      }
      case "disco": {
        const d = 1.4;
        const p = Math.min(e / d, 1);
        const decay = 1 - p * p;
        const t = p * 18;
        g.rotation.y = Math.sin(t) * 0.4 * decay;
        g.rotation.z = Math.sin(t * 0.7) * 0.15 * decay;
        g.position.y = BY + Math.abs(Math.sin(t * 1.5)) * 0.2 * decay;
        g.position.x = Math.sin(t * 0.5) * 0.12 * decay;
        const s = 1 + Math.sin(t * 2) * 0.06 * decay;
        g.scale.set(s, s, s);
        break;
      }
    }

    if (hovered && reaction === "idle") g.scale.multiplyScalar(1.05);
  });

  return (
    <group ref={ref} position={[0, 0.75, 0]}>
      <mesh scale={[1, 1.05, 0.95]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>

      <Hair />

      <Eye position={[-0.11, 0.05, 0.36]} hovered={hovered} />
      <Eye position={[0.11, 0.05, 0.36]} hovered={hovered} />

      <mesh position={[-0.11, 0.13, 0.37]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.08, 0.012, 0.015]} />
        <meshStandardMaterial color={HAIR_DARK} />
      </mesh>
      <mesh position={[0.11, 0.13, 0.37]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.08, 0.012, 0.015]} />
        <meshStandardMaterial color={HAIR_DARK} />
      </mesh>

      <mesh position={[0, -0.02, 0.41]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color={SKIN_SHADOW} roughness={0.6} />
      </mesh>

      <Mouth expression={exprIdx} />

      <mesh position={[-0.41, 0, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={SKIN_SHADOW} roughness={0.6} />
      </mesh>
      <mesh position={[0.41, 0, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={SKIN_SHADOW} roughness={0.6} />
      </mesh>

      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.18, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>

      <Collar />

      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.25, 0.22, 0.35, 16]} />
        <meshStandardMaterial color={SHIRT} roughness={0.7} />
      </mesh>
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.22, 0.2, 0.25, 16]} />
        <meshStandardMaterial color={SHIRT} roughness={0.7} />
      </mesh>

      <Buttons />

      <group position={[-0.3, -0.58, 0]}>
        <mesh>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color={SHIRT} roughness={0.7} />
        </mesh>
        <mesh position={[-0.02, -0.22, 0]} rotation={[0, 0, 0.06]}>
          <capsuleGeometry args={[0.055, 0.24, 16, 32]} />
          <meshStandardMaterial color={SHIRT} roughness={0.7} />
        </mesh>
        <mesh position={[-0.04, -0.46, 0]}>
          <capsuleGeometry args={[0.05, 0.22, 16, 32]} />
          <meshStandardMaterial color={SHIRT} roughness={0.7} />
        </mesh>
        <mesh position={[-0.04, -0.66, 0.02]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
      </group>

      <group position={[0.3, -0.58, 0]}>
        <mesh>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial color={SHIRT} roughness={0.7} />
        </mesh>
        <mesh position={[0.02, -0.22, 0]} rotation={[0, 0, -0.06]}>
          <capsuleGeometry args={[0.055, 0.24, 16, 32]} />
          <meshStandardMaterial color={SHIRT} roughness={0.7} />
        </mesh>
        <mesh position={[0.04, -0.46, 0]}>
          <capsuleGeometry args={[0.05, 0.22, 16, 32]} />
          <meshStandardMaterial color={SHIRT} roughness={0.7} />
        </mesh>
        <mesh position={[0.04, -0.66, 0.02]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
      </group>

      <mesh position={[-0.1, -1.35, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 16, 32]} />
        <meshStandardMaterial color={PANTS} roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0.1, -1.35, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 16, 32]} />
        <meshStandardMaterial color={PANTS} roughness={0.95} metalness={0.02} />
      </mesh>

      <mesh position={[-0.1, -1.72, 0]}>
        <capsuleGeometry args={[0.075, 0.3, 16, 32]} />
        <meshStandardMaterial
          color={PANTS_DARK}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>
      <mesh position={[0.1, -1.72, 0]}>
        <capsuleGeometry args={[0.075, 0.3, 16, 32]} />
        <meshStandardMaterial
          color={PANTS_DARK}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      <group position={[-0.1, -2.0, 0.04]} rotation={[0.3, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.12, 0.09, 0.2]} />
          <meshStandardMaterial color="#F0F0F0" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.12, 0.02, 0.2]} />
          <meshStandardMaterial color="#E8E8E8" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.045, 0]}>
          <boxGeometry args={[0.13, 0.02, 0.21]} />
          <meshStandardMaterial color="#DDDDDD" roughness={0.6} />
        </mesh>
        <mesh position={[0.03, 0.02, 0.06]}>
          <boxGeometry args={[0.03, 0.02, 0.015]} />
          <meshStandardMaterial color="#E85D3A" roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.1, -2.0, 0.04]} rotation={[0.3, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.12, 0.09, 0.2]} />
          <meshStandardMaterial color="#F0F0F0" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.12, 0.02, 0.2]} />
          <meshStandardMaterial color="#E8E8E8" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.045, 0]}>
          <boxGeometry args={[0.13, 0.02, 0.21]} />
          <meshStandardMaterial color="#DDDDDD" roughness={0.6} />
        </mesh>
        <mesh position={[-0.03, 0.02, 0.06]}>
          <boxGeometry args={[0.03, 0.02, 0.015]} />
          <meshStandardMaterial color="#E85D3A" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export function FredVatar() {
  const [reaction, setReaction] = useState<string>("idle");
  const [exprIdx, setExprIdx] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const clickCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const triggerReaction = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const i = clickCount.current % REACTIONS.length;
    clickCount.current++;
    setReaction(REACTIONS[i]);
    setExprIdx(i);
    timerRef.current = setTimeout(() => {
      setReaction("idle");
      setExprIdx(-1);
    }, 1200);
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      return setTimeout(() => {
        triggerReaction();
        intervalRef.current = scheduleNext();
      }, 10000);
    };
    const intervalRef = { current: scheduleNext() };
    return () => clearTimeout(intervalRef.current);
  }, [triggerReaction]);

  return (
    <div
      className="cursor-pointer w-32.5 h-55 @sm:w-35 @sm:h-62.5 @xl:w-45 @xl:h-56.5"
      onClick={triggerReaction}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="Interactive 3D avatar of Fredrik"
    >
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={0.7} />
        <directionalLight
          position={[-2, 2, 3]}
          intensity={0.3}
          color="#b0c4de"
        />
        <pointLight position={[0, 1, -2]} intensity={0.4} color="#8EC8E8" />
        <AvatarModel reaction={reaction} hovered={hovered} exprIdx={exprIdx} />
      </Canvas>
    </div>
  );
}
