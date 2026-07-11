import { useTilingContext } from "../index";
import type { CellDef } from "../types";
import { TilingCell } from "./tiling-cell";

interface Props {
  visibleLayout: CellDef[][];
  rowHeights: number[];
  colWidths: number[][];
}

export function TilingGrid({ visibleLayout, rowHeights, colWidths }: Props) {
  const { resize } = useTilingContext();

  return (
    <>
      {visibleLayout.map((row, ri) => {
        const h = rowHeights[ri] ?? 100 / visibleLayout.length;
        return (
          <div key={ri} className="contents">
            <div className="flex shrink-0" style={{ flex: `${h} 0 0%`, gap: 0, minHeight: 0 }}>
              {row.map((cell, ci) => {
                const w = colWidths[ri]?.[ci] ?? 1;
                const key = Array.isArray(cell) ? cell.join(",") : cell;
                return (
                  <div key={key} className="contents">
                    <div className="flex min-h-0 min-w-0" style={{ flex: `${w} 0 0%` }}>
                      <TilingCell cell={cell} rowIndex={ri} colIndex={ci} />
                    </div>
                    {ci < row.length - 1 && (
                      <div
                        className="group relative z-10 w-2.5 shrink-0 cursor-col-resize"
                        onMouseDown={(e) => resize.startColResize(ri, ci, e)}
                      >
                        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-control-border-hover opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {ri < visibleLayout.length - 1 && (
              <div
                className="group relative z-10 h-2.5 shrink-0 cursor-row-resize"
                onMouseDown={(e) => resize.startRowResize(ri, e)}
              >
                <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-control-border-hover opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
