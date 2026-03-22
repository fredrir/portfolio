"use client";

import { createContext, useContext } from "react";
import type { WindowStates } from "../types";
import type { DragResult, ResizeResult } from "./types";

interface TilingContextValue {
  states: WindowStates;
  focusedId: string | null;
  paneContent: Record<string, React.ReactNode>;
  drag: DragResult;
  resize: ResizeResult;
  onClose: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
}

const TilingContext = createContext<TilingContextValue | null>(null);

export function useTilingContext(): TilingContextValue {
  const ctx = useContext(TilingContext);
  if (!ctx) throw new Error("useTilingContext must be used within TilingProvider");
  return ctx;
}

export function TilingProvider({
  value,
  children,
}: {
  value: TilingContextValue;
  children: React.ReactNode;
}) {
  return (
    <TilingContext.Provider value={value}>{children}</TilingContext.Provider>
  );
}

export { TilingGrid } from "./components/tiling-grid";
export { useTiling } from "./hooks/use-tiling";
export { LayoutEngine } from "./layout-engine";
export type { CellDef, LayoutTier, DragResult, ResizeResult } from "./types";
