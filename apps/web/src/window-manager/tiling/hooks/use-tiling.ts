import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KEYS, readJson, writeJson } from "@/lib/storage";
import { WINDOW_CONFIGS } from "../../constants";
import type { WindowStates } from "../../types";
import { LayoutEngine } from "../layout-engine";
import type { CellDef } from "../types";
import { DEFAULT_ROW_HEIGHTS, LAYOUT_TIERS } from "../types";
import { useDrag } from "./use-drag";
import { useLayoutTier } from "./use-layout-tier";
import { useResize } from "./use-resize";

/** Persisted arrangement, kept shape-consistent (layout ↔ heights ↔ widths). */
interface PersistedTiling {
  layout: CellDef[][];
  rowHeights: number[];
  colWidths: number[][];
}

const VALID_PANE_IDS = new Set(WINDOW_CONFIGS.map((c) => c.id));

function defaultTiling(): PersistedTiling {
  const tier = LayoutEngine.getTier(typeof window !== "undefined" ? window.innerWidth : 1280);
  return {
    layout: LayoutEngine.cloneLayout(LAYOUT_TIERS[tier].layout),
    rowHeights: [...DEFAULT_ROW_HEIGHTS],
    colWidths: LAYOUT_TIERS[tier].colWidths.map((r) => [...r]),
  };
}

/**
 * Restore the saved arrangement only when it is internally consistent and
 * still references known panes — otherwise fall back to the tier default so a
 * schema change (new pane ids, changed layout shape) never feeds malformed
 * state to a returning visitor.
 */
function loadTiling(): PersistedTiling {
  const saved = readJson<PersistedTiling>(KEYS.tiling);
  if (
    !saved ||
    !Array.isArray(saved.layout) ||
    !Array.isArray(saved.rowHeights) ||
    !Array.isArray(saved.colWidths) ||
    saved.layout.length === 0 ||
    saved.rowHeights.length !== saved.layout.length ||
    saved.colWidths.length !== saved.layout.length
  ) {
    return defaultTiling();
  }
  for (let r = 0; r < saved.layout.length; r++) {
    if (!Array.isArray(saved.layout[r]) || saved.layout[r].length === 0) {
      return defaultTiling();
    }
    if (saved.colWidths[r]?.length !== saved.layout[r].length) {
      return defaultTiling();
    }
    for (const cell of saved.layout[r]) {
      if (LayoutEngine.getCellPanes(cell).some((id) => !VALID_PANE_IDS.has(id))) {
        return defaultTiling();
      }
    }
  }
  return saved;
}

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
  const [states, setStates] = useState<WindowStates>(() => getInitialStates(initialAllClosed));
  // Layout, row heights and column widths are restored together so their
  // shapes always match (they are meaningless independently).
  const initialTiling = useMemo(() => loadTiling(), []);
  const [layout, setLayout] = useState<CellDef[][]>(initialTiling.layout);
  const [rowHeights, setRowHeights] = useState<number[]>(initialTiling.rowHeights);
  const [colWidths, setColWidths] = useState<number[][]>(initialTiling.colWidths);
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
    // Persist the arrangement as one shape-consistent blob so drag-swaps and
    // resizes both survive a reload (and can't drift out of sync).
    writeJson(KEYS.tiling, {
      layout,
      rowHeights,
      colWidths,
    } satisfies PersistedTiling);
  }, [states, layout, rowHeights, colWidths]);

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
