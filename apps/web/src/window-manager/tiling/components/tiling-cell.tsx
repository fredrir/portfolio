import { GAP } from "../../constants";
import { useTilingContext } from "../index";
import type { CellDef } from "../types";
import { STACK_HEIGHTS } from "../types";
import { TilingPane } from "./tiling-pane";

interface Props {
  cell: CellDef;
  rowIndex: number;
  colIndex: number;
  nextRowIndex?: number;
  nextColIndex?: number;
}

export function TilingCell({ cell, rowIndex, colIndex, nextRowIndex, nextColIndex }: Props) {
  const { states } = useTilingContext();

  if (!Array.isArray(cell)) {
    return (
      <TilingPane
        paneId={cell}
        rowIndex={rowIndex}
        colIndex={colIndex}
        nextRowIndex={nextRowIndex}
        nextColIndex={nextColIndex}
      />
    );
  }

  const visible = cell.filter((id) => states[id]?.isOpen);
  if (visible.length === 0) return null;
  if (visible.length === 1) {
    return (
      <TilingPane
        paneId={visible[0]}
        rowIndex={rowIndex}
        colIndex={colIndex}
        nextRowIndex={nextRowIndex}
        nextColIndex={nextColIndex}
      />
    );
  }

  const heightKey = cell.join(",");
  const heights = STACK_HEIGHTS[heightKey];

  return (
    <div className="flex min-w-0 flex-1 flex-col" style={{ gap: GAP }}>
      {visible.map((id) => {
        const h = heights?.[cell.indexOf(id)];
        return (
          <div key={id} className="flex min-h-0" style={{ flex: `${h ?? 1} 0 0%` }}>
            <TilingPane
              paneId={id}
              rowIndex={rowIndex}
              colIndex={colIndex}
              nextRowIndex={nextRowIndex}
              nextColIndex={nextColIndex}
            />
          </div>
        );
      })}
    </div>
  );
}
