import { useMemo } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
};

export const useAnimatedStars = (count: number): Star[] => {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        radius: Math.random() * 3 + 1,
      })),
    [count]
  );
};
