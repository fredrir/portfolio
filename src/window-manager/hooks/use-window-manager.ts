import { useState, useCallback, useEffect, useRef } from "react";
import { WINDOW_CONFIGS } from "../constants";
import {
  DEFAULT_LAYOUT,
  DEFAULT_ROW_HEIGHTS,
  getCellPanes,
  swapPanesInLayout,
  getLayoutTier,
  LAYOUT_TIERS,
} from "../layout";
import type { CellDef, LayoutTier } from "../layout";
import type { WindowStates } from "../types";
import { LS_OPEN_PANES } from "@/tutorial/constants";

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
  const [layoutTier, setLayoutTier] = useState<LayoutTier>("large");
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
  const [swapTarget, setSwapTarget] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragSize, setDragSize] = useState<{ w: number; h: number } | null>(
    null,
  );
  const maxZRef = useRef(100);
  const swapTargetRef = useRef<string | null>(null);

  useEffect(() => {
    const check = () => {
      const tier = getLayoutTier(window.innerWidth);
      setLayoutTier((prev) => {
        if (prev === tier) return prev;
        const tierConfig = LAYOUT_TIERS[tier];
        const newLayout = tierConfig.layout;
        setLayout(
          newLayout.map((row) =>
            row.map((cell) => (Array.isArray(cell) ? [...cell] : cell)),
          ),
        );
        setRowHeights([...tierConfig.rowHeights]);
        setColWidths(tierConfig.colWidths.map((r) => [...r]));

        const layoutPanes = new Set(
          newLayout.flat().flatMap((c) => getCellPanes(c)),
        );
        setStates((prevStates) => {
          const next = { ...prevStates };
          for (const id of Object.keys(next)) {
            if (!layoutPanes.has(id) && next[id].isOpen) {
              next[id] = { ...next[id], isOpen: false };
            }
          }
          return next;
        });

        return tier;
      });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isCellVisible = useCallback(
    (cell: CellDef) => {
      return getCellPanes(cell).some((id) => states[id]?.isOpen);
    },
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

  const onSwapRef = useRef<(() => void) | null>(null);
  const onResizeRef = useRef<(() => void) | null>(null);

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

  const startTitleDrag = useCallback(
    (paneId: string, e: React.MouseEvent) => {
      e.preventDefault();

      const paneEl = (e.target as HTMLElement).closest("[data-pane-id]");
      const rect = paneEl?.getBoundingClientRect();
      const offsetX = rect ? e.clientX - rect.left : 0;
      const offsetY = rect ? e.clientY - rect.top : 0;

      setDragTarget(paneId);
      setDragPos({ x: e.clientX - offsetX, y: e.clientY - offsetY });
      setDragSize(
        rect ? { w: rect.width, h: rect.height } : { w: 300, h: 200 },
      );

      const onMouseMove = (ev: MouseEvent) => {
        setDragPos({ x: ev.clientX - offsetX, y: ev.clientY - offsetY });

        const els = document.elementsFromPoint(ev.clientX, ev.clientY);
        let targetId: string | null = null;
        for (const el of els) {
          const pane = el.closest("[data-pane-id]");
          const id = pane?.getAttribute("data-pane-id");
          if (id && id !== paneId) {
            targetId = id;
            break;
          }
        }
        swapTargetRef.current = targetId;
        setSwapTarget(targetId);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);

        const dropTarget = swapTargetRef.current;

        if (dropTarget && dropTarget !== paneId) {
          setLayout((prev) => swapPanesInLayout(prev, paneId, dropTarget));
          onSwapRef.current?.();
        }

        swapTargetRef.current = null;
        setSwapTarget(null);
        setDragTarget(null);
        setDragPos(null);
        setDragSize(null);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [],
  );

  const startRowResize = useCallback(
    (dividerIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeights = [...rowHeights];
      const totalHeight = window.innerHeight - 28;

      const onMouseMove = (ev: MouseEvent) => {
        const dy = ev.clientY - startY;
        const dyPercent = (dy / totalHeight) * 100;
        const newH = [...startHeights];
        newH[dividerIndex] = Math.max(
          10,
          startHeights[dividerIndex] + dyPercent,
        );
        newH[dividerIndex + 1] = Math.max(
          10,
          startHeights[dividerIndex + 1] - dyPercent,
        );
        setRowHeights(newH);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        onResizeRef.current?.();
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [rowHeights],
  );

  const startColResize = useCallback(
    (rowIndex: number, dividerIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidths = colWidths.map((r) => [...r]);
      const totalWidth = window.innerWidth;

      const onMouseMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dxPercent = (dx / totalWidth) * 100;
        const newW = startWidths.map((r) => [...r]);
        if (!newW[rowIndex]) return;
        newW[rowIndex][dividerIndex] = Math.max(
          10,
          startWidths[rowIndex][dividerIndex] + dxPercent,
        );
        newW[rowIndex][dividerIndex + 1] = Math.max(
          10,
          startWidths[rowIndex][dividerIndex + 1] - dxPercent,
        );
        setColWidths(newW);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        onResizeRef.current?.();
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [colWidths],
  );

  const startCornerResize = useCallback(
    (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startHeights = [...rowHeights];
      const startWidths = colWidths.map((r) => [...r]);
      const totalHeight = window.innerHeight - 28;
      const totalWidth = window.innerWidth;

      const onMouseMove = (ev: MouseEvent) => {
        const dy = ev.clientY - startY;
        const dyPercent = (dy / totalHeight) * 100;
        const newH = [...startHeights];
        if (rowIndex < startHeights.length - 1) {
          newH[rowIndex] = Math.max(10, startHeights[rowIndex] + dyPercent);
          newH[rowIndex + 1] = Math.max(10, startHeights[rowIndex + 1] - dyPercent);
          setRowHeights(newH);
        }

        const dx = ev.clientX - startX;
        const dxPercent = (dx / totalWidth) * 100;
        const newW = startWidths.map((r) => [...r]);
        if (newW[rowIndex] && colIndex < newW[rowIndex].length - 1) {
          newW[rowIndex][colIndex] = Math.max(10, startWidths[rowIndex][colIndex] + dxPercent);
          newW[rowIndex][colIndex + 1] = Math.max(10, startWidths[rowIndex][colIndex + 1] - dxPercent);
          setColWidths(newW);
        }
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        onResizeRef.current?.();
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [rowHeights, colWidths],
  );

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
    swapTarget,
    dragTarget,
    dragPos,
    dragSize,
    setSwapTarget,
    setDragTarget,
    setLauncherOpen,
    openWindow,
    closeWindow,
    setOpenPanes,
    toggleMaximize,
    focusWindow,
    startTitleDrag,
    startRowResize,
    startColResize,
    startCornerResize,
    onSwapRef,
    onResizeRef,
  };
}
