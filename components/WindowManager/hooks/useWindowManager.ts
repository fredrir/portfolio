import { useState, useCallback, useEffect, useRef } from "react";
import {
  WINDOW_CONFIGS,
  DEFAULT_ROWS,
  DEFAULT_ROW_HEIGHTS,
  STACKED_PANES,
} from "../constants";
import type { WindowState, WindowStates } from "../types";

function getInitialStates(): WindowStates {
  const states: WindowStates = {};
  WINDOW_CONFIGS.forEach((config) => {
    states[config.id] = {
      isOpen: config.defaultOpen,
      isMaximized: false,
      zIndex: config.order,
    };
  });
  return states;
}

function expandCell(cellId: string): string[] {
  return STACKED_PANES[cellId] || [cellId];
}

export function useWindowManager() {
  const [states, setStates] = useState<WindowStates>(getInitialStates);
  const [rows, setRows] = useState<string[][]>(
    () => DEFAULT_ROWS.map((r) => [...r]),
  );
  const [rowHeights, setRowHeights] = useState<number[]>(
    () => [...DEFAULT_ROW_HEIGHTS],
  );
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [maximizedId, setMaximizedId] = useState<string | null>(null);
  const [swapTarget, setSwapTarget] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragSize, setDragSize] = useState<{ w: number; h: number } | null>(null);
  const maxZRef = useRef(100);
  const swapTargetRef = useRef<string | null>(null);

  const isCellVisible = useCallback(
    (cellId: string) => {
      const panes = expandCell(cellId);
      return panes.some((id) => states[id]?.isOpen);
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
    setRows((prev) => {
      const allCellPanes = prev.flat().flatMap((c) => expandCell(c));
      if (allCellPanes.includes(id)) return prev;
      const lastRow = prev[prev.length - 1];
      if (lastRow.length < 3) {
        const next = prev.map((r) => [...r]);
        next[next.length - 1] = [...lastRow, id];
        return next;
      }
      return [...prev, [id]];
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

  const swapPanes = useCallback((a: string, b: string) => {
    if (a === b) return;
    setRows((prev) => {
      const next = prev.map((row) => [...row]);
      let aPos: [number, number] | null = null;
      let bPos: [number, number] | null = null;

      for (let r = 0; r < next.length; r++) {
        for (let c = 0; c < next[r].length; c++) {
          const cellPanes = expandCell(next[r][c]);
          if (cellPanes.includes(a) || next[r][c] === a) aPos = [r, c];
          if (cellPanes.includes(b) || next[r][c] === b) bPos = [r, c];
        }
      }

      if (aPos && bPos && (aPos[0] !== bPos[0] || aPos[1] !== bPos[1])) {
        const tmp = next[aPos[0]][aPos[1]];
        next[aPos[0]][aPos[1]] = next[bPos[0]][bPos[1]];
        next[bPos[0]][bPos[1]] = tmp;
      }

      return next;
    });
    setDragTarget(null);
    setSwapTarget(null);
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
      setDragSize(rect ? { w: rect.width, h: rect.height } : { w: 300, h: 200 });

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
          setRows((prev) => {
            const next = prev.map((row) => [...row]);
            let aPos: [number, number] | null = null;
            let bPos: [number, number] | null = null;

            for (let r = 0; r < next.length; r++) {
              for (let c = 0; c < next[r].length; c++) {
                const cellPanes = expandCell(next[r][c]);
                if (next[r][c] === paneId || cellPanes.includes(paneId))
                  aPos = [r, c];
                if (next[r][c] === dropTarget || cellPanes.includes(dropTarget))
                  bPos = [r, c];
              }
            }

            if (aPos && bPos && (aPos[0] !== bPos[0] || aPos[1] !== bPos[1])) {
              const tmp = next[aPos[0]][aPos[1]];
              next[aPos[0]][aPos[1]] = next[bPos[0]][bPos[1]];
              next[bPos[0]][bPos[1]] = tmp;
            }

            return next;
          });
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
        newH[dividerIndex] = Math.max(10, startHeights[dividerIndex] + dyPercent);
        newH[dividerIndex + 1] = Math.max(
          10,
          startHeights[dividerIndex + 1] - dyPercent,
        );
        setRowHeights(newH);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [rowHeights],
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

  const visibleRows = rows
    .map((row) => row.filter((cellId) => isCellVisible(cellId)))
    .filter((row) => row.length > 0);

  return {
    states,
    visibleRows,
    rowHeights,
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
    toggleMaximize,
    focusWindow,
    swapPanes,
    startTitleDrag,
    startRowResize,
  };
}
