"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function Eye({
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
