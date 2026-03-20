"use client";

import type { TutorialStrings } from "@/shared/types";

interface Props {
  t: TutorialStrings;
  onComplete: () => void;
}

export function StepDone({ t, onComplete }: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">{t.doneTitle}</h2>
      <p className="text-sm text-readable mb-4">{t.doneBody}</p>
      <button
        onClick={onComplete}
        className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
      >
        {t.startExploring}
      </button>
    </div>
  );
}
