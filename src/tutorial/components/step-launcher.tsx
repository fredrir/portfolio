"use client";

import type { TutorialStrings } from "@/shared/types";

interface Props {
  t: TutorialStrings;
}

export function StepLauncher({ t }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">{t.launcherTitle}</h2>
      <p className="text-sm text-readable mb-3">{t.launcherBody}</p>
      <div className="flex items-center gap-2 text-xs text-faded">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        {t.launcherWaiting}
      </div>
    </div>
  );
}
