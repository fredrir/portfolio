"use client";

import { StepLayout } from "./step-layout";
import type { TutorialStrings } from "@/shared/types";

interface Props {
  t: TutorialStrings;
}

export function StepResize({ t }: Props) {
  return (
    <StepLayout command="hyprctl resizewindow" title={t.resizeTitle} body={t.resizeBody}>
      <div className="flex items-center gap-2 text-xs text-faded">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        {t.resizeWaiting}
      </div>
    </StepLayout>
  );
}
