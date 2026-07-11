"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { easeInOut, HAIR_DARK, SHIRT, SKIN, SKIN_SHADOW } from "../constants";
import { Arm } from "./arm";
import { Buttons } from "./buttons";
import { Collar } from "./collar";
import { Eye } from "./eye";
import { Hair } from "./hair";
import { Leg } from "./leg";
import { Mouth } from "./mouth";
import { Shoe } from "./shoe";

export function AvatarModel({
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
      case "thumbsup": {
        const t = clock.getElapsedTime();
        g.rotation.y = Math.sin(t * 0.4) * 0.05;
        g.rotation.z = -0.05;
        g.position.y = BY + Math.sin(t * 0.8) * 0.02;
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

      <Arm side={-1} reaction={reaction} />
      <Arm side={1} reaction={reaction} />

      <Leg side={-1} />
      <Leg side={1} />

      <Shoe side={-1} />
      <Shoe side={1} />
    </group>
  );
}
