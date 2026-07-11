"use client";

import { cn } from "@/shared/utils/cn";
import type { WindowConfig } from "../../types";
import { WindowFrame } from "./window-frame";

interface Props {
  config: WindowConfig;
  isFocused?: boolean;
  isSwapTarget?: boolean;
  isDragging?: boolean;
  showResizeGrip?: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onFocus?: () => void;
  onTitleMouseDown?: (id: string, e: React.MouseEvent) => void;
  onCornerResize?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function Window({
  config,
  isFocused,
  isSwapTarget,
  isDragging,
  showResizeGrip,
  onClose,
  onMaximize,
  onFocus,
  onTitleMouseDown,
  onCornerResize,
  children,
}: Props) {
  return (
    <div
      data-pane-id={config.id}
      className={`flex min-w-0 flex-1 flex-col transition-all duration-200 ${
        isDragging ? "scale-[0.98] opacity-50" : isSwapTarget ? "scale-[1.01]" : ""
      }`}
      onMouseDown={onFocus ?? undefined}
    >
      <WindowFrame
        title={
          <span className={cn(isFocused ? "text-primary-bold" : "text-primary-muted")}>
            {config.title}
          </span>
        }
        onClose={onClose}
        onMaximize={onMaximize}
        onTitleBarMouseDown={(e) => {
          if (e.button !== 0 || !onTitleMouseDown) return;
          onTitleMouseDown(config.id, e);
        }}
        onTitleBarDoubleClick={onMaximize}
        className={cn(
          "min-w-0 flex-1 bg-glass-light",
          isDragging
            ? "border-wm-border-drag"
            : isSwapTarget
              ? "border-wm-border-swap shadow-lg shadow-wm-shadow ring-2 ring-wm-ring"
              : isFocused
                ? "border-wm-border-focus shadow-lg shadow-wm-shadow"
                : "border-wm-border shadow-md shadow-wm-shadow-soft",
        )}
        titleBarClassName="cursor-grab active:cursor-grabbing select-none"
        contentClassName="@container relative font-mono text-xs"
      >
        {children}
        {showResizeGrip && (
          <div
            className="group/grip absolute right-0 bottom-0 z-20 h-5 w-5 cursor-nwse-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              onCornerResize?.(e);
            }}
          >
            <svg
              viewBox="0 0 16 16"
              className="h-full w-full text-primary-subtle transition-colors group-hover/grip:text-primary-soft"
            >
              <line
                x1="14"
                y1="6"
                x2="6"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="14"
                y1="10"
                x2="10"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="14"
                y1="14"
                x2="14"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </WindowFrame>
    </div>
  );
}
