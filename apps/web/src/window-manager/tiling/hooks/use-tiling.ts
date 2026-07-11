import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KEYS, readJson, writeJson } from "@/lib/storage";
import { isPaneId, PANE_CONFIGS } from "../../constants";
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
      if (LayoutEngine.getCellPanes(cell).some((id) => !isPaneId(id))) {
        return defaultTiling();
      }
    }
  }
  return saved;
}

function getInitialStates(allClosed: boolean): WindowStates {
  const states: WindowStates = {};

  const savedPanes = allClosed ? null : readJson<string[]>(KEYS.openPanes);

  PANE_CONFIGS.forEach((config) => {
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
  const statesRef = useRef(states);
  statesRef.current = states;
  // Layout, row heights and column widths are restored together so their
  // shapes always match (they are meaningless independently).
  const initialTiling = useMemo(() => {
    const loaded = loadTiling();
    const openPaneIds = Object.entries(states)
      .filter(([, state]) => state.isOpen)
      .map(([id]) => id);
    return LayoutEngine.ensurePanesInLayout(
      loaded.layout,
      openPaneIds,
      loaded.rowHeights,
      loaded.colWidths,
    );
  }, []);
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

  const getOpenPaneIds = useCallback(
    () =>
      Object.entries(statesRef.current)
        .filter(([, state]) => state.isOpen)
        .map(([id]) => id),
    [],
  );

  const layoutTier = useLayoutTier(tilingState, getOpenPaneIds);
  const drag = useDrag(tilingState);
  const resize = useResize(tilingState);

  const openWindow = useCallback(
    (id: string) => {
      if (!isPaneId(id)) return;

      setStates((prev) => {
        const state = prev[id];
        if (!state) return prev;
        return {
          ...prev,
          [id]: {
            ...state,
            isOpen: true,
          },
        };
      });
      setLayout((prev) => {
        const result = LayoutEngine.ensurePanesInLayout(prev, [id], rowHeights, colWidths);
        if (result.layout === prev) return prev;
        setRowHeights(result.rowHeights);
        setColWidths(result.colWidths);
        return result.layout;
      });
    },
    [rowHeights, colWidths],
  );

  const closeWindow = useCallback((id: string) => {
    if (!isPaneId(id)) return;

    setStates((prev) => {
      const state = prev[id];
      if (!state || !state.isOpen) return prev;
      return {
        ...prev,
        [id]: {
          ...state,
          isMaximized: false,
          isOpen: false,
        },
      };
    });
    setMaximizedId((prev) => (prev === id ? null : prev));
  }, []);

  const setOpenPanes = useCallback(
    (ids: string[]) => {
      const paneIds = [...new Set(ids.filter(isPaneId))];
      const openSet = new Set(paneIds);

      setStates((prev) => {
        const next = { ...prev };
        for (const id of Object.keys(next)) {
          const shouldBeOpen = openSet.has(id);
          if (next[id].isOpen !== shouldBeOpen) {
            next[id] = {
              ...next[id],
              isMaximized: shouldBeOpen && next[id].isMaximized,
              isOpen: shouldBeOpen,
            };
          }
        }
        return next;
      });
      setMaximizedId((prev) => (prev && openSet.has(prev) ? prev : null));
      setLayout((prev) => {
        const result = LayoutEngine.ensurePanesInLayout(prev, paneIds, rowHeights, colWidths);
        if (result.layout === prev) return prev;
        setRowHeights(result.rowHeights);
        setColWidths(result.colWidths);
        return result.layout;
      });
    },
    [rowHeights, colWidths],
  );

  const toggleMaximize = useCallback((id: string) => {
    if (!isPaneId(id) || !statesRef.current[id]?.isOpen) return;
    setMaximizedId((prev) => (prev === id ? null : id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    if (!isPaneId(id)) return;

    maxZRef.current++;
    setStates((prev) => {
      const state = prev[id];
      if (!state) return prev;
      return {
        ...prev,
        [id]: { ...state, zIndex: maxZRef.current },
      };
    });
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
