"use client";

import { useState } from "react";
import type { UiStrings } from "@/i18n/types";
import { useContainerSize } from "@/shared/hooks/use-container-size";
import type { GitHubData } from "@/shared/types";
import { AnimatedAscii } from "./components/animated-ascii";
import { BarChart } from "./components/bar-chart";
import { ContributionGraph } from "./components/contribution-graph";
import { TypedLine } from "./components/typed-line";

export function GitHubPane({ initialData, ui }: { initialData: GitHubData | null; ui: UiStrings }) {
  const [selectedYear, setSelectedYear] = useState("last");
  const { ref: containerRef, width, height } = useContainerSize();
  const compact = height > 0 && (height < 250 || width < 300);

  const data = initialData;
  const currentContributions = data?.contributionsByYear.find((c) => c.year === selectedYear);
  const years = data?.contributionsByYear.map((c) => c.year) ?? [];
  const maxLangCount = data ? Math.max(...data.topLanguages.map((l) => l.count)) : 1;

  return (
    <div className="h-full overflow-y-auto @sm:p-3 p-2 leading-relaxed">
      <div ref={containerRef} className="h-full">
        <div className={`flex flex-col ${compact ? "gap-2" : "gap-4"}`}>
          {!data ? (
            <span className="text-red-400">{ui.githubApiError}</span>
          ) : (
            <>
              <div
                className={`flex ${compact ? "gap-3" : "@sm:gap-6 gap-4"} @sm:flex-row flex-col`}
              >
                <div className="shrink-0">
                  <AnimatedAscii />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <TypedLine delay={80}>
                    <a
                      href={data.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary hover:underline"
                    >
                      {data.username}@github
                    </a>
                  </TypedLine>
                  {!compact && (
                    <TypedLine delay={140}>
                      <span className="text-primary-subtle text-xs">─────────────────────</span>
                    </TypedLine>
                  )}
                  <div
                    className={`grid gap-x-4 gap-y-0.5 ${compact ? "@xs:grid-cols-5 grid-cols-3" : "@sm:grid-cols-1 grid-cols-2"}`}
                  >
                    <TypedLine delay={200}>
                      <span className="font-semibold text-primary">{ui.githubRepos}</span>
                      <span className="text-muted-foreground"> {data.publicRepos}</span>
                    </TypedLine>
                    <TypedLine delay={260}>
                      <span className="font-semibold text-primary">{ui.githubStars}</span>
                      <span className="text-muted-foreground"> {data.totalStars}</span>
                    </TypedLine>
                    <TypedLine delay={320}>
                      <span className="font-semibold text-primary">{ui.githubFollowers}</span>
                      <span className="text-muted-foreground"> {data.followers}</span>
                    </TypedLine>
                    <TypedLine delay={380}>
                      <span className="font-semibold text-primary">{ui.githubFollowing}</span>
                      <span className="text-muted-foreground"> {data.following}</span>
                    </TypedLine>
                    <TypedLine delay={440}>
                      <span className="font-semibold text-primary">{ui.githubSince}</span>
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
                  <div
                    className={`w-full ${compact ? "" : "mt-2 border-border-faint border-t pt-1"}`}
                  >
                    <BarChart items={data.topLanguages} maxCount={maxLangCount} />
                  </div>
                </TypedLine>
              )}
              {!compact && currentContributions && currentContributions.days.length > 0 && (
                <TypedLine delay={600} className="w-full">
                  <div className="mt-2 w-full border-border-faint border-t pt-2">
                    <ContributionGraph
                      contributions={currentContributions.days}
                      total={currentContributions.total}
                      selectedYear={selectedYear}
                      years={years}
                      onYearChange={setSelectedYear}
                      lastYearLabel={ui.lastYear}
                      contributionsLabel={ui.githubContributions}
                    />
                  </div>
                </TypedLine>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
