"use client";

import { SKIN, SKIN_SHADOW } from "../constants";

export function Hand({ side }: { side: 1 | -1 }) {
  const fingers = [
    { x: -0.03, length: 0.045, angle: -0.15 },
    { x: -0.01, length: 0.055, angle: -0.05 },
    { x: 0.01, length: 0.05, angle: 0.05 },
    { x: 0.03, length: 0.04, angle: 0.15 },
  ];

  return (
    <group position={[0, -0.36, 0.02]}>
      <mesh scale={[1, 0.8, 0.55]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>

      {fingers.map((f, i) => (
        <group key={i} position={[f.x, -0.05, 0]} rotation={[0, 0, f.angle]}>
          <mesh position={[0, -f.length / 2, 0]}>
            <capsuleGeometry args={[0.012, f.length, 8, 16]} />
            <meshStandardMaterial color={SKIN} roughness={0.55} />
          </mesh>
          <mesh position={[0, -f.length - 0.005, 0]}>
            <sphereGeometry args={[0.011, 8, 8]} />
            <meshStandardMaterial color={SKIN_SHADOW} roughness={0.6} />
          </mesh>
        </group>
      ))}

      <group
        position={[side * -0.04, -0.01, 0.01]}
        rotation={[0, 0, side * 0.7]}
      >
        <mesh position={[0, -0.018, 0]}>
          <capsuleGeometry args={[0.013, 0.035, 8, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={SKIN_SHADOW} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
