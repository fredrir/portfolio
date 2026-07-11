"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { AvatarModel } from "@/shared/fredvatar/components/avatar-model";
import { cn } from "@/shared/utils/cn";

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
      className={cn("h-50 w-20 shrink-0 md:h-60 md:w-40", className)}
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
        <directionalLight position={[-2, 2, 3]} intensity={0.3} color="#b0c4de" />
        <pointLight position={[0, 1, -2]} intensity={0.4} color="#8EC8E8" />
        <AvatarModel reaction={reaction} hovered={hovered} exprIdx={-1} />
      </Canvas>
    </div>
  );
}
