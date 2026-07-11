import { GAP } from "../../constants";
import { STACK_HEIGHTS } from "../types";
import { useTilingContext } from "../index";
import { TilingPane } from "./tiling-pane";
import type { CellDef } from "../types";

interface Props {
  cell: CellDef;
  rowIndex: number;
  colIndex: number;
}

export function TilingCell({ cell, rowIndex, colIndex }: Props) {
  const { states } = useTilingContext();

  if (!Array.isArray(cell)) {
    return (
      <TilingPane paneId={cell} rowIndex={rowIndex} colIndex={colIndex} />
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
      />
    );
  }

  const heightKey = cell.join(",");
  const heights = STACK_HEIGHTS[heightKey];

  return (
    <div className="flex-1 min-w-0 flex flex-col" style={{ gap: GAP }}>
      {visible.map((id) => {
        const h = heights?.[cell.indexOf(id)];
        return (
          <div
            key={id}
            className="flex min-h-0"
            style={{ flex: `${h ?? 1} 0 0%` }}
          >
            <TilingPane paneId={id} rowIndex={rowIndex} colIndex={colIndex} />
          </div>
        );
      })}
    </div>
  );
}
