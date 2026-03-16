import { useMemo } from "react";

type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
};

export const useAnimatedLines = (count: number): Line[] => {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.1,
      })),
    [count]
  );
};
