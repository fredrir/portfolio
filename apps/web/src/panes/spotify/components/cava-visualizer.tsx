"use client";

import { useEffect, useState } from "react";
import { CAVA_BAR_COUNT, CAVA_CHARS } from "../constants";

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
    <div className="flex h-5 w-full items-end font-mono">
      {bars.map((level, i) => (
        <span
          key={i}
          className="flex-1 text-center text-primary-soft"
          style={{ transition: "all 150ms ease" }}
        >
          {CAVA_CHARS[Math.min(level - 1, CAVA_CHARS.length - 1)]}
        </span>
      ))}
    </div>
  );
}
