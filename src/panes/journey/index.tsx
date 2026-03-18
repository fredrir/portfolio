"use client";

import { CompanyLogo } from "./components/company-logo";
import type { journeyType, UiStrings } from "@/shared/types";
import type { Journey } from "@/i18n/language-types";
import ListView from "@/shared/components/list-view";
import ListItem from "@/shared/components/list-item";

interface Props {
  journey: Journey;
  onOpenDetail: (journey: journeyType) => void;
  ui: UiStrings;
}

function JourneySubtitle({ j }: { j: journeyType }) {
  return (
    <p>
      <span className="text-foreground/80 text-3xs @sm:text-2xs">
        {j.company}
      </span>
      <span className="text-ghost text-3xs @sm:text-2xs"> • </span>
      <span className="text-date-accent text-3xs @sm:text-2xs">{j.date}</span>
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
              <span className="text-primary-muted text-3xs @sm:text-2xs px-1 @sm:px-1.5 py-0.5 rounded bg-surface-soft shrink-0">
                {ui.active}
              </span>
            ) : undefined
          }
        />
      ))}
    </ListView>
  );
}
