"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TerminalPane } from "./TerminalPane";
import { TypedLine } from "./TypedLine";
import {
  GITHUB_ASCII,
  LANG_ICONS,
  CONTRIBUTION_LEVEL_CHARS,
  CONTRIBUTION_LEVEL_COLORS,
  MS_PER_DAY,
} from "./constants";
import type { GitHubData, ContributionDay } from "./types";

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

function AnimatedAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
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
    let raf: number;
    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

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
    <canvas
      ref={canvasRef}
      className="text-primary"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function LangIcon({ lang }: { lang: string }) {
  const info = LANG_ICONS[lang];
  if (!info) {
    return (
      <span className="text-muted-foreground font-bold text-2xs w-4 inline-block">
        {lang.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <span className={`${info.color} font-bold text-2xs w-4 inline-block`}>
      {info.icon}
    </span>
  );
}

function BarChart({
  items,
  maxCount,
}: {
  items: { lang: string; count: number }[];
  maxCount: number;
}) {
  return (
    <div className="space-y-0.5 mt-1 w-full">
      {items.map(({ lang, count }) => {
        const pct = Math.max(5, Math.round((count / maxCount) * 100));
        return (
          <div key={lang} className="flex items-center gap-2 w-full">
            <LangIcon lang={lang} />
            <span className="text-muted-foreground w-14 @xs:w-20 shrink-0 truncate">
              {lang}
            </span>
            <div className="flex-1 h-3 bg-primary/5 rounded-sm overflow-hidden">
              <div
                className="h-full bg-primary/40 rounded-sm transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-muted-foreground/60 shrink-0 w-6 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ContributionGraph({
  contributions,
  total,
  selectedYear,
  years,
  onYearChange,
  lastYearLabel = "Last year",
}: {
  contributions: ContributionDay[];
  total: number;
  selectedYear: string;
  years: string[];
  onYearChange: (year: string) => void;
  lastYearLabel?: string;
}) {
  const numWeeks = Math.ceil(contributions.length / 7);
  const weeks: (ContributionDay | null)[][] = Array.from(
    { length: numWeeks },
    () => Array(7).fill(null),
  );

  contributions.forEach((day) => {
    const dow = new Date(day.date + "T00:00:00").getDay();
    const daysSinceStart = Math.floor(
      (new Date(day.date + "T00:00:00").getTime() -
        new Date(contributions[0].date + "T00:00:00").getTime()) /
        MS_PER_DAY,
    );
    const weekIdx = Math.floor(daysSinceStart / 7);
    if (weekIdx >= 0 && weekIdx < numWeeks) {
      weeks[weekIdx][dow] = day;
    }
  });

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-primary font-semibold text-2xs">
          {total.toLocaleString()} contributions
        </span>
        <div className="flex gap-1 flex-wrap justify-end">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              className={`text-2xs px-1.5 py-0.5 rounded transition-colors ${
                selectedYear === y
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground/40 hover:text-muted-foreground/70"
              }`}
            >
              {y === "last" ? lastYearLabel : y}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex w-full font-mono leading-none">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col flex-1 min-w-0">
              {week.map((day, di) => {
                const level = day?.level ?? 0;
                return (
                  <span
                    key={di}
                    className={`${CONTRIBUTION_LEVEL_COLORS[level]} text-3xs select-none text-center`}
                    title={
                      day
                        ? `${day.count} contributions on ${day.date}`
                        : undefined
                    }
                  >
                    {CONTRIBUTION_LEVEL_CHARS[level]}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GitHubPane({
  initialData,
  bare = false,
}: {
  initialData: GitHubData | null;
  bare?: boolean;
}) {
  const [selectedYear, setSelectedYear] = useState("last");

  const data = initialData;
  const currentContributions = data?.contributionsByYear.find(
    (c) => c.year === selectedYear,
  );
  const years = data?.contributionsByYear.map((c) => c.year) ?? [];
  const maxLangCount = data
    ? Math.max(...data.topLanguages.map((l) => l.count))
    : 1;

  return (
    <TerminalPane title="cat /proc/github" bare={bare}>
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> cat /proc/github
      </div>
      <div className="flex flex-col gap-4">
        {!data ? (
          <span className="text-red-400">
            error: could not reach github api
          </span>
        ) : (
          <>
            <div className="flex gap-4 @sm:gap-6 flex-col @sm:flex-row">
              <div className="shrink-0 hidden @md:block">
                <AnimatedAscii />
              </div>

              <div className="min-w-0 space-y-0.5 flex-1">
                <TypedLine delay={80}>
                  <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold hover:underline"
                  >
                    {data.username}@github
                  </a>
                </TypedLine>
                <TypedLine delay={140}>
                  <span className="text-primary/30 text-2xs">
                    ─────────────────────
                  </span>
                </TypedLine>
                <div className="grid grid-cols-2 @sm:grid-cols-1 gap-x-4 gap-y-0.5">
                  <TypedLine delay={200}>
                    <span className="text-primary font-semibold">Repos</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {data.publicRepos}
                    </span>
                  </TypedLine>
                  <TypedLine delay={260}>
                    <span className="text-primary font-semibold">Stars</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {data.totalStars}
                    </span>
                  </TypedLine>
                  <TypedLine delay={320}>
                    <span className="text-primary font-semibold">Followers</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {data.followers}
                    </span>
                  </TypedLine>
                  <TypedLine delay={380}>
                    <span className="text-primary font-semibold">Following</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {data.following}
                    </span>
                  </TypedLine>
                  <TypedLine delay={440}>
                    <span className="text-primary font-semibold">Since</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {new Date(data.createdAt).getFullYear()}
                    </span>
                  </TypedLine>
                </div>
              </div>
            </div>
            {data.topLanguages.length > 0 && (
              <TypedLine delay={500} className="w-full">
                <div className="mt-2 pt-1 w-full border-t border-primary/10">
                  <BarChart items={data.topLanguages} maxCount={maxLangCount} />
                </div>
              </TypedLine>
            )}
            {currentContributions && currentContributions.days.length > 0 && (
              <TypedLine delay={600} className="w-full">
                <div className="mt-2 pt-2 w-full border-t border-primary/10">
                  <ContributionGraph
                    contributions={currentContributions.days}
                    total={currentContributions.total}
                    selectedYear={selectedYear}
                    years={years}
                    onYearChange={setSelectedYear}
                  />
                </div>
              </TypedLine>
            )}
          </>
        )}
      </div>
    </TerminalPane>
  );
}
