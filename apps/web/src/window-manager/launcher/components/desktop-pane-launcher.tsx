"use client";

import type { UiStrings } from "@/i18n/types";
import { PANE_CONFIGS } from "../../constants";
import type { WindowConfig, WindowStates } from "../../types";
import { PaneList } from "./pane-list";

interface Props {
  states: WindowStates;
  ui: UiStrings;
  onOpen: (id: string) => void;
}

export function DesktopPaneLauncher({ states, ui, onOpen }: Props) {
  const handleSelect = (config: WindowConfig) => {
    onOpen(config.id);
  };

  return (
    <div className="flex h-full min-h-0 items-center justify-center p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border-medium bg-glass-heavy font-mono shadow-2xl shadow-wm-shadow backdrop-blur-md">
        <div className="flex items-center justify-between border-wm-border border-b px-4 py-3">
          <span className="text-primary text-sm">walker</span>
          <span className="text-2xs text-ghost">
            {PANE_CONFIGS.length} {ui.apps}
          </span>
        </div>
        <div className="max-h-[min(32rem,calc(100vh-12rem))] overflow-y-auto">
          <PaneList configs={PANE_CONFIGS} states={states} ui={ui} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
}
