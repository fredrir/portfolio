"use client";

import { useTheme } from "next-themes";
import type { TutorialStrings } from "@/i18n/types";
import { THEMES } from "@/lib/themes";
import { ThemeSwatch } from "@/panes/settings/components/theme-swatch";
import { StepLayout } from "./step-layout";

interface Props {
  t: TutorialStrings;
  onSelectTheme: (id: string) => void;
}

export function StepTheme({ t, onSelectTheme }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <StepLayout command="hyprctl colorscheme" title={t.themeTitle} body={t.themeBody}>
      <div className="grid grid-cols-3 gap-1.5">
        {THEMES.map((th) => (
          <button
            key={th.id}
            onClick={() => {
              setTheme(th.id);
              onSelectTheme(th.id);
            }}
            className={`flex items-center gap-1.5 rounded-md border px-2 py-2 text-xs transition-all md:py-4 ${
              theme === th.id
                ? "border-primary bg-control-active text-primary"
                : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
            }`}
          >
            <ThemeSwatch colors={th.colors} />
            <span className="truncate">{th.name}</span>
          </button>
        ))}
      </div>
    </StepLayout>
  );
}
