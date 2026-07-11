import { useTilingContext } from "../index";
import type { VisibleRow } from "../types";
import { TilingCell } from "./tiling-cell";

interface Props {
  visibleLayout: VisibleRow[];
  rowHeights: number[];
  colWidths: number[][];
}

export function TilingGrid({ visibleLayout, rowHeights, colWidths }: Props) {
  const { resize } = useTilingContext();

  return (
    <>
      {visibleLayout.map((row, ri) => {
        const h = rowHeights[row.sourceRow] ?? 100 / visibleLayout.length;
        const nextRow = visibleLayout[ri + 1];

        return (
          <div key={row.sourceRow} className="contents">
            <div className="flex shrink-0" style={{ flex: `${h} 0 0%`, gap: 0, minHeight: 0 }}>
              {row.cells.map(({ cell, sourceCol }, ci) => {
                const w = colWidths[row.sourceRow]?.[sourceCol] ?? 1;
                const key = Array.isArray(cell) ? cell.join(",") : cell;
                const nextCell = row.cells[ci + 1];

                return (
                  <div key={`${sourceCol}:${key}`} className="contents">
                    <div className="flex min-h-0 min-w-0" style={{ flex: `${w} 0 0%` }}>
                      <TilingCell
                        cell={cell}
                        rowIndex={row.sourceRow}
                        colIndex={sourceCol}
                        nextRowIndex={nextRow?.sourceRow}
                        nextColIndex={nextCell?.sourceCol}
                      />
                    </div>
                    {nextCell && (
                      <div
                        className="group relative z-10 w-2.5 shrink-0 cursor-col-resize"
                        onMouseDown={(e) =>
                          resize.startColResize(row.sourceRow, sourceCol, nextCell.sourceCol, e)
                        }
                      >
                        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-control-border-hover opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {nextRow && (
              <div
                className="group relative z-10 h-2.5 shrink-0 cursor-row-resize"
                onMouseDown={(e) => resize.startRowResize(row.sourceRow, nextRow.sourceRow, e)}
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
