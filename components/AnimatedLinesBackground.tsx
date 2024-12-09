"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useAnimatedLines } from "@/lib/hooks/useAnimatedLines";
import { useTheme } from "@/lib/hooks/UseTheme";

const useAnimatedStars = (count: number) => {
  const [stars, setStars] = useState(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: Math.random() * 2 + 1,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          x: Math.random() * 100,
          y: Math.random() * 100,
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return stars;
};

export const AnimatedLinesBackground: React.FC = () => {
  const lines = useAnimatedLines(20);
  const stars = useAnimatedStars(50);
  const theme = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden transition-colors duration-500 dark:bg-gray-900 bg-gray-100">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lines.map((line, index) => (
          <motion.line
            key={`line-${index}`}
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
              opacity: [0, line.opacity, 0],
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            stroke={
              theme === "dark"
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(0, 0, 0, 0.2)"
            }
            strokeWidth="2"
            filter="url(#glow)"
          />
        ))}
        {stars.map((star, index) => (
          <motion.circle
            key={`star-${index}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.radius}
            fill={theme === "dark" ? "white" : "black"}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            filter="url(#glow)"
          />
        ))}
      </svg>
    </div>
  );
};
