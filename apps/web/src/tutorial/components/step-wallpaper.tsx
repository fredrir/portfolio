"use client";

import type { TutorialStrings, UiStrings } from "@/i18n/types";
import { BackgroundPreview } from "@/panes/settings/components/background-preview";
import { BACKGROUND_PRESETS } from "@/window-manager/constants";
import type { BackgroundConfig } from "@/window-manager/types";
import { StepLayout } from "./step-layout";

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
    <StepLayout command="hyprpaper set" title={t.wallpaperTitle} body={t.wallpaperBody}>
      <div className="grid grid-cols-3 gap-2">
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              onSelectBackground(preset);
              onSelectWallpaper(preset.id);
            }}
            className={`flex flex-col items-center gap-1 rounded-md border p-1.5 text-xs transition-all ${
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
    </StepLayout>
  );
}
