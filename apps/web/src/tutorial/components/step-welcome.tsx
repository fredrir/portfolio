"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { languages } from "@/panes/settings/constants";
import { StepLayout } from "./step-layout";
import type { TutorialStrings } from "@/i18n/types";

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
    <StepLayout command="locale-gen" title={t.welcomeTitle} body={t.welcomeBody}>
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
    </StepLayout>
  );
}
