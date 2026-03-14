"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import type { BackgroundConfig } from "./types";

function AnimatedDotsBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const primary = isDark ? "74, 222, 128" : "22, 163, 74";

  const [dots] = useState(() =>
    Array.from({ length: 24 * 16 }, (_, i) => ({
      x: ((i % 24) / 23) * 100,
      y: (Math.floor(i / 24) / 15) * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 6,
    })),
  );

  const [connections] = useState(() =>
    Array.from({ length: 12 }, () => {
      const x1 = Math.random() * 100;
      const y1 = Math.random() * 100;
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
    }),
  );

  return (
    <>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r="0.8"
            fill={`rgba(${primary}, 0.15)`}
            className="animate-dot-pulse"
            style={{
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
            }}
          />
        ))}
        {connections.map((c, i) => (
          <line
            key={i}
            x1={`${c.x1}%`}
            y1={`${c.y1}%`}
            x2={`${c.x2}%`}
            y2={`${c.y2}%`}
            stroke={`rgba(${primary}, 0.08)`}
            strokeWidth="0.5"
            className="animate-line-fade"
            style={{
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
    </>
  );
}

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = new Array(cols).fill(1);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

    const draw = () => {
      ctx.fillStyle = "rgba(10, 14, 26, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(74, 222, 128, 0.3)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function GridBackground() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.03)_1px,transparent_1px)] [background-size:40px_40px]" />
  );
}

interface Props {
  config: BackgroundConfig;
}

export function Background({ config }: Props) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0e1a] dark:via-[#0d1117] dark:to-[#090c14] transition-colors duration-500">
      {config.type === "animated-dots" && <AnimatedDotsBackground />}
      {config.type === "matrix" && <MatrixBackground />}
      {config.type === "grid" && <GridBackground />}
      {config.type === "gradient" && config.value && (
        <div className="absolute inset-0" style={{ background: config.value }} />
      )}
      {config.type === "custom-image" && config.value && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${config.value})` }}
        />
      )}
      {config.type === "plain" && null}
    </div>
  );
}
