import type { ContributionDay } from "@/shared/types";
import { CONTRIBUTION_LEVEL_CHARS, CONTRIBUTION_LEVEL_COLORS, MS_PER_DAY } from "../constants";

export function ContributionGraph({
  contributions,
  total,
  selectedYear,
  years,
  onYearChange,
  lastYearLabel = "Last year",
  contributionsLabel = "contributions",
}: {
  contributions: ContributionDay[];
  total: number;
  selectedYear: string;
  years: string[];
  onYearChange: (year: string) => void;
  lastYearLabel?: string;
  contributionsLabel?: string;
}) {
  const weeks: (ContributionDay | null)[][] = Array.from({ length: 53 }, () => Array(7).fill(null));

  contributions.forEach((day) => {
    const dow = new Date(day.date + "T00:00:00").getDay();
    const daysSinceStart = Math.floor(
      (new Date(day.date + "T00:00:00").getTime() -
        new Date(contributions[0].date + "T00:00:00").getTime()) /
        MS_PER_DAY,
    );
    const weekIdx = Math.floor(daysSinceStart / 7);
    if (weekIdx >= 0 && weekIdx < 53) {
      weeks[weekIdx][dow] = day;
    }
  });

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-2xs text-primary">
          {total.toLocaleString()} {contributionsLabel}
        </span>
        <div className="flex flex-wrap justify-end gap-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              className={`rounded px-1.5 py-0.5 text-2xs transition-colors ${
                selectedYear === y
                  ? "bg-surface-selected text-primary"
                  : "text-subtle hover:text-muted-hover"
              }`}
            >
              {y === "last" ? lastYearLabel : y}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto overflow-y-hidden">
        <div
          className="grid w-full font-mono leading-none"
          style={{ gridTemplateColumns: "repeat(53, 1fr)" }}
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col">
              {week.map((day, di) => {
                const level = day?.level ?? 0;
                return (
                  <span
                    key={di}
                    className={`${CONTRIBUTION_LEVEL_COLORS[level]} select-none text-center @lg:text-xs text-3xs`}
                    title={day ? `${day.count} ${contributionsLabel} on ${day.date}` : undefined}
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
