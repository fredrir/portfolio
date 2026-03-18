"use client";

import { CompanyLogo } from "./components/company-logo";
import type { journeyType, UiStrings } from "@/shared/types";
import type { Journey } from "@/i18n/language-types";
import ListView from "@/shared/components/list-view";

interface Props {
  journey: Journey;
  onOpenDetail: (journey: journeyType) => void;
  ui: UiStrings;
}

export function JourneyPane({ journey, onOpenDetail, ui }: Props) {
  const sorted = [...journey.journeys].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return 0;
  });

  return (
    <ListView
      numberOfItems={journey.journeys.length}
      uiEntries={ui.entries}
      uiClickToOpen={ui.clickToOpen}
    >
      {sorted.map((j: journeyType) => (
        <button
          key={j.id}
          onClick={() => onOpenDetail(j)}
          className="w-full text-left flex items-center gap-2 @sm:gap-2.5 py-1 @sm:py-1.5 px-1.5 @sm:px-2 rounded-md hover:bg-control-hover transition-colors group"
        >
          <CompanyLogo journey={j} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold truncate text-2xs @sm:text-xs group-hover:underline">
                {j.jobTitle}
              </span>
            </div>
            <p className="mt-0.5">
              <span className="text-foreground/80 text-3xs @sm:text-2xs">
                {j.company}
              </span>
              <span className="text-ghost text-3xs @sm:text-2xs"> • </span>
              <span className="text-date-accent text-3xs @sm:text-2xs">
                {j.date}
              </span>
            </p>
          </div>

          {j.isCurrent && (
            <span className="text-primary-muted text-3xs @sm:text-2xs px-1 @sm:px-1.5 py-0.5 rounded bg-surface-soft shrink-0">
              {ui.active}
            </span>
          )}

          <span className="text-primary-hint group-hover:text-primary-muted transition-colors shrink-0">
            ↗
          </span>
        </button>
      ))}
    </ListView>
  );
}
