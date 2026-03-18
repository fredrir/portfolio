"use client";

import type { WindowConfig, WindowState } from "../types";
import { cn } from "@/shared/utils/cn";
interface Props {
  config: WindowConfig;
  state: WindowState;
  isFocused?: boolean;
  isSwapTarget?: boolean;
  isDragging?: boolean;
  showResizeGrip?: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onTitleMouseDown: (id: string, e: React.MouseEvent) => void;
  onCornerResize?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function Window({
  config,
  state,
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
      className={`flex-1 min-w-0 flex flex-col rounded-xl border bg-glass-light backdrop-blur-md overflow-hidden transition-all duration-200 ${
        isDragging
          ? "opacity-50 scale-[0.98] border-wm-border-drag"
          : isSwapTarget
            ? "border-wm-border-swap ring-2 ring-wm-ring shadow-lg shadow-wm-shadow scale-[1.01]"
            : isFocused
              ? "border-wm-border-focus shadow-lg shadow-wm-shadow"
              : "border-wm-border shadow-md shadow-wm-shadow-soft"
      }`}
      onMouseDown={onFocus}
    >
      <div
        className="flex items-center justify-between px-3 py-0.5 border-b border-wm-border bg-surface-faint shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          onTitleMouseDown(config.id, e);
        }}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center -ml-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group p-1.5"
          >
            <div className="w-3 h-3 rounded-full bg-wm-close group-hover:bg-destructive transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group p-1.5"
          >
            <div className="w-3 h-3 rounded-full bg-wm-minimize group-hover:bg-accent-yellow transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group p-1.5"
          >
            <div className="w-3 h-3 rounded-full bg-wm-maximize group-hover:bg-primary transition-colors" />
          </button>
        </div>

        <span
          className={cn(
            "font-mono text-xs truncate mx-2",

            isFocused ? "text-primary-bold" : "text-primary-muted",
          )}
        >
          {config.title}
        </span>

        <span className="font-mono text-3xs text-primary-subtle"></span>
      </div>

      <div className="flex-1 overflow-auto min-h-0 @container relative font-mono text-xs">
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
      </div>
    </div>
  );
}
