"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SHIRT } from "../constants";
import { Hand } from "./hand";

export function Arm({ side, reaction }: { side: -1 | 1; reaction: string }) {
  const s = side;
  const shoulderRef = useRef<THREE.Group>(null);
  const elbowRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!shoulderRef.current || !elbowRef.current) return;
    const t = clock.getElapsedTime();
    const o = s * 1.7;

    if (reaction === "idle") {
      shoulderRef.current.rotation.z =
        s * -0.12 + Math.sin(t * 0.55 + o) * 0.07 + Math.sin(t * 0.21 + o) * 0.035;
      shoulderRef.current.rotation.x =
        Math.sin(t * 0.38 + o) * 0.05 + Math.sin(t * 0.15 + o) * 0.025;

      elbowRef.current.rotation.z =
        s * -0.1 + Math.sin(t * 0.7 + o + 0.8) * 0.05 + Math.sin(t * 0.3 + o + 1.2) * 0.025;
      elbowRef.current.rotation.x = Math.sin(t * 0.45 + o + 0.5) * 0.03;
    } else if (reaction === "thumbsup" && s === 1) {
      shoulderRef.current.rotation.z = -2.6;
      shoulderRef.current.rotation.x = 0.2 + Math.sin(t * 1.5) * 0.03;
      elbowRef.current.rotation.z = 0.4;
      elbowRef.current.rotation.x = 0;
    } else if (reaction === "thumbsup" && s === -1) {
      shoulderRef.current.rotation.z = -0.12 + Math.sin(t * 0.55 + o) * 0.04;
      shoulderRef.current.rotation.x = Math.sin(t * 0.38 + o) * 0.03;
      elbowRef.current.rotation.z = -0.1 + Math.sin(t * 0.7 + o + 0.8) * 0.03;
      elbowRef.current.rotation.x = 0;
    } else {
      shoulderRef.current.rotation.set(0, 0, 0);
      elbowRef.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <group position={[s * 0.3, -0.58, 0]}>
      <mesh>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial color={SHIRT} roughness={0.7} />
      </mesh>

      <group ref={shoulderRef}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.058, 0.26, 16, 32]} />
          <meshStandardMaterial color={SHIRT} roughness={0.7} />
        </mesh>

        <group ref={elbowRef} position={[s * 0.04, -0.36, 0]}>
          <mesh>
            <sphereGeometry args={[0.058, 16, 16]} />
            <meshStandardMaterial color={SHIRT} roughness={0.7} />
          </mesh>

          <mesh position={[0, -0.17, 0]}>
            <capsuleGeometry args={[0.052, 0.2, 16, 32]} />
            <meshStandardMaterial color={SHIRT} roughness={0.7} />
          </mesh>

          <Hand side={side} />
        </group>
      </group>
    </group>
  );
}
