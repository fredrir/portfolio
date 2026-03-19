"use client";

import { BACKGROUND_PRESETS } from "@/window-manager/constants";
import { BackgroundPreview } from "@/panes/settings/components/background-preview";
import type { BackgroundConfig } from "@/window-manager/types";
import type { TutorialStrings } from "@/shared/types";
import type { UiStrings } from "@/shared/types";

interface Props {
  t: TutorialStrings;
  ui: UiStrings;
  currentBackground: BackgroundConfig;
  onSelectBackground: (config: BackgroundConfig) => void;
  onSelectWallpaper: (id: string) => void;
}

export function StepWallpaper({
  t,
  ui,
  currentBackground,
  onSelectBackground,
  onSelectWallpaper,
}: Props) {
  return (
    <div>
      <h2 className="text-lg font-bold text-primary mb-1">{t.wallpaperTitle}</h2>
      <p className="text-sm text-readable mb-4">{t.wallpaperBody}</p>
      <div className="grid grid-cols-3 gap-2">
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              onSelectBackground(preset);
              onSelectWallpaper(preset.id);
            }}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-md border text-xs transition-all ${
              currentBackground.id === preset.id
                ? "border-primary bg-control-active text-primary"
                : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
            }`}
          >
            <BackgroundPreview config={preset} />
            <span>{ui.backgrounds[preset.id] ?? preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
