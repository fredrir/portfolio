"use client";

import { PANTS, PANTS_DARK } from "../constants";

export function Leg({ side }: { side: 1 | -1 }) {
  return (
    <group>
      <mesh position={[side * 0.1, -1.35, 0]}>
        <capsuleGeometry args={[0.08, 0.35, 16, 32]} />
        <meshStandardMaterial color={PANTS} roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[side * 0.1, -1.72, 0]}>
        <capsuleGeometry args={[0.075, 0.3, 16, 32]} />
        <meshStandardMaterial color={PANTS_DARK} roughness={0.95} metalness={0.02} />
      </mesh>
    </group>
  );
}
