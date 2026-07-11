"use client";

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
