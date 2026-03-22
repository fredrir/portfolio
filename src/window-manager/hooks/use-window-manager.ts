import { useState, useCallback, useEffect, useRef } from "react";
import { WINDOW_CONFIGS } from "../constants";
import {
  DEFAULT_LAYOUT,
  DEFAULT_ROW_HEIGHTS,
  getCellPanes,
  getLayoutTier,
  LAYOUT_TIERS,
} from "../layout";
import type { CellDef } from "../layout";
import type { WindowStates } from "../types";
import { LS_OPEN_PANES } from "@/tutorial/constants";
import { useLayoutTier } from "./use-layout-tier";
import { useDrag } from "./use-drag";
import { useResize } from "./use-resize";

function getInitialStates(allClosed: boolean): WindowStates {
  const states: WindowStates = {};

  let savedPanes: string[] | null = null;
  if (!allClosed && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LS_OPEN_PANES);
      if (raw) savedPanes = JSON.parse(raw);
    } catch {}
  }

  WINDOW_CONFIGS.forEach((config) => {
    const isOpen = allClosed
      ? false
      : savedPanes
        ? savedPanes.includes(config.id)
        : config.defaultOpen;
    states[config.id] = {
      isOpen,
      isMaximized: false,
      zIndex: config.order,
    };
  });
  return states;
}

export function useWindowManager(initialAllClosed = false) {
  const [states, setStates] = useState<WindowStates>(() => getInitialStates(initialAllClosed));
  const [layout, setLayout] = useState<CellDef[][]>(() =>
    DEFAULT_LAYOUT.map((row) =>
      row.map((cell) => (Array.isArray(cell) ? [...cell] : cell)),
    ),
  );
  const [rowHeights, setRowHeights] = useState<number[]>(
    () => [...DEFAULT_ROW_HEIGHTS],
  );
  const [colWidths, setColWidths] = useState<number[][]>(
    () => LAYOUT_TIERS[getLayoutTier(typeof window !== "undefined" ? window.innerWidth : 1280)].colWidths.map((r) => [...r]),
  );
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [maximizedId, setMaximizedId] = useState<string | null>(null);
  const maxZRef = useRef(100);

  const onSwapRef = useRef<(() => void) | null>(null);
  const onResizeRef = useRef<(() => void) | null>(null);

  const layoutTier = useLayoutTier(setStates, setLayout, setRowHeights, setColWidths);
  const drag = useDrag(setLayout, onSwapRef);
  const resize = useResize(rowHeights, colWidths, setRowHeights, setColWidths, onResizeRef);

  const isCellVisible = useCallback(
    (cell: CellDef) => getCellPanes(cell).some((id) => states[id]?.isOpen),
    [states],
  );

  const openWindow = useCallback((id: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { isOpen: false, isMaximized: false, zIndex: 0 }),
        isOpen: true,
      },
    }));
    setLayout((prev) => {
      const allPanes = prev.flat().flatMap((c) => getCellPanes(c));
      if (allPanes.includes(id)) return prev;
      const next = prev.map((row) =>
        row.map((cell) => (Array.isArray(cell) ? [...cell] : cell)),
      );
      const newRow = [id];
      const updated = [...next, newRow];
      setRowHeights((prevH) => {
        const share = 25;
        const scaled = prevH.map((h) => h * (100 - share) / 100);
        return [...scaled, share];
      });
      setColWidths((prevW) => [...prevW, [100]]);
      return updated;
    });
  }, []);

  const closeWindow = useCallback(
    (id: string) => {
      setStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: false },
      }));
      if (maximizedId === id) setMaximizedId(null);
    },
    [maximizedId],
  );

  const setOpenPanes = useCallback((ids: string[]) => {
    const openSet = new Set(ids);
    setStates((prev) => {
      const next = { ...prev };
      for (const id of Object.keys(next)) {
        const shouldBeOpen = openSet.has(id);
        if (next[id].isOpen !== shouldBeOpen) {
          next[id] = { ...next[id], isOpen: shouldBeOpen };
        }
      }
      return next;
    });
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setMaximizedId((prev) => (prev === id ? null : id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    maxZRef.current++;
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: maxZRef.current },
    }));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setLauncherOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleLayout = layout
    .map((row) => row.filter((cell) => isCellVisible(cell)))
    .filter((row) => row.length > 0);

  return {
    states,
    visibleLayout,
    rowHeights,
    colWidths,
    layoutTier,
    maximizedId,
    launcherOpen,
    setLauncherOpen,
    openWindow,
    closeWindow,
    setOpenPanes,
    toggleMaximize,
    focusWindow,
    onSwapRef,
    onResizeRef,
    drag,
    resize,
  };
}
