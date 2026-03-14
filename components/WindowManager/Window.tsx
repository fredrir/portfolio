"use client";

import { useCallback } from "react";
import type { WindowConfig, WindowState } from "./types";

interface Props {
  config: WindowConfig;
  state: WindowState;
  isFocused?: boolean;
  isSwapTarget?: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onResizeStart: (id: string, edge: string, e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function Window({
  config,
  state,
  isFocused,
  isSwapTarget,
  onClose,
  onMaximize,
  onFocus,
  onDragStart,
  onResizeStart,
  children,
}: Props) {
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      onDragStart(config.id, e);
    },
    [config.id, onDragStart],
  );

  const handleResize = useCallback(
    (edge: string) => (e: React.MouseEvent) => {
      onResizeStart(config.id, edge, e);
    },
    [config.id, onResizeStart],
  );

  return (
    <div
      className={`absolute flex flex-col rounded-xl border bg-background/80 backdrop-blur-md overflow-hidden transition-[border-color,box-shadow] duration-200 ${
        isSwapTarget
          ? "border-primary/60 ring-2 ring-primary/30 shadow-lg shadow-primary/10"
          : isFocused
            ? "border-primary/50 shadow-lg shadow-primary/10"
            : "border-primary/15 shadow-md shadow-primary/5"
      }`}
      style={{
        left: state.rect.x,
        top: state.rect.y,
        width: state.rect.w,
        height: state.rect.h,
        zIndex: state.zIndex,
        transition: state.isFloating
          ? "none"
          : "left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease",
      }}
      onMouseDown={onFocus}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b border-primary/15 bg-primary/[0.03] shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleDragStart}
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
          {config.icon && (
            <span className="text-primary/60 mr-1">{config.icon}</span>
          )}
          {config.title}
        </span>

        <span className="font-mono text-3xs text-primary/30">
          fredrir@arch
        </span>
      </div>

      <div className="flex-1 overflow-auto min-h-0">{children}</div>

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group"
        onMouseDown={handleResize("se")}
      >
        <svg
          className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 text-primary/20 group-hover:text-primary/50 transition-colors"
          viewBox="0 0 10 10"
        >
          <path d="M10 0L10 10L0 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 4L10 10L4 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
