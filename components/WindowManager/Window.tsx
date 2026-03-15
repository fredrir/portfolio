"use client";

import type { WindowConfig, WindowState } from "./types";

interface Props {
  config: WindowConfig;
  state: WindowState;
  isFocused?: boolean;
  isSwapTarget?: boolean;
  isDragging?: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onTitleMouseDown: (id: string, e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function Window({
  config,
  state,
  isFocused,
  isSwapTarget,
  isDragging,
  onClose,
  onMaximize,
  onFocus,
  onTitleMouseDown,
  children,
}: Props) {
  return (
    <div
      data-pane-id={config.id}
      className={`flex-1 min-w-0 flex flex-col rounded-xl border bg-background/80 backdrop-blur-md overflow-hidden transition-all duration-200 ${
        isDragging
          ? "opacity-50 scale-[0.98] border-primary/30"
          : isSwapTarget
            ? "border-primary/60 ring-2 ring-primary/30 shadow-lg shadow-primary/10 scale-[1.01]"
            : isFocused
              ? "border-primary/50 shadow-lg shadow-primary/10"
              : "border-primary/15 shadow-md shadow-primary/5"
      }`}
      onMouseDown={onFocus}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b border-primary/15 bg-primary/[0.03] shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          onTitleMouseDown(config.id, e);
        }}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-destructive/60 group-hover:bg-destructive transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow/60 group-hover:bg-accent-yellow transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
          </button>
        </div>

        <span className="font-mono text-2xs text-muted-foreground/50 truncate mx-2">
          {config.title}
        </span>

        <span className="font-mono text-3xs text-primary/30"></span>
      </div>

      <div className="flex-1 overflow-auto min-h-0">{children}</div>
    </div>
  );
}
