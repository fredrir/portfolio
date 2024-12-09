import { useState, useEffect } from "react";

const randomLine = () => ({
  x1: Math.random() * 100,
  y1: Math.random() * 100,
  x2: Math.random() * 100,
  y2: Math.random() * 100,
  opacity: Math.random() * 0.5 + 0.1,
});

export const useAnimatedLines = (count: number) => {
  const [lines, setLines] = useState(() =>
    Array.from({ length: count }, randomLine)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prevLines) => prevLines.map(randomLine));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return lines;
};
