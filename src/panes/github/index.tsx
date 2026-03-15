"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatedAscii } from "./components/animated-ascii";
import { TypedLine } from "./components/typed-line";
import { BarChart } from "./components/bar-chart";
import { ContributionGraph } from "./components/contribution-graph";
import type { GitHubData } from "@/shared/types";

export function GitHubPane({
  initialData,
}: {
  initialData: GitHubData | null;
}) {
  const [selectedYear, setSelectedYear] = useState("last");
  const [compact, setCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCompact(entry.contentRect.height < 250 || entry.contentRect.width < 300);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = initialData;
  const currentContributions = data?.contributionsByYear.find(
    (c) => c.year === selectedYear,
  );
  const years = data?.contributionsByYear.map((c) => c.year) ?? [];
  const maxLangCount = data
    ? Math.max(...data.topLanguages.map((l) => l.count))
    : 1;

  return (
    <div className="h-full overflow-auto">
      <div className="p-2 @sm:p-3 font-mono text-xs leading-relaxed h-full overflow-hidden">
        <div ref={containerRef} className="h-full">
          {!compact && (
            <div className="text-muted-foreground/50 mb-2">
              <span className="text-primary">$</span> cat /proc/github
            </div>
          )}
          <div className={`flex flex-col ${compact ? "gap-2" : "gap-4"}`}>
            {!data ? (
              <span className="text-red-400">
                error: could not reach github api
              </span>
            ) : (
              <>
                <div className={`flex ${compact ? "gap-3" : "gap-4 @sm:gap-6"} flex-col @sm:flex-row`}>
                  <div className="shrink-0">
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
                    {!compact && (
                      <TypedLine delay={140}>
                        <span className="text-primary/30 text-2xs">
                          ─────────────────────
                        </span>
                      </TypedLine>
                    )}
                    <div className={`grid gap-x-4 gap-y-0.5 ${compact ? "grid-cols-3 @xs:grid-cols-5" : "grid-cols-2 @sm:grid-cols-1"}`}>
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
                    <div className={`w-full ${compact ? "" : "mt-2 pt-1 border-t border-primary/10"}`}>
                      <BarChart items={data.topLanguages} maxCount={maxLangCount} />
                    </div>
                  </TypedLine>
                )}
                {!compact && currentContributions && currentContributions.days.length > 0 && (
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
        </div>
      </div>
    </div>
  );
}
