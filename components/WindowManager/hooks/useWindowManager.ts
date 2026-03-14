import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { WINDOW_CONFIGS, GAP, STATUS_BAR_HEIGHT } from "../constants";
import type { WindowConfig, WindowState, WindowStates, Rect } from "../types";

function getWeight(id: string, allConfigs: WindowConfig[]): number {
  return allConfigs.find((c) => c.id === id)?.heightWeight ?? 1;
}

function computeTiledLayout(
  openIds: string[],
  vw: number,
  vh: number,
  allConfigs: WindowConfig[],
): Record<string, Rect> {
  const result: Record<string, Rect> = {};
  const availH = vh - STATUS_BAR_HEIGHT;
  const count = openIds.length;

  if (count === 0) return result;

  if (count === 1) {
    result[openIds[0]] = {
      x: GAP,
      y: GAP,
      w: vw - GAP * 2,
      h: availH - GAP * 2,
    };
    return result;
  }

  if (count === 2) {
    const halfW = (vw - GAP * 3) / 2;
    result[openIds[0]] = { x: GAP, y: GAP, w: halfW, h: availH - GAP * 2 };
    result[openIds[1]] = {
      x: GAP * 2 + halfW,
      y: GAP,
      w: halfW,
      h: availH - GAP * 2,
    };
    return result;
  }

  const masterW = Math.floor((vw - GAP * 3) * 0.38);
  const stackW = vw - GAP * 3 - masterW;
  const stackIds = openIds.slice(1);

  result[openIds[0]] = {
    x: GAP,
    y: GAP,
    w: masterW,
    h: availH - GAP * 2,
  };

  const stackX = GAP * 2 + masterW;
  const totalStackH = availH - GAP * 2;

  if (stackIds.length <= 3) {
    const totalWeight = stackIds.reduce(
      (sum, id) => sum + getWeight(id, allConfigs),
      0,
    );
    const gapSpace = GAP * (stackIds.length - 1);
    const usableH = totalStackH - gapSpace;
    let yOff = GAP;

    stackIds.forEach((id) => {
      const w = getWeight(id, allConfigs);
      const h = Math.round((w / totalWeight) * usableH);
      result[id] = { x: stackX, y: yOff, w: stackW, h };
      yOff += h + GAP;
    });
  } else {
    const cols = 2;
    const rowIds: string[][] = [];
    for (let i = 0; i < stackIds.length; i += cols) {
      rowIds.push(stackIds.slice(i, i + cols));
    }

    const rowWeights = rowIds.map((row) =>
      Math.max(...row.map((id) => getWeight(id, allConfigs))),
    );
    const totalWeight = rowWeights.reduce((a, b) => a + b, 0);
    const gapSpace = GAP * (rowIds.length - 1);
    const usableH = totalStackH - gapSpace;
    const colW = (stackW - GAP * (cols - 1)) / cols;
    let yOff = GAP;

    rowIds.forEach((row, ri) => {
      const rowH = Math.round((rowWeights[ri] / totalWeight) * usableH);
      row.forEach((id, ci) => {
        const isLastRow = ri === rowIds.length - 1;
        const itemsInRow = row.length;
        const itemW = itemsInRow === 1 ? stackW : colW;
        const itemX =
          itemsInRow === 1 ? stackX : stackX + ci * (colW + GAP);

        result[id] = { x: itemX, y: yOff, w: itemW, h: rowH };
      });
      yOff += rowH + GAP;
    });
  }

  return result;
}

function getInitialStates(): WindowStates {
  const states: WindowStates = {};
  WINDOW_CONFIGS.forEach((config) => {
    states[config.id] = {
      isOpen: config.defaultOpen,
      isMaximized: false,
      isFloating: false,
      rect: { x: 0, y: 0, w: 400, h: 300 },
      zIndex: config.order,
    };
  });
  return states;
}

