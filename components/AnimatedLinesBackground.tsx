"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/hooks/UseTheme";
import { useAnimatedLines } from "@/lib/hooks/useAnimatedLines";
import { useAnimatedStars } from "@/lib/hooks/useAnimatedStars";

export const AnimatedBackground: React.FC = () => {
  const lines = useAnimatedLines(15);
  const stars = useAnimatedStars(30);
  const theme = useTheme();

  const isDark = theme.theme === "dark";
  const isNeon = theme.theme === "neon";
  const isForest = theme.theme === "forest";
  const isOcean = theme.theme === "ocean";

  const backgroundClasses: Record<string, string> = {
    light: "from-gray-100 to-gray-200",
    dark: "from-gray-900 to-black",
    neon: "from-neon-light to-neon-dark",
    forest: "from-forest-light to-forest-dark",
    ocean: "from-ocean-light to-ocean-dark",
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden transition-colors duration-500 bg-gradient-to-br ${
        backgroundClasses[theme.theme]
      }`}
    >
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
              stopColor={
                isDark || isNeon || isForest || isOcean ? "#fff" : "#000"
              }
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor={
                isDark || isNeon || isForest || isOcean ? "#fff" : "#000"
              }
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
            stroke={
              isDark
                ? "rgba(255, 255, 255, 0.3)"
                : isForest
                ? "rgba(46, 139, 87, 0.3)"
                : isOcean
                ? "rgba(30, 144, 255, 0.3)"
                : isNeon
                ? "rgba(0, 255, 0, 0.3)"
                : "rgba(0, 0, 0, 0.2)"
            }
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
      <div
        className={`absolute inset-0 ${
          isForest
            ? "bg-ambient-overlay"
            : isOcean
            ? "bg-orange-overlay"
            : isNeon
            ? "bg-neon-overlay" // Add overlay for neon
            : "bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-white/5"
        }`}
      />
    </div>
  );
};
