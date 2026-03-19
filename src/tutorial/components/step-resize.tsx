"use client";

import type { TutorialStrings } from "@/shared/types";

interface Props {
  t: TutorialStrings;
}

export function StepResize({ t }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">{t.resizeTitle}</h2>
      <p className="text-sm text-readable mb-3">{t.resizeBody}</p>
      <div className="flex items-center gap-2 text-xs text-faded">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        {t.resizeWaiting}
      </div>
    </div>
  );
}
