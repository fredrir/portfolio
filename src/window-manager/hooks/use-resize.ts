import { useCallback } from "react";

export function useResize(
  rowHeights: number[],
  colWidths: number[][],
  setRowHeights: React.Dispatch<React.SetStateAction<number[]>>,
  setColWidths: React.Dispatch<React.SetStateAction<number[][]>>,
  onResizeRef: React.MutableRefObject<(() => void) | null>,
) {
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
        newH[dividerIndex + 1] = Math.max(10, startHeights[dividerIndex + 1] - dyPercent);
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
        newW[rowIndex][dividerIndex] = Math.max(10, startWidths[rowIndex][dividerIndex] + dxPercent);
        newW[rowIndex][dividerIndex + 1] = Math.max(10, startWidths[rowIndex][dividerIndex + 1] - dxPercent);
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

  return { startRowResize, startColResize, startCornerResize };
}
