"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { languages } from "@/panes/settings/constants";
import type { TutorialStrings } from "@/shared/types";

interface Props {
  t: TutorialStrings;
  currentLocale: string;
  onSelectLocale: (locale: string) => void;
  onSaveState: (nextStep: number) => void;
}

export function StepWelcome({
  t,
  currentLocale,
  onSelectLocale,
  onSaveState,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">{t.welcomeTitle}</h2>
      <p className="text-sm text-readable mb-4">{t.welcomeBody}</p>
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang) => {
          const isActive = lang.code === currentLocale;
          return (
            <button
              key={lang.code}
              onClick={() => {
                if (lang.code !== currentLocale) {
                  onSelectLocale(lang.code);
                  onSaveState(0);
                  startTransition(() => {
                    router.replace(`/${lang.code}`);
                  });
                }
              }}
              className={`flex flex-col xs:flex-row items-center gap-2 px-3 py-2 rounded-lg border text-xs sm:text-sm transition-all ${
                isActive
                  ? "border-primary bg-control-active text-primary"
                  : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
              }`}
            >
              <span className="text-base sm:text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
