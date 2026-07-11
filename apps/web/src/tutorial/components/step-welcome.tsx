"use client";

import { useRouter } from "@tanstack/react-router";
import { useTransition } from "react";
import type { TutorialStrings } from "@/i18n/types";
import { languages } from "@/panes/settings/constants";
import { StepLayout } from "./step-layout";

interface Props {
  t: TutorialStrings;
  currentLocale: string;
  onSelectLocale: (locale: string) => void;
  onSaveState: (nextStep: number) => void;
}

export function StepWelcome({ t, currentLocale, onSelectLocale, onSaveState }: Props) {
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
                    router.navigate({
                      to: "/$locale",
                      params: { locale: lang.code },
                      replace: true,
                    });
                  });
                }
              }}
              className={`flex xs:flex-row flex-col items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all sm:text-sm ${
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
