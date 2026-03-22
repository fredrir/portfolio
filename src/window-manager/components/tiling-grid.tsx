import { Window } from "./window";
import { configMap, GAP } from "../constants";
import { STACK_HEIGHTS } from "../layout";
import type { CellDef } from "../layout";
import type { WindowStates } from "../types";

interface Props {
  visibleLayout: CellDef[][];
  rowHeights: number[];
  colWidths: number[][];
  states: WindowStates;
  focusedId: string | null;
  paneContent: Record<string, React.ReactNode>;
  swapTarget: string | null;
  dragTarget: string | null;
  onTitleMouseDown: (id: string, e: React.MouseEvent) => void;
  onCornerResize: (rowIndex: number, colIndex: number, e: React.MouseEvent) => void;
  onColResize: (rowIndex: number, colIndex: number, e: React.MouseEvent) => void;
  onRowResize: (rowIndex: number, e: React.MouseEvent) => void;
  onClose: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
}

function TilingPane({
  paneId,
  states,
  focusedId,
  paneContent,
  swapTarget,
  dragTarget,
  rowIndex,
  colIndex,
  onTitleMouseDown,
  onCornerResize,
  onClose,
  onMaximize,
  onFocus,
}: {
  paneId: string;
  states: WindowStates;
  focusedId: string | null;
  paneContent: Record<string, React.ReactNode>;
  swapTarget: string | null;
  dragTarget: string | null;
  rowIndex?: number;
  colIndex?: number;
  onTitleMouseDown: (id: string, e: React.MouseEvent) => void;
  onCornerResize: (rowIndex: number, colIndex: number, e: React.MouseEvent) => void;
  onClose: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
}) {
  const config = configMap[paneId];
  if (!config || !states[paneId]?.isOpen) return null;
  const isFocused = focusedId === paneId;
  return (
    <Window
      key={paneId}
      config={config}
      state={states[paneId]}
      isFocused={isFocused}
      isSwapTarget={swapTarget === paneId}
      isDragging={dragTarget === paneId}
      showResizeGrip={
        isFocused && rowIndex !== undefined && colIndex !== undefined
      }
      onClose={() => onClose(paneId)}
      onMaximize={() => onMaximize(paneId)}
      onFocus={() => onFocus(paneId)}
      onTitleMouseDown={onTitleMouseDown}
      onCornerResize={
        rowIndex !== undefined && colIndex !== undefined
          ? (e) => onCornerResize(rowIndex, colIndex, e)
          : undefined
      }
    >
      {paneContent[paneId]}
    </Window>
  );
}

function TilingCell({
  cell,
  rowIndex,
  colIndex,
  ...rest
}: {
  cell: CellDef;
  rowIndex: number;
  colIndex: number;
} & Omit<
  React.ComponentProps<typeof TilingPane>,
  "paneId" | "rowIndex" | "colIndex"
>) {
  if (!Array.isArray(cell)) {
    return (
      <TilingPane
        paneId={cell}
        rowIndex={rowIndex}
        colIndex={colIndex}
        {...rest}
      />
    );
  }

  const visible = cell.filter((id) => rest.states[id]?.isOpen);
  if (visible.length === 0) return null;
  if (visible.length === 1) {
    return (
      <TilingPane
        paneId={visible[0]}
        rowIndex={rowIndex}
        colIndex={colIndex}
        {...rest}
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
            <TilingPane
              paneId={id}
              rowIndex={rowIndex}
              colIndex={colIndex}
              {...rest}
            />
          </div>
        );
      })}
    </div>
  );
}

export function TilingGrid({
  visibleLayout,
  rowHeights,
  colWidths,
  onColResize,
  onRowResize,
  ...cellProps
}: Props) {
  return (
    <>
      {visibleLayout.map((row, ri) => {
        const h = rowHeights[ri] ?? 100 / visibleLayout.length;
        return (
          <div key={ri} className="contents">
            <div
              className="flex shrink-0"
              style={{ flex: `${h} 0 0%`, gap: 0, minHeight: 0 }}
            >
              {row.map((cell, ci) => {
                const w = colWidths[ri]?.[ci] ?? 1;
                const key = Array.isArray(cell) ? cell.join(",") : cell;
                return (
                  <div key={key} className="contents">
                    <div
                      className="min-w-0 flex min-h-0"
                      style={{ flex: `${w} 0 0%` }}
                    >
                      <TilingCell
                        cell={cell}
                        rowIndex={ri}
                        colIndex={ci}
                        {...cellProps}
                      />
                    </div>
                    {ci < row.length - 1 && (
                      <div
                        className="w-2.5 shrink-0 cursor-col-resize relative z-10 group"
                        onMouseDown={(e) => onColResize(ri, ci, e)}
                      >
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 bg-control-border-hover transition-opacity" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {ri < visibleLayout.length - 1 && (
              <div
                className="h-2.5 shrink-0 cursor-row-resize relative z-10 group"
                onMouseDown={(e) => onRowResize(ri, e)}
              >
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full opacity-0 group-hover:opacity-100 bg-control-border-hover transition-opacity" />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
