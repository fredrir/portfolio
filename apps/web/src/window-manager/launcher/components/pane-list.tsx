"use client";

import { ArrowSquareOut } from "@phosphor-icons/react";
import type { UiStrings } from "@/i18n/types";
import { cn } from "@/shared/utils/cn";
import type { WindowConfig, WindowStates } from "../../types";

interface Props {
  configs: WindowConfig[];
  states: WindowStates;
  ui: UiStrings;
  selectedIdx?: number;
  showActions?: boolean;
  emptyMessage?: string;
  onSelect: (config: WindowConfig) => void;
  onStop?: (id: string) => void;
  onHover?: (index: number) => void;
}

export function PaneList({
  configs,
  states,
  ui,
  selectedIdx = -1,
  showActions = true,
  emptyMessage = ui.noMatching,
  onSelect,
  onStop,
  onHover,
}: Props) {
  if (configs.length === 0) {
    return <div className="px-4 py-6 text-center text-sm text-subtle">{emptyMessage}</div>;
  }

  return (
    <>
      {configs.map((config, i) => {
        const isOpen = states[config.id]?.isOpen === true;
        const isSelected = i === selectedIdx;

        return (
          <div
            key={config.id}
            onMouseEnter={() => onHover?.(i)}
            className={cn(
              "group flex w-full items-center justify-between px-4 py-2.5 transition-colors",
              isSelected ? "bg-control-active" : "hover:bg-control-hover",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(config)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="w-5 shrink-0 text-center text-primary-soft text-sm">
                {config.icon}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block truncate text-sm transition-colors",
                    isSelected ? "text-primary" : "text-foreground",
                  )}
                >
                  {config.title}
                </span>
                <span className="block truncate text-2xs text-ghost">
                  {ui.shortTitles[config.id] ?? config.id}
                </span>
              </span>
            </button>

            {config.isExternal ? (
              <span className="ml-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-launcher-bg text-primary">
                <ArrowSquareOut size={13} weight="bold" />
              </span>
            ) : showActions ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isOpen) {
                    onStop?.(config.id);
                  } else {
                    onSelect(config);
                  }
                }}
                className={cn(
                  "ml-3 shrink-0 rounded px-1.5 py-0.5 text-2xs transition-colors",
                  isOpen
                    ? "bg-badge-stop text-red-400 hover:bg-badge-stop-hover"
                    : "bg-launcher-bg text-primary hover:bg-launcher-hover",
                )}
              >
                {isOpen ? ui.stop : ui.start}
              </button>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
