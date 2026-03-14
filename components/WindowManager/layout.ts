export type CellDef = string | string[];

export const DEFAULT_LAYOUT: CellDef[][] = [
  [["about", "spotify"], "projects", "github"],
  ["journey", "settings"],
  ["contact", "terminal"],
];

export const DEFAULT_ROW_HEIGHTS = [50, 24, 26];

export const DEFAULT_COL_WIDTHS: number[][] = [
  [28, 30, 42],
  [55, 45],
  [45, 55],
];

export const STACK_HEIGHTS: Record<string, number[]> = {
  "about,spotify": [70, 30],
};

export function getCellPanes(cell: CellDef): string[] {
  return Array.isArray(cell) ? cell : [cell];
}

export type PanePos = {
  row: number;
  col: number;
  sub: number | null;
};

export function findPane(
  layout: CellDef[][],
  paneId: string,
): PanePos | null {
  for (let r = 0; r < layout.length; r++) {
    for (let c = 0; c < layout[r].length; c++) {
      const cell = layout[r][c];
      if (Array.isArray(cell)) {
        const idx = cell.indexOf(paneId);
        if (idx !== -1) return { row: r, col: c, sub: idx };
      } else if (cell === paneId) {
        return { row: r, col: c, sub: null };
      }
    }
  }
  return null;
}

export function swapPanesInLayout(
  layout: CellDef[][],
  a: string,
  b: string,
): CellDef[][] {
  const posA = findPane(layout, a);
  const posB = findPane(layout, b);
  if (!posA || !posB) return layout;
  if (
    posA.row === posB.row &&
    posA.col === posB.col &&
    posA.sub === posB.sub
  )
    return layout;

  const next: CellDef[][] = layout.map((row) =>
    row.map((cell) => (Array.isArray(cell) ? [...cell] : cell)),
  );

  if (posA.sub !== null) {
    (next[posA.row][posA.col] as string[])[posA.sub] = b;
  } else {
    next[posA.row][posA.col] = b;
  }

  if (posB.sub !== null) {
    (next[posB.row][posB.col] as string[])[posB.sub] = a;
  } else {
    next[posB.row][posB.col] = a;
  }

  return next;
}
