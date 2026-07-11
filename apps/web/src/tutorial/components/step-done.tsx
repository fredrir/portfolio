"use client";

import type { TutorialStrings } from "@/i18n/types";

interface Props {
  t: TutorialStrings;
  onComplete: () => void;
}

export function StepDone({ t, onComplete }: Props) {
  return (
    <div>
      <h2 className="mb-1 font-bold text-lg text-primary">{t.doneTitle}</h2>
      <p className="mb-4 text-readable text-sm">{t.doneBody}</p>
      <button
        onClick={onComplete}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-opacity hover:opacity-90"
      >
        {t.startExploring}
      </button>
    </div>
  );
}
