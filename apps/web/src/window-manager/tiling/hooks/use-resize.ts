import { useCallback } from "react";
import type { ResizeResult, TilingState } from "../types";

const MIN_SIZE = 10;

function resizePair(values: number[], firstIndex: number, secondIndex: number, delta: number) {
  if (
    firstIndex === secondIndex ||
    values[firstIndex] === undefined ||
    values[secondIndex] === undefined
  ) {
    return values;
  }

  const next = [...values];
  const total = values[firstIndex] + values[secondIndex];
  const min = Math.min(MIN_SIZE, total / 2);
  const first = Math.min(Math.max(values[firstIndex] + delta, min), total - min);
  next[firstIndex] = first;
  next[secondIndex] = total - first;
  return next;
}

export function useResize(tiling: TilingState): ResizeResult {
  const startRowResize = useCallback(
    (topRowIndex: number, bottomRowIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeights = [...tiling.rowHeights];
      const totalHeight = window.innerHeight - 28;

      const onMouseMove = (ev: MouseEvent) => {
        const dy = ev.clientY - startY;
        const dyPercent = (dy / totalHeight) * 100;
        tiling.setRowHeights(resizePair(startHeights, topRowIndex, bottomRowIndex, dyPercent));
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        tiling.onResizeRef.current?.();
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [tiling],
  );

  const startColResize = useCallback(
    (rowIndex: number, leftColIndex: number, rightColIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidths = tiling.colWidths.map((r) => [...r]);
      const totalWidth = window.innerWidth;

      const onMouseMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dxPercent = (dx / totalWidth) * 100;
        const newW = startWidths.map((r) => [...r]);
        if (!newW[rowIndex]) return;
        newW[rowIndex] = resizePair(startWidths[rowIndex], leftColIndex, rightColIndex, dxPercent);
        tiling.setColWidths(newW);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        tiling.onResizeRef.current?.();
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [tiling],
  );

  const startCornerResize = useCallback(
    (
      rowIndex: number,
      colIndex: number,
      e: React.MouseEvent,
      nextRowIndex?: number,
      nextColIndex?: number,
    ) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startHeights = [...tiling.rowHeights];
      const startWidths = tiling.colWidths.map((r) => [...r]);
      const totalHeight = window.innerHeight - 28;
      const totalWidth = window.innerWidth;

      const onMouseMove = (ev: MouseEvent) => {
        const dy = ev.clientY - startY;
        const dyPercent = (dy / totalHeight) * 100;
        if (nextRowIndex !== undefined) {
          tiling.setRowHeights(resizePair(startHeights, rowIndex, nextRowIndex, dyPercent));
        }

        const dx = ev.clientX - startX;
        const dxPercent = (dx / totalWidth) * 100;
        if (nextColIndex !== undefined) {
          const newW = startWidths.map((r) => [...r]);
          if (newW[rowIndex]) {
            newW[rowIndex] = resizePair(startWidths[rowIndex], colIndex, nextColIndex, dxPercent);
          }
          tiling.setColWidths(newW);
        }
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        tiling.onResizeRef.current?.();
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [tiling],
  );

  return { startRowResize, startColResize, startCornerResize };
}
