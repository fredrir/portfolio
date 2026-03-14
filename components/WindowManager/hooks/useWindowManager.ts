import { useState, useCallback, useEffect, useRef } from "react";
import { WINDOW_CONFIGS, GAP, STATUS_BAR_HEIGHT } from "../constants";
import type { WindowState, WindowStates, Rect } from "../types";

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

  const masterW = Math.floor((vw - GAP * 3) * 0.4);
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
      const itemW =
        itemsInRow === 1 ? stackW : colW;
      const itemX =
        itemsInRow === 1
          ? stackX
          : stackX + col * (colW + GAP);

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
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [viewport, setViewport] = useState({ w: 1920, h: 1080 });
  const maxZRef = useRef(100);
  const dragRef = useRef<{
    windowId: string;
    startMouse: { x: number; y: number };
    startRect: Rect;
    type: "drag" | "resize";
    edge?: string;
  } | null>(null);

  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const retile = useCallback(() => {
    setStates((prev) => {
      const openTiledIds = WINDOW_CONFIGS.filter(
        (c) => prev[c.id]?.isOpen && !prev[c.id]?.isFloating && !prev[c.id]?.isMaximized,
      )
        .sort((a, b) => a.order - b.order)
        .map((c) => c.id);

      const rects = computeTiledLayout(
        openTiledIds,
        viewport.w,
        viewport.h,
      );

      const next = { ...prev };
      for (const id of openTiledIds) {
        if (rects[id]) {
          next[id] = { ...next[id], rect: rects[id] };
        }
      }
      return next;
    });
  }, [viewport]);

  useEffect(() => {
    retile();
  }, [retile]);

  const openWindow = useCallback(
    (id: string) => {
      setStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: true, isFloating: false, isMaximized: false },
      }));
      setTimeout(retile, 0);
    },
    [retile],
  );

  const closeWindow = useCallback(
    (id: string) => {
      setStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: false },
      }));
      setTimeout(retile, 0);
    },
    [retile],
  );

  const toggleMaximize = useCallback((id: string) => {
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
    setTimeout(retile, 0);
  }, [viewport, retile]);

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
      focusWindow(id);

      setStates((prev) => {
        const ws = prev[id];
        if (!ws) return prev;
        dragRef.current = {
          windowId: id,
          startMouse: { x: e.clientX, y: e.clientY },
          startRect: { ...ws.rect },
          type: "drag",
        };
        maxZRef.current++;
        return {
          ...prev,
          [id]: {
            ...ws,
            isFloating: true,
            isMaximized: false,
            zIndex: maxZRef.current,
          },
        };
      });
    },
    [focusWindow],
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
          type: "resize",
          edge,
        };
        return prev;
      });
    },
    [focusWindow],
  );

  const tileWindow = useCallback(
    (id: string) => {
      setStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isFloating: false, isMaximized: false },
      }));
      setTimeout(retile, 0);
    },
    [retile],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;

      const dx = e.clientX - d.startMouse.x;
      const dy = e.clientY - d.startMouse.y;

      if (d.type === "drag") {
        setStates((prev) => ({
          ...prev,
          [d.windowId]: {
            ...prev[d.windowId],
            rect: {
              ...prev[d.windowId].rect,
              x: d.startRect.x + dx,
              y: d.startRect.y + dy,
            },
          },
        }));
      } else if (d.type === "resize") {
        setStates((prev) => {
          const ws = prev[d.windowId];
          if (!ws) return prev;
          const r = { ...d.startRect };
          const edge = d.edge || "";
          const minW = 200;
          const minH = 120;

          if (edge.includes("e")) r.w = Math.max(minW, r.w + dx);
          if (edge.includes("s")) r.h = Math.max(minH, r.h + dy);
          if (edge.includes("w")) {
            const newW = Math.max(minW, r.w - dx);
            r.x = r.x + (r.w - newW);
            r.w = newW;
          }
          if (edge.includes("n")) {
            const newH = Math.max(minH, r.h - dy);
            r.y = r.y + (r.h - newH);
            r.h = newH;
          }

          return {
            ...prev,
            [d.windowId]: { ...ws, rect: r },
          };
        });
      }
    };

    const onMouseUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
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

  return {
    states,
    viewport,
    launcherOpen,
    setLauncherOpen,
    openWindow,
    closeWindow,
    toggleMaximize,
    focusWindow,
    startDrag,
    startResize,
    tileWindow,
  };
}
