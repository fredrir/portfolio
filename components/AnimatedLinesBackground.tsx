"use client";

import type React from "react";
import { useMemo } from "react";
import { useTheme } from "next-themes";

export const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  //Grid dots
  const dots = useMemo(() => {
    const cols = 24;
    const rows = 16;
    return Array.from({ length: cols * rows }, (_, i) => ({
      x: ((i % cols) / (cols - 1)) * 100,
      y: (Math.floor(i / cols) / (rows - 1)) * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 6,
    }));
  }, []);

  //Connection lines between random dot pairs
  const connections = useMemo(() => {
    const count = 12;
    return Array.from({ length: count }, () => {
      const x1 = Math.random() * 100;
      const y1 = Math.random() * 100;
      // Keep lines short-ish
      const angle = Math.random() * Math.PI * 2;
      const len = Math.random() * 15 + 5;
      return {
        x1,
        y1,
        x2: Math.min(100, Math.max(0, x1 + Math.cos(angle) * len)),
        y2: Math.min(100, Math.max(0, y1 + Math.sin(angle) * len)),
        duration: Math.random() * 6 + 8,
        delay: Math.random() * 6,
      };
    });
  }, []);

  const primary = isDark ? "74, 222, 128" : "22, 163, 74"; // green-400 / green-600

  return (
    <div className="fixed inset-0 overflow-hidden transition-colors duration-500 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0e1a] dark:via-[#0d1117] dark:to-[#090c14]">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="dot-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => (
          <circle
            key={`d-${i}`}
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r="0.8"
            fill={`rgba(${primary}, 0.15)`}
            style={{
              animation: `dotPulse ${dot.duration}s ${dot.delay}s infinite ease-in-out`,
            }}
          />
        ))}

        {connections.map((c, i) => (
          <line
            key={`c-${i}`}
            x1={`${c.x1}%`}
            y1={`${c.y1}%`}
            x2={`${c.x2}%`}
            y2={`${c.y2}%`}
            stroke={`rgba(${primary}, 0.08)`}
            strokeWidth="0.5"
            style={{
              animation: `lineFade ${c.duration}s ${c.delay}s infinite ease-in-out`,
            }}
          />
        ))}
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <style jsx>{`
        @keyframes dotPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes lineFade {
          0%,
          100% {
            opacity: 0;
            stroke-dasharray: 0 200%;
          }
          30%,
          70% {
            opacity: 1;
            stroke-dasharray: 200% 0;
          }
        }

        @keyframes scanMove {
          0% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};
