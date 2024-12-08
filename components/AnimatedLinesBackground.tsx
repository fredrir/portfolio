"use client";

import React from "react";
import { motion } from "framer-motion";

import { useAnimatedLines } from "@/lib/hooks/useAnimatedLines";
import { useTheme } from "@/lib/hooks/UseTheme";

export const AnimatedLinesBackground: React.FC = () => {
  const lines = useAnimatedLines(20);
  const theme = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden transition-colors duration-500 dark:bg-gray-900 bg-gray-100">
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((line, index) => (
          <motion.line
            key={index}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            initial={{ opacity: 0 }}
            animate={{
              x1: `${line.x1}%`,
              y1: `${line.y1}%`,
              x2: `${line.x2}%`,
              y2: `${line.y2}%`,
              opacity: line.opacity,
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
            }}
            stroke={
              theme === "dark"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.1)"
            }
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
};
