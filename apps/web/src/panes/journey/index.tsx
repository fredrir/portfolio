"use client";

import type { Journey, UiStrings } from "@/i18n/types";
import ListItem from "@/shared/components/list-item";
import ListView from "@/shared/components/list-view";
import type { journeyType } from "@/shared/types";
import { CompanyLogo } from "./components/company-logo";

interface Props {
  journey: Journey;
  onOpenDetail: (journey: journeyType) => void;
  ui: UiStrings;
}

function JourneySubtitle({ j }: { j: journeyType }) {
  return (
    <p>
      <span className="@sm:text-2xs text-3xs text-foreground/80">{j.company}</span>
      <span className="@sm:text-2xs text-3xs text-ghost"> • </span>
      <span className="@sm:text-2xs text-3xs text-date-accent">{j.date}</span>
    </p>
  );
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
        <ListItem
          key={j.id}
          visual={{ custom: <CompanyLogo journey={j} /> }}
          title={j.jobTitle}
          subtitle={<JourneySubtitle j={j} />}
          onClick={() => onOpenDetail(j)}
          badge={
            j.isCurrent ? (
              <span className="shrink-0 rounded bg-surface-soft @sm:px-1.5 px-1 py-0.5 @sm:text-2xs text-3xs text-primary-muted">
                {ui.active}
              </span>
            ) : undefined
          }
        />
      ))}
    </ListView>
  );
}
