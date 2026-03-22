import { LAYOUT_TIERS } from "./types";
import type { CellDef, LayoutTier, PanePos, TierConfig } from "./types";
import type { WindowStates } from "../types";

export class LayoutEngine {
  static getTier(width: number): LayoutTier {
    if (width >= 1280) return "large";
    if (width >= 1024) return "medium";
    return "small";
  }

  static getTierConfig(tier: LayoutTier): TierConfig {
    return LAYOUT_TIERS[tier];
  }

  static getCellPanes(cell: CellDef): string[] {
    return Array.isArray(cell) ? cell : [cell];
  }

  static findPane(layout: CellDef[][], paneId: string): PanePos | null {
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

  static swapPanes(layout: CellDef[][], a: string, b: string): CellDef[][] {
    const posA = this.findPane(layout, a);
    const posB = this.findPane(layout, b);
    if (!posA || !posB) return layout;
    if (posA.row === posB.row && posA.col === posB.col && posA.sub === posB.sub)
      return layout;

    const next = this.cloneLayout(layout);

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

  static cloneLayout(layout: CellDef[][]): CellDef[][] {
    return layout.map((row) =>
      row.map((cell) => (Array.isArray(cell) ? [...cell] : cell)),
    );
  }

  static addPaneRow(
    layout: CellDef[][],
    id: string,
    rowHeights: number[],
    colWidths: number[][],
  ): { layout: CellDef[][]; rowHeights: number[]; colWidths: number[][] } {
    const next = this.cloneLayout(layout);
    const share = 25;
    const scaled = rowHeights.map((h) => (h * (100 - share)) / 100);
    return {
      layout: [...next, [id]],
      rowHeights: [...scaled, share],
      colWidths: [...colWidths, [100]],
    };
  }

  static getVisibleLayout(
    layout: CellDef[][],
    states: WindowStates,
  ): CellDef[][] {
    return layout
      .map((row) =>
        row.filter((cell) =>
          this.getCellPanes(cell).some((id) => states[id]?.isOpen),
        ),
      )
      .filter((row) => row.length > 0);
  }

  static closePanesNotInLayout(
    states: WindowStates,
    layout: CellDef[][],
  ): WindowStates {
    const layoutPanes = new Set(
      layout.flat().flatMap((c) => this.getCellPanes(c)),
    );
    const next = { ...states };
    for (const id of Object.keys(next)) {
      if (!layoutPanes.has(id) && next[id].isOpen) {
        next[id] = { ...next[id], isOpen: false };
      }
    }
    return next;
  }
}
