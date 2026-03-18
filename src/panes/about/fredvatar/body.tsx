"use client";

import { SHIRT, PANTS, PANTS_DARK } from "./constants";

export function Collar() {
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

export function Buttons() {
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

export function Shoe({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 0.1, -2.0, 0.04]} rotation={[0.3, 0, 0]}>
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
      <mesh position={[side * -0.03, 0.02, 0.06]}>
        <boxGeometry args={[0.03, 0.02, 0.015]} />
        <meshStandardMaterial color="#E85D3A" roughness={0.5} />
      </mesh>
    </group>
  );
}
