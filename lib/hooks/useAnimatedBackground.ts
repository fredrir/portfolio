import { useState, useEffect } from "react";
import { randomPosition } from "../utils/randomPosition";

export const useAnimatedBackground = (count: number) => {
  const [particles, setParticles] = useState(() =>
    Array.from({ length: count }, () => ({
      ...randomPosition(),
      scale: Math.random() * 0.5 + 0.5,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...randomPosition(),
          scale: Math.random() * 0.5 + 0.5,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return particles;
};
