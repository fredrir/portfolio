"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function Mouth({ expression }: { expression: number }) {
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
      const wave = Math.sin(t * 8) * 0.4 + Math.sin(t * 13) * 0.3 + Math.sin(t * 5) * 0.2;
      const open = 0.3 + Math.max(0, wave) * 1.4;
      const wide = 1 + Math.max(0, wave) * 0.3;
      groupRef.current.scale.set(wide, open, 1);
    } else {
      const curr = groupRef.current.scale.y;
      const currX = groupRef.current.scale.x;
      groupRef.current.scale.set(currX + (1.15 - currX) * 0.1, curr + (0.6 - curr) * 0.1, 1);
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
