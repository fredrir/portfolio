"use client";

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
