"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { cn } from "@/shared/utils/cn";
import { AvatarModel } from "@/shared/fredvatar/components/avatar-model";

export function TutorialFredVatar({
  reaction,
  className,
}: {
  reaction: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn("w-20 h-50 md:w-40 md:h-60 shrink-0", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={0.7} />
        <directionalLight
          position={[-2, 2, 3]}
          intensity={0.3}
          color="#b0c4de"
        />
        <pointLight position={[0, 1, -2]} intensity={0.4} color="#8EC8E8" />
        <AvatarModel reaction={reaction} hovered={hovered} exprIdx={-1} />
      </Canvas>
    </div>
  );
}
