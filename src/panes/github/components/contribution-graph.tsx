import {
  CONTRIBUTION_LEVEL_CHARS,
  CONTRIBUTION_LEVEL_COLORS,
  MS_PER_DAY,
} from "../constants";
import type { ContributionDay } from "@/shared/types";

export function ContributionGraph({
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

      <div className="w-full h-full overflow-y-hidden overflow-x-auto">
        <div className="flex w-full font-mono leading-none">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col flex-1 min-w-0">
              {week.map((day, di) => {
                const level = day?.level ?? 0;
                return (
                  <span
                    key={di}
                    className={`${CONTRIBUTION_LEVEL_COLORS[level]} text-3xs @lg:text-xs select-none text-center`}
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
