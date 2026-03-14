"use client";

import { useState, useEffect } from "react";
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
            <span className="text-muted-foreground w-20 shrink-0 truncate">
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
}: {
  contributions: ContributionDay[];
  total: number;
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
      <div className="flex items-center justify-between">
        <span className="text-primary font-semibold text-2xs">
          {total.toLocaleString()} contributions
        </span>
        <span className="text-muted-foreground/40 text-2xs">last year</span>
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

export function GitHubPane() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxLangCount = data
    ? Math.max(...data.topLanguages.map((l) => l.count))
    : 1;

  return (
    <TerminalPane title="cat /proc/github">
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> cat /proc/github
      </div>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="space-y-1">
            <span className="text-muted-foreground animate-pulse">
              Fetching from api.github.com...
            </span>
          </div>
        ) : !data ? (
          <span className="text-red-400">
            error: could not reach github api
          </span>
        ) : (
          <>
            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="shrink-0 hidden sm:block">
                {GITHUB_ASCII.map((line, i) => (
                  <TypedLine key={i} delay={i * 60}>
                    <span className="text-primary/70 whitespace-pre text-2xs leading-tight">
                      {line}
                    </span>
                  </TypedLine>
                ))}
              </div>

              <div className="min-w-0 space-y-0.5">
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
            {data.topLanguages.length > 0 && (
              <TypedLine delay={500} className="w-full">
                <div className="mt-2 pt-1 w-full border-t border-primary/10">
                  <BarChart items={data.topLanguages} maxCount={maxLangCount} />
                </div>
              </TypedLine>
            )}
            {data.contributions.length > 0 && (
              <TypedLine delay={600} className="w-full">
                <div className="mt-2 pt-2 w-full border-t border-primary/10">
                  <ContributionGraph
                    contributions={data.contributions}
                    total={data.totalContributions}
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
