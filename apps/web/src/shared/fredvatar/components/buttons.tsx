"use client";

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
