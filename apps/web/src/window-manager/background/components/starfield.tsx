"use client";

import { useEffect, useRef } from "react";
import { useThemeRgb } from "../hooks/use-theme-rgb";

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { primary } = useThemeRgb();

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

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.05,
      brightness: Math.random(),
      phase: Math.random() * Math.PI * 2,
    }));

    const connections: { a: number; b: number }[] = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 120) {
          connections.push({ a: i, b: j });
        }
      }
    }

    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      const t = frame * 0.01;
      const c = primary.current;

      connections.forEach(({ a, b }) => {
        const sa = stars[a];
        const sb = stars[b];
        const alpha = 0.03 + 0.02 * Math.sin(t + sa.phase);
        ctx.beginPath();
        ctx.moveTo(sa.x, sa.y);
        ctx.lineTo(sb.x, sb.y);
        ctx.strokeStyle = `rgba(${c}, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      stars.forEach((star) => {
        const twinkle = 0.3 + 0.7 * ((Math.sin(t * star.speed * 10 + star.phase) + 1) / 2);
        const alpha = star.brightness * twinkle * 0.6;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, ${alpha})`;
        ctx.fill();

        if (star.size > 1.2 && twinkle > 0.8) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c}, ${alpha * 0.15})`;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [primary]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