export function useWindowManager() {
  const [states, setStates] = useState<WindowStates>(getInitialStates);
  const [dynamicConfigs, setDynamicConfigs] = useState<WindowConfig[]>([]);
  const [tileOrder, setTileOrder] = useState<string[]>(
    () =>
      WINDOW_CONFIGS.filter((c) => c.defaultOpen)
        .sort((a, b) => a.order - b.order)
        .map((c) => c.id),
  );
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [viewport, setViewport] = useState({ w: 1920, h: 1080 });
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [swapTarget, setSwapTarget] = useState<string | null>(null);
  const [retileKey, setRetileKey] = useState(0);
  const maxZRef = useRef(100);
  const dragRef = useRef<{
    windowId: string;
    startMouse: { x: number; y: number };
    startRect: Rect;
    tiledRects: Record<string, Rect>;
  } | null>(null);

  const allConfigs = useMemo(
    () => [...WINDOW_CONFIGS, ...dynamicConfigs],
    [dynamicConfigs],
  );

  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setStates((prev) => {
      const openIds = tileOrder.filter(
        (id) => prev[id]?.isOpen && !prev[id]?.isMaximized,
      );
      const rects = computeTiledLayout(
        openIds,
        viewport.w,
        viewport.h,
        allConfigs,
      );
      const next = { ...prev };
      for (const id of openIds) {
        if (rects[id]) {
          next[id] = { ...next[id], rect: rects[id], isFloating: false };
        }
      }
      return next;
    });
  }, [viewport, tileOrder, retileKey, allConfigs]);

  const triggerRetile = useCallback(() => {
    setRetileKey((k) => k + 1);
  }, []);

  const openWindow = useCallback(
    (id: string) => {
      setStates((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {
            isOpen: false,
            isMaximized: false,
            isFloating: false,
            rect: { x: 0, y: 0, w: 400, h: 300 },
            zIndex: 0,
          }),
          isOpen: true,
          isFloating: false,
          isMaximized: false,
        },
      }));
      setTileOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
      triggerRetile();
    },
    [triggerRetile],
  );

  const closeWindow = useCallback(
    (id: string) => {
      const config = allConfigs.find((c) => c.id === id);
      setStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: false },
      }));
      if (config?.isDynamic) {
        setTileOrder((prev) => prev.filter((tid) => tid !== id));
        setDynamicConfigs((prev) => prev.filter((c) => c.id !== id));
      }
      triggerRetile();
    },
    [allConfigs, triggerRetile],
  );

  const openDynamicWindow = useCallback(
    (config: WindowConfig) => {
      const existing = dynamicConfigs.find((c) => c.id === config.id);
      if (existing) {
        maxZRef.current++;
        setStates((prev) => ({
          ...prev,
          [config.id]: {
            ...prev[config.id],
            isOpen: true,
            zIndex: maxZRef.current,
          },
        }));
        return;
      }

      setDynamicConfigs((prev) => [...prev, { ...config, isDynamic: true }]);
      maxZRef.current++;
      setStates((prev) => ({
        ...prev,
        [config.id]: {
          isOpen: true,
          isMaximized: false,
          isFloating: false,
          rect: { x: 0, y: 0, w: 400, h: 300 },
          zIndex: maxZRef.current,
        },
      }));
    },
    [dynamicConfigs],
  );

  const closeDynamicWindow = useCallback(
    (id: string) => {
      setStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: false },
      }));
      setDynamicConfigs((prev) => prev.filter((c) => c.id !== id));
    },
    [],
  );

  const toggleMaximize = useCallback(
    (id: string) => {
      setStates((prev) => {
        const ws = prev[id];
        if (!ws) return prev;
        const newMax = !ws.isMaximized;
        maxZRef.current++;
        return {
          ...prev,
          [id]: {
            ...ws,
            isMaximized: newMax,
            isFloating: false,
            zIndex: maxZRef.current,
            rect: newMax
              ? {
                  x: GAP,
                  y: GAP,
                  w: viewport.w - GAP * 2,
                  h: viewport.h - STATUS_BAR_HEIGHT - GAP * 2,
                }
              : ws.rect,
          },
        };
      });
      triggerRetile();
    },
    [viewport, triggerRetile],
  );

  const focusWindow = useCallback((id: string) => {
    maxZRef.current++;
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: maxZRef.current },
    }));
  }, []);

  const startDrag = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      maxZRef.current++;
      focusWindow(id);

      setStates((prev) => {
        const ws = prev[id];
        if (!ws) return prev;

        const openIds = tileOrder.filter(
          (tid) => prev[tid]?.isOpen && !prev[tid]?.isMaximized,
        );
        const tiledRects = computeTiledLayout(
          openIds,
          viewport.w,
          viewport.h,
          allConfigs,
        );

        dragRef.current = {
          windowId: id,
          startMouse: { x: e.clientX, y: e.clientY },
          startRect: { ...ws.rect },
          tiledRects,
        };

        return {
          ...prev,
          [id]: { ...ws, isFloating: true, zIndex: maxZRef.current },
        };
      });

      setDragTarget(id);
    },
    [focusWindow, tileOrder, viewport, allConfigs],
  );

  const startResize = useCallback(
    (id: string, edge: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      focusWindow(id);

      setStates((prev) => {
        const ws = prev[id];
        if (!ws) return prev;
        dragRef.current = {
          windowId: id,
          startMouse: { x: e.clientX, y: e.clientY },
          startRect: { ...ws.rect },
          tiledRects: {},
        };
        return {
          ...prev,
          [id]: { ...ws, isFloating: true, zIndex: maxZRef.current },
        };
      });

      setDragTarget(`resize-${id}`);
    },
    [focusWindow],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;

      const dx = e.clientX - d.startMouse.x;
      const dy = e.clientY - d.startMouse.y;
      const isResize = dragTarget?.startsWith("resize-");

      if (isResize) {
        setStates((prev) => {
          const ws = prev[d.windowId];
          if (!ws) return prev;
          return {
            ...prev,
            [d.windowId]: {
              ...ws,
              rect: {
                ...d.startRect,
                w: Math.max(200, d.startRect.w + dx),
                h: Math.max(120, d.startRect.h + dy),
              },
            },
          };
        });
        return;
      }

      setStates((prev) => ({
        ...prev,
        [d.windowId]: {
          ...prev[d.windowId],
          rect: {
            ...d.startRect,
            x: d.startRect.x + dx,
            y: d.startRect.y + dy,
          },
        },
      }));

      let hoveredId: string | null = null;
      for (const [id, rect] of Object.entries(d.tiledRects)) {
        if (id === d.windowId) continue;
        if (
          e.clientX >= rect.x &&
          e.clientX <= rect.x + rect.w &&
          e.clientY >= rect.y &&
          e.clientY <= rect.y + rect.h
        ) {
          hoveredId = id;
          break;
        }
      }
      setSwapTarget(hoveredId);
    };

    const onMouseUp = () => {
      const d = dragRef.current;
      const isResize = dragTarget?.startsWith("resize-");

      if (d && !isResize && swapTarget) {
        setTileOrder((prev) => {
          const next = [...prev];
          const fromIdx = next.indexOf(d.windowId);
          const toIdx = next.indexOf(swapTarget);
          if (fromIdx !== -1 && toIdx !== -1) {
            [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
          }
          return next;
        });
      }

      dragRef.current = null;
      setDragTarget(null);
      setSwapTarget(null);

      if (!isResize) {
        setStates((prev) => {
          const next = { ...prev };
          for (const id of Object.keys(next)) {
            if (next[id].isFloating) {
              next[id] = { ...next[id], isFloating: false };
            }
          }
          return next;
        });
      }
      triggerRetile();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [swapTarget, triggerRetile, dragTarget]);

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

  return {
    states,
    viewport,
    allConfigs,
    launcherOpen,
    setLauncherOpen,
    openWindow,
    closeWindow,
    openDynamicWindow,
    closeDynamicWindow,
    toggleMaximize,
    focusWindow,
    startDrag,
    startResize,
    dragTarget,
    swapTarget,
  };
}
