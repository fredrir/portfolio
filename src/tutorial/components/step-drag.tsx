"use client";

import { StepLayout } from "./step-layout";
import type { TutorialStrings } from "@/i18n/types";

interface Props {
  t: TutorialStrings;
}

export function StepDrag({ t }: Props) {
  return (
    <StepLayout command="hyprctl movewindow" title={t.dragTitle} body={t.dragBody}>
      <div className="flex items-center gap-2 text-xs text-faded">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        {t.dragWaiting}
      </div>
    </StepLayout>
  );
}
