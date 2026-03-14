import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { WINDOW_CONFIGS, GAP, STATUS_BAR_HEIGHT } from "../constants";
import type { WindowConfig, WindowState, WindowStates, Rect } from "../types";

function computeTiledLayout(
  openIds: string[],
  vw: number,
  vh: number,
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

  if (stackIds.length <= 3) {
    const rowH =
      (availH - GAP * 2 - GAP * (stackIds.length - 1)) / stackIds.length;
    stackIds.forEach((id, i) => {
      result[id] = {
        x: stackX,
        y: GAP + i * (rowH + GAP),
        w: stackW,
        h: rowH,
      };
    });
  } else {
    const cols = 2;
    const rows = Math.ceil(stackIds.length / cols);
    const colW = (stackW - GAP * (cols - 1)) / cols;
    const rowH = (availH - GAP * 2 - GAP * (rows - 1)) / rows;

    stackIds.forEach((id, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const isLastRow = row === rows - 1;
      const itemsInRow =
        isLastRow && stackIds.length % cols !== 0
          ? stackIds.length % cols
          : cols;
      const itemW = itemsInRow === 1 ? stackW : colW;
      const itemX =
        itemsInRow === 1 ? stackX : stackX + col * (colW + GAP);

      result[id] = {
        x: itemX,
        y: GAP + row * (rowH + GAP),
        w: itemW,
        h: rowH,
      };
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
      const rects = computeTiledLayout(openIds, viewport.w, viewport.h);
      const next = { ...prev };
      for (const id of openIds) {
        if (rects[id]) {
          next[id] = { ...next[id], rect: rects[id], isFloating: false };
        }
      }
      return next;
    });
  }, [viewport, tileOrder, retileKey]);

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
    (config: WindowConfig, content?: string) => {
      const existing = dynamicConfigs.find((c) => c.id === config.id);
      if (existing) {
        setStates((prev) => ({
          ...prev,
          [config.id]: { ...prev[config.id], isOpen: true },
        }));
        maxZRef.current++;
        setStates((prev) => ({
          ...prev,
          [config.id]: { ...prev[config.id], zIndex: maxZRef.current },
        }));
        triggerRetile();
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
      setTileOrder((prev) => [...prev, config.id]);
      triggerRetile();
    },
    [dynamicConfigs, triggerRetile],
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
    [focusWindow, tileOrder, viewport],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;

      const dx = e.clientX - d.startMouse.x;
      const dy = e.clientY - d.startMouse.y;

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
      if (d && swapTarget) {
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

      setStates((prev) => {
        const next = { ...prev };
        for (const id of Object.keys(next)) {
          if (next[id].isFloating) {
            next[id] = { ...next[id], isFloating: false };
          }
        }
        return next;
      });
      triggerRetile();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [swapTarget, triggerRetile]);

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
    toggleMaximize,
    focusWindow,
    startDrag,
    dragTarget,
    swapTarget,
  };
}
