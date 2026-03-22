import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { WINDOW_CONFIGS } from "../../constants";
import { KEYS, readJson, writeJson } from "@/lib/storage";
import { LayoutEngine } from "../layout-engine";
import { DEFAULT_ROW_HEIGHTS, LAYOUT_TIERS } from "../types";
import type { CellDef } from "../types";
import type { WindowStates } from "../../types";
import { useLayoutTier } from "./use-layout-tier";
import { useDrag } from "./use-drag";
import { useResize } from "./use-resize";

function getInitialStates(allClosed: boolean): WindowStates {
  const states: WindowStates = {};

  const savedPanes = allClosed ? null : readJson<string[]>(KEYS.openPanes);

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

export function useTiling(initialAllClosed = false) {
  const [states, setStates] = useState<WindowStates>(() =>
    getInitialStates(initialAllClosed),
  );
  const [layout, setLayout] = useState<CellDef[][]>(() =>
    LayoutEngine.cloneLayout(
      LAYOUT_TIERS[
        LayoutEngine.getTier(
          typeof window !== "undefined" ? window.innerWidth : 1280,
        )
      ].layout,
    ),
  );
  const [rowHeights, setRowHeights] = useState<number[]>(() => {
    const saved = readJson<number[]>(KEYS.rowHeights);
    return saved ?? [...DEFAULT_ROW_HEIGHTS];
  });
  const [colWidths, setColWidths] = useState<number[][]>(() => {
    const saved = readJson<number[][]>(KEYS.colWidths);
    return (
      saved ??
      LAYOUT_TIERS[
        LayoutEngine.getTier(
          typeof window !== "undefined" ? window.innerWidth : 1280,
        )
      ].colWidths.map((r) => [...r])
    );
  });
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [maximizedId, setMaximizedId] = useState<string | null>(null);
  const maxZRef = useRef(100);

  const onSwapRef = useRef<(() => void) | null>(null);
  const onResizeRef = useRef<(() => void) | null>(null);

  const tilingState = useMemo(
    () => ({
      layout,
      rowHeights,
      colWidths,
      setLayout,
      setRowHeights,
      setColWidths,
      onSwapRef,
      onResizeRef,
    }),
    [layout, rowHeights, colWidths],
  );

  const layoutTier = useLayoutTier(tilingState, setStates);
  const drag = useDrag(tilingState);
  const resize = useResize(tilingState);

  const openWindow = useCallback(
    (id: string) => {
      setStates((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || { isOpen: false, isMaximized: false, zIndex: 0 }),
          isOpen: true,
        },
      }));
      setLayout((prev) => {
        const allPanes = prev.flat().flatMap((c) => LayoutEngine.getCellPanes(c));
        if (allPanes.includes(id)) return prev;
        const result = LayoutEngine.addPaneRow(prev, id, rowHeights, colWidths);
        setRowHeights(result.rowHeights);
        setColWidths(result.colWidths);
        return result.layout;
      });
    },
    [rowHeights, colWidths],
  );

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

  useEffect(() => {
    const openIds = Object.entries(states)
      .filter(([, s]) => s.isOpen)
      .map(([id]) => id);
    writeJson(KEYS.openPanes, openIds);
    writeJson(KEYS.rowHeights, rowHeights);
    writeJson(KEYS.colWidths, colWidths);
  }, [states, rowHeights, colWidths]);

  const visibleLayout = LayoutEngine.getVisibleLayout(layout, states);

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
