import type { Dispatch, MutableRefObject, SetStateAction } from "react";

export type CellDef = string | string[];

export type LayoutTier = "large" | "medium" | "small";

export type PanePos = {
  row: number;
  col: number;
  sub: number | null;
};

export interface TierConfig {
  layout: CellDef[][];
  rowHeights: number[];
  colWidths: number[][];
}

export interface TilingState {
  layout: CellDef[][];
  rowHeights: number[];
  colWidths: number[][];
  setLayout: Dispatch<SetStateAction<CellDef[][]>>;
  setRowHeights: Dispatch<SetStateAction<number[]>>;
  setColWidths: Dispatch<SetStateAction<number[][]>>;
  onSwapRef: MutableRefObject<(() => void) | null>;
  onResizeRef: MutableRefObject<(() => void) | null>;
}

export interface DragResult {
  dragTarget: string | null;
  dragPos: { x: number; y: number } | null;
  dragSize: { w: number; h: number } | null;
  swapTarget: string | null;
  startTitleDrag: (id: string, e: React.MouseEvent) => void;
}

export interface ResizeResult {
  startRowResize: (dividerIndex: number, e: React.MouseEvent) => void;
  startColResize: (rowIndex: number, dividerIndex: number, e: React.MouseEvent) => void;
  startCornerResize: (rowIndex: number, colIndex: number, e: React.MouseEvent) => void;
}

export const STACK_HEIGHTS: Record<string, number[]> = {
  "about,spotify": [50, 50],
  "projects,settings": [45, 55],
};

export const DEFAULT_LAYOUT: CellDef[][] = [
  [["about", "spotify"], "projects", "github"],
  ["journey", "settings"],
  ["contact", "terminal"],
];

export const MEDIUM_LAYOUT: CellDef[][] = [
  [["about", "spotify"], "projects", "github"],
  [["journey", "settings"], "contact"],
];

export const SMALL_LAYOUT: CellDef[][] = [
  [
    ["about", "spotify"],
    ["projects", "settings"],
  ],
  ["journey", "contact"],
];

export const DEFAULT_ROW_HEIGHTS = [45, 24, 31];
export const MEDIUM_ROW_HEIGHTS = [55, 45];
export const SMALL_ROW_HEIGHTS = [50, 50];

export const DEFAULT_COL_WIDTHS: number[][] = [
  [28, 30, 42],
  [55, 45],
  [45, 55],
];

export const MEDIUM_COL_WIDTHS: number[][] = [
  [30, 30, 40],
  [55, 45],
];

export const SMALL_COL_WIDTHS: number[][] = [
  [40, 60],
  [50, 50],
];

export const LAYOUT_TIERS: Record<LayoutTier, TierConfig> = {
  large: {
    layout: DEFAULT_LAYOUT,
    rowHeights: DEFAULT_ROW_HEIGHTS,
    colWidths: DEFAULT_COL_WIDTHS,
  },
  medium: {
    layout: MEDIUM_LAYOUT,
    rowHeights: MEDIUM_ROW_HEIGHTS,
    colWidths: MEDIUM_COL_WIDTHS,
  },
  small: {
    layout: SMALL_LAYOUT,
    rowHeights: SMALL_ROW_HEIGHTS,
    colWidths: SMALL_COL_WIDTHS,
  },
};
