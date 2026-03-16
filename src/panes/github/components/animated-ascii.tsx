"use client";

import { useRef, useEffect, useCallback } from "react";
import { GITHUB_ASCII } from "../constants";

const GLITCH_CHARS = "░▒▓█▀▄▌▐─│┤├┴┬┼╭╮╰╯";
const WAVE_COLORS = [
  "rgba(var(--color-primary), 0.15)",
  "rgba(var(--color-primary), 0.3)",
  "rgba(var(--color-primary), 0.5)",
  "rgba(var(--color-primary), 0.7)",
  "rgba(var(--color-primary), 0.9)",
  "rgba(var(--color-primary), 1)",
  "rgba(var(--color-primary), 0.9)",
  "rgba(var(--color-primary), 0.7)",
  "rgba(var(--color-primary), 0.5)",
  "rgba(var(--color-primary), 0.3)",
];

export function AnimatedAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const scaleRef = useRef(1);
  const glitchRef = useRef<
    { row: number; col: number; char: string; ttl: number }[]
  >([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const charW = 7.2 * dpr;
    const charH = 11 * dpr;
    const maxCols = Math.max(...GITHUB_ASCII.map((l) => l.length));
    const rows = GITHUB_ASCII.length;

    const w = Math.ceil(maxCols * charW);
    const h = Math.ceil(rows * charH);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w / dpr}px`;
      canvas.style.height = `${h / dpr}px`;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.font = `${11 * dpr}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
    ctx.textBaseline = "top";

    const frame = frameRef.current;
    const wavePos = (frame * 0.6) % (maxCols + WAVE_COLORS.length);

    if (Math.random() < 0.08) {
      const row = Math.floor(Math.random() * rows);
      const line = GITHUB_ASCII[row];
      const solidCols: number[] = [];
      for (let c = 0; c < line.length; c++) {
        if (line[c] !== " ") solidCols.push(c);
      }
      if (solidCols.length > 0) {
        const col = solidCols[Math.floor(Math.random() * solidCols.length)];
        glitchRef.current.push({
          row,
          col,
          char: GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
          ttl: 3 + Math.floor(Math.random() * 6),
        });
      }
    }

    const glitchMap = new Map<string, string>();
    glitchRef.current = glitchRef.current.filter((g) => {
      g.ttl--;
      if (g.ttl <= 0) return false;
      glitchMap.set(`${g.row},${g.col}`, g.char);
      return true;
    });

    const style = getComputedStyle(canvas);
    const primaryColor = style.color;

    for (let row = 0; row < rows; row++) {
      const line = GITHUB_ASCII[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (ch === " ") continue;

        const glitchChar = glitchMap.get(`${row},${col}`);
        const displayChar = glitchChar || ch;

        const dist = col - (wavePos - WAVE_COLORS.length);
        let alpha: number;
        if (dist >= 0 && dist < WAVE_COLORS.length) {
          const idx = Math.floor(dist);
          alpha = [0.15, 0.3, 0.5, 0.7, 0.9, 1, 0.9, 0.7, 0.5, 0.3][idx];
        } else {
          alpha = 0.35 + 0.1 * Math.sin(frame * 0.03 + row * 0.5 + col * 0.2);
        }

        if (glitchChar) {
          alpha = 0.9 + Math.random() * 0.1;
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = primaryColor;
        ctx.fillText(displayChar, col * charW, row * charH);
      }
    }

    ctx.globalAlpha = 1;
    frameRef.current++;
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const baseW = Math.ceil(
          Math.max(...GITHUB_ASCII.map((l) => l.length)) * 7.2,
        );
        const baseH = Math.ceil(GITHUB_ASCII.length * 11);
        const scaleW = width / baseW;
        const scaleH = height / baseH;
        scaleRef.current = Math.min(scaleW, scaleH, 1.5);
        if (canvasRef.current) {
          canvasRef.current.style.transform = `scale(${scaleRef.current})`;
        }
      }
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf: number;
    let lastTime = 0;
    const fps = 24;
    const interval = 1500 / fps;

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (time - lastTime < interval) return;
      lastTime = time;
      draw();
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  return (
    <div
      ref={wrapperRef}
      className="flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="text-primary origin-center"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
