"use client";

import type { TutorialStrings } from "@/i18n/types";
import { StepLayout } from "./step-layout";

interface Props {
  t: TutorialStrings;
}

export function StepDrag({ t }: Props) {
  return (
    <StepLayout command="hyprctl movewindow" title={t.dragTitle} body={t.dragBody}>
      <div className="flex items-center gap-2 text-faded text-xs">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
        {t.dragWaiting}
      </div>
    </StepLayout>
  );
}
