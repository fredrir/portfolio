"use client";

import type { TutorialStrings } from "@/i18n/types";
import { StepLayout } from "./step-layout";

interface Props {
  t: TutorialStrings;
}

export function StepLauncher({ t }: Props) {
  return (
    <StepLayout
      command="bind = SUPER, K, exec, walker"
      title={t.launcherTitle}
      body={t.launcherBody}
    >
      <div className="flex items-center gap-2 text-faded text-xs">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
        {t.launcherWaiting}
      </div>
    </StepLayout>
  );
}
