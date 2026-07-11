"use client";

import { useEffect, useRef } from "react";
import { useThemeRgb } from "../hooks/use-theme-rgb";

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { primary, bg } = useThemeRgb();

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
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

    const draw = () => {
      ctx.fillStyle = `rgba(${bg.current}, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(${primary.current}, 0.3)`;
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
  }, [primary, bg]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
