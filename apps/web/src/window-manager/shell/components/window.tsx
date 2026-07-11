"use client";

import type { WindowConfig } from "../../types";
import { cn } from "@/shared/utils/cn";
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
      className={`flex-1 min-w-0 flex flex-col transition-all duration-200 ${
        isDragging
          ? "opacity-50 scale-[0.98]"
          : isSwapTarget
            ? "scale-[1.01]"
            : ""
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
          "flex-1 min-w-0 bg-glass-light",
          isDragging
            ? "border-wm-border-drag"
            : isSwapTarget
              ? "border-wm-border-swap ring-2 ring-wm-ring shadow-lg shadow-wm-shadow"
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
            className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-20 group/grip"
            onMouseDown={(e) => {
              e.stopPropagation();
              onCornerResize?.(e);
            }}
          >
            <svg
              viewBox="0 0 16 16"
              className="w-full h-full text-primary-subtle group-hover/grip:text-primary-soft transition-colors"
            >
              <line x1="14" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="14" y1="10" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="14" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </WindowFrame>
    </div>
  );
}
