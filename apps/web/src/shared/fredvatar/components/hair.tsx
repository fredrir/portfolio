"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { HAIR, sr } from "../constants";

export function Hair() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const curls = useMemo(() => {
    const result: { pos: THREE.Vector3; s: number }[] = [];

    for (let i = 0; i < 150; i++) {
      const theta = sr(i * 7 + 1) * Math.PI * 2;
      const phi = sr(i * 13 + 3) * Math.PI * 0.6;
      const r = 0.44 + sr(i * 17 + 5) * 0.14;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      if (z > 0.2 && y < 0.1 && Math.abs(x) < 0.3) continue;
      if (z > 0.35 && sr(i * 41 + 9) > 0.3) continue;

      result.push({
        pos: new THREE.Vector3(x, y, z),
        s: 0.045 + sr(i * 23 + 7) * 0.05,
      });
    }

    for (let i = 0; i < 30; i++) {
      const angle = sr(i * 11 + 100) * Math.PI * 2;
      const isSide = Math.abs(Math.cos(angle)) > 0.5;
      if (!isSide && Math.sin(angle) > 0) continue;
      const y = -0.08 + sr(i * 19 + 200) * 0.35;
      const rad = 0.46 + sr(i * 29 + 300) * 0.1;
      result.push({
        pos: new THREE.Vector3(Math.cos(angle) * rad, y, Math.sin(angle) * rad),
        s: 0.04 + sr(i * 31 + 400) * 0.04,
      });
    }

    for (let i = 0; i < 18; i++) {
      result.push({
        pos: new THREE.Vector3(
          -0.2 + sr(i * 37 + 500) * 0.4,
          0.28 + sr(i * 41 + 600) * 0.16,
          0.3 + sr(i * 43 + 700) * 0.12,
        ),
        s: 0.03 + sr(i * 47 + 800) * 0.035,
      });
    }

    return result;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const v = new THREE.Vector3();
    curls.forEach((curl, i) => {
      v.set(curl.s, curl.s, curl.s);
      m.compose(curl.pos, q, v);
      meshRef.current!.setMatrixAt(i, m);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [curls]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, curls.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color={HAIR} roughness={0.85} />
    </instancedMesh>
  );
}
