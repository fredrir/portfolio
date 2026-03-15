"use client";

import { useState, useEffect } from "react";
import { CAVA_CHARS, CAVA_BAR_COUNT } from "../constants";

export function CavaVisualizer() {
  const [bars, setBars] = useState<number[]>(Array(CAVA_BAR_COUNT).fill(2));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(
        Array(CAVA_BAR_COUNT)
          .fill(0)
          .map(() => Math.floor(Math.random() * 6) + 1),
      );
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end h-5 font-mono w-full">
      {bars.map((level, i) => (
        <span
          key={i}
          className="text-primary/60 flex-1 text-center"
          style={{ transition: "all 150ms ease" }}
        >
          {CAVA_CHARS[Math.min(level - 1, CAVA_CHARS.length - 1)]}
        </span>
      ))}
    </div>
  );
}
