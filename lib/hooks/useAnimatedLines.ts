import { useState, useEffect } from "react";
import { randomLine } from "../utils/randomLine";

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
