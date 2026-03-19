"use client";

import { StepLayout } from "./step-layout";
import type { TutorialStrings } from "@/shared/types";

interface Props {
  t: TutorialStrings;
}

export function StepLauncher({ t }: Props) {
  return (
    <StepLayout command="bind = SUPER, K, exec, walker" title={t.launcherTitle} body={t.launcherBody}>
      <div className="flex items-center gap-2 text-xs text-faded">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        {t.launcherWaiting}
      </div>
    </StepLayout>
  );
}
