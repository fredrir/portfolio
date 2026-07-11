"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { AvatarModel } from "./components/avatar-model";
import { REACTIONS } from "./constants";

export function FredVatar({ ariaLabel }: { ariaLabel: string }) {
  const [reaction, setReaction] = useState<string>("idle");
  const [exprIdx, setExprIdx] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const clickCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const triggerReaction = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const i = clickCount.current % REACTIONS.length;
    clickCount.current++;
    setReaction(REACTIONS[i]);
    setExprIdx(i);
    timerRef.current = setTimeout(() => {
      setReaction("idle");
      setExprIdx(-1);
    }, 1200);
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      return setTimeout(() => {
        triggerReaction();
        intervalRef.current = scheduleNext();
      }, 10000);
    };
    const intervalRef = { current: scheduleNext() };
    return () => clearTimeout(intervalRef.current);
  }, [triggerReaction]);

  return (
    <div
      className="@sm:h-62.5 @xl:h-56.5 h-65 @sm:w-35 @xl:w-45 w-38 cursor-pointer"
      onClick={triggerReaction}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label={ariaLabel}
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
        <AvatarModel reaction={reaction} hovered={hovered} exprIdx={exprIdx} />
      </Canvas>
    </div>
  );
}
