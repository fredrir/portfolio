"use client";

import type React from "react";
import { useMemo } from "react";
import { useTheme } from "next-themes";

export const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const lines = useMemo(() => {
    const lineCount = 10;
    return Array.from({ length: lineCount }, () => ({
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 5,
    }));
  }, []);

  const stars = useMemo(() => {
    const starCount = 20;
    return Array.from({ length: starCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
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
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lines.map((line, index) => (
          <line
            key={`line-${index}`}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"}
            strokeWidth="1.5"
            opacity="0"
            className="animate-pulse"
            style={{
              animation: `lineAnimation ${line.duration}s ${line.delay}s infinite alternate ease-in-out`,
            }}
          />
        ))}
        {stars.map((star, index) => (
          <circle
            key={`star-${index}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.radius}
            fill="url(#star-gradient)"
            opacity="0"
            className="animate-pulse"
            style={{
              animation: `starAnimation 5s ${star.delay}s infinite alternate ease-in-out`,
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-white/5" />

      <style jsx>{`
        @keyframes lineAnimation {
          0% {
            opacity: 0;
            stroke-dasharray: 0 100%;
          }
          50% {
            opacity: 0.5;
            stroke-dasharray: 100% 0;
          }
          100% {
            opacity: 0;
            stroke-dasharray: 0 100%;
          }
        }

        @keyframes starAnimation {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }
      `}</style>
    </div>
  );
};
