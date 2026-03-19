"use client";

import { useTheme } from "next-themes";
import { THEMES } from "@/lib/themes";
import { ThemeSwatch } from "@/panes/settings/components/theme-swatch";
import type { TutorialStrings } from "@/shared/types";

interface Props {
  t: TutorialStrings;
  onSelectTheme: (id: string) => void;
}

export function StepTheme({ t, onSelectTheme }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">{t.themeTitle}</h2>
      <p className="text-sm text-readable mb-4">{t.themeBody}</p>
      <div className="grid grid-cols-3 gap-1.5">
        {THEMES.map((th) => (
          <button
            key={th.id}
            onClick={() => {
              setTheme(th.id);
              onSelectTheme(th.id);
            }}
            className={`flex items-center gap-1.5 px-2 py-2 md:py-4 rounded-md border text-xs transition-all ${
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
    </div>
  );
}
