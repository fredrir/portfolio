import { configMap } from "../../constants";
import { Window } from "../../shell/components/window";
import { useTilingContext } from "../index";

interface Props {
  paneId: string;
  rowIndex?: number;
  colIndex?: number;
}

export function TilingPane({ paneId, rowIndex, colIndex }: Props) {
  const { states, focusedId, paneContent, drag, resize, onClose, onMaximize, onFocus } =
    useTilingContext();

  const config = configMap[paneId];
  if (!config || !states[paneId]?.isOpen) return null;
  const isFocused = focusedId === paneId;

  return (
    <Window
      key={paneId}
      config={config}
      isFocused={isFocused}
      isSwapTarget={drag.swapTarget === paneId}
      isDragging={drag.dragTarget === paneId}
      showResizeGrip={isFocused && rowIndex !== undefined && colIndex !== undefined}
      onClose={() => onClose(paneId)}
      onMaximize={() => onMaximize(paneId)}
      onFocus={() => onFocus(paneId)}
      onTitleMouseDown={drag.startTitleDrag}
      onCornerResize={
        rowIndex !== undefined && colIndex !== undefined
          ? (e) => resize.startCornerResize(rowIndex, colIndex, e)
          : undefined
      }
    >
      {paneContent[paneId]}
    </Window>
  );
}
