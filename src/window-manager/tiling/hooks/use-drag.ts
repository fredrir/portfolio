import { useState, useCallback, useRef } from "react";
import { LayoutEngine } from "../layout-engine";
import type { TilingState, DragResult } from "../types";

export function useDrag(tiling: TilingState): DragResult {
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragSize, setDragSize] = useState<{ w: number; h: number } | null>(null);
  const [swapTarget, setSwapTarget] = useState<string | null>(null);
  const swapTargetRef = useRef<string | null>(null);

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
          tiling.setLayout((prev) =>
            LayoutEngine.swapPanes(prev, paneId, dropTarget),
          );
          tiling.onSwapRef.current?.();
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
    [tiling],
  );

  return { dragTarget, dragPos, dragSize, swapTarget, startTitleDrag };
}
