"use client";

import type { TutorialStrings } from "@/i18n/types";
import { StepLayout } from "./step-layout";

interface Props {
  t: TutorialStrings;
}

export function StepResize({ t }: Props) {
  return (
    <StepLayout command="hyprctl resizewindow" title={t.resizeTitle} body={t.resizeBody}>
      <div className="flex items-center gap-2 text-faded text-xs">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
        {t.resizeWaiting}
      </div>
    </StepLayout>
  );
}
