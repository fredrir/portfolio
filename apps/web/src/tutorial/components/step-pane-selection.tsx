"use client";

import type { TutorialStrings, UiStrings } from "@/i18n/types";
import { WINDOW_CONFIGS } from "@/window-manager/constants";
import { StepLayout } from "./step-layout";

interface Props {
  t: TutorialStrings;
  ui: UiStrings;
  selectedPanes: string[];
  onTogglePane: (id: string) => void;
}

const selectableConfigs = WINDOW_CONFIGS.filter((c) => !c.isExternal);

export function StepPaneSelection({ t, ui, selectedPanes, onTogglePane }: Props) {
  return (
    <StepLayout command="hyprctl dispatch" title={t.paneSelectionTitle} body={t.paneSelectionBody}>
      <div className="grid grid-cols-3 gap-3">
        {selectableConfigs.map((config) => {
          const isSelected = selectedPanes.includes(config.id);
          return (
            <button
              key={config.id}
              onClick={() => onTogglePane(config.id)}
              className={`flex flex-col items-start gap-0.5 rounded-lg border p-2 text-left transition-all ${
                isSelected
                  ? "border-primary bg-control-active"
                  : "border-control-border hover:border-control-border-hover hover:bg-control-hover"
              }`}
            >
              <div className="flex items-center gap-1.5 md:mb-2">
                <span className={isSelected ? "text-primary" : "text-primary-soft"}>
                  {config.icon}
                </span>
                <span
                  className={`truncate font-medium text-xs md:text-sm ${isSelected ? "text-primary" : "text-primary-soft"}`}
                >
                  {ui.localeTitles[config.id]}
                </span>
              </div>
              <span className="line-clamp-2 text-faded text-xs">
                {t.paneDescriptions[config.id] ?? ""}
              </span>
            </button>
          );
        })}
      </div>
    </StepLayout>
  );
}
