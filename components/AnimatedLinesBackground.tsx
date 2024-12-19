"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/hooks/UseTheme";

type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
};

type Star = {
  x: number;
  y: number;
  radius: number;
};

export const AnimatedBackground: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === "dark";

  const [lines, setLines] = useState<Line[]>([]);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateLines = () => {
      const lineCount = 15;
      const newLines: Line[] = Array.from({ length: lineCount }, () => ({
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.1,
      }));
      setLines(newLines);
    };

    const generateStars = () => {
      const starCount = 30;
      const newStars: Star[] = Array.from({ length: starCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        radius: Math.random() * 3 + 1,
      }));
      setStars(newStars);
    };

    generateLines();
    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden transition-colors duration-500 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient
            id="star-gradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop
              offset="0%"
              stopColor={isDark ? "#fff" : "#000"}
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor={isDark ? "#fff" : "#000"}
              stopOpacity="0"
            />
          </radialGradient>
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
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{
              opacity: [0, line.opacity, 0],
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"
            filter="url(#glow)"
          />
        ))}
        {stars.map((star, index) => (
          <motion.circle
            key={`star-${index}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.radius}
            fill="url(#star-gradient)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
            filter="url(#glow)"
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-white/5" />
    </div>
  );
};
