"use client";

import { useCallback } from "react";
import type { WindowConfig, WindowState } from "./types";

interface Props {
  config: WindowConfig;
  state: WindowState;
  onClose: () => void;
  onMaximize: () => void;
  onTile: () => void;
  onFocus: () => void;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onResizeStart: (id: string, edge: string, e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function Window({
  config,
  state,
  onClose,
  onMaximize,
  onTile,
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

  const handleDoubleClick = useCallback(() => {
    if (state.isFloating) {
      onTile();
    } else {
      onMaximize();
    }
  }, [state.isFloating, onTile, onMaximize]);

  const handleResize = useCallback(
    (edge: string) => (e: React.MouseEvent) => {
      onResizeStart(config.id, edge, e);
    },
    [config.id, onResizeStart],
  );

  return (
    <div
      className="absolute flex flex-col rounded-lg border border-primary/20 bg-background/90 backdrop-blur-md shadow-lg shadow-primary/5 overflow-hidden transition-shadow duration-200"
      style={{
        left: state.rect.x,
        top: state.rect.y,
        width: state.rect.w,
        height: state.rect.h,
        zIndex: state.zIndex,
        transition: state.isFloating ? "none" : "left 0.3s, top 0.3s, width 0.3s, height 0.3s",
      }}
      onMouseDown={onFocus}
    >
      <div
        className="flex items-center justify-between px-3 py-1 border-b border-primary/15 bg-primary/[0.03] shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleDragStart}
        onDoubleClick={handleDoubleClick}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60 group-hover:bg-destructive transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow/60 group-hover:bg-accent-yellow transition-colors" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
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

      {(state.isFloating || state.isMaximized) && (
        <>
          <div
            className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize"
            onMouseDown={handleResize("e")}
          />
          <div
            className="absolute top-0 left-0 w-1.5 h-full cursor-ew-resize"
            onMouseDown={handleResize("w")}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize"
            onMouseDown={handleResize("s")}
          />
          <div
            className="absolute top-0 left-0 w-full h-1.5 cursor-ns-resize"
            onMouseDown={handleResize("n")}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
            onMouseDown={handleResize("se")}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
            onMouseDown={handleResize("sw")}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize"
            onMouseDown={handleResize("ne")}
          />
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize"
            onMouseDown={handleResize("nw")}
          />
        </>
      )}
    </div>
  );
}
