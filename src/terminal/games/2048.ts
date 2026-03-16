import type { TerminalGame } from "../types";

const SIZE = 4;

export class Game2048 implements TerminalGame {
  id = "2048";
  private grid: number[][];
  private score = 0;
  private won = false;
  private lost = false;

  constructor() {
    this.grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    this.addTile();
    this.addTile();
  }

  private addTile(): void {
    const empty: { r: number; c: number }[] = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.grid[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  private slide(row: number[]): { result: number[]; merged: number } {
    const filtered = row.filter((v) => v !== 0);
    let merged = 0;
    const result: number[] = [];

    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const val = filtered[i] * 2;
        result.push(val);
        merged += val;
        if (val === 2048) this.won = true;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < SIZE) result.push(0);
    return { result, merged };
  }

  private move(direction: string): boolean {
    let moved = false;
    let totalMerged = 0;

    const getRow = (i: number): number[] => {
      switch (direction) {
        case "left": return [...this.grid[i]];
        case "right": return [...this.grid[i]].reverse();
        case "up": return this.grid.map((r) => r[i]);
        case "down": return this.grid.map((r) => r[i]).reverse();
        default: return [];
      }
    };

    const setRow = (i: number, row: number[]) => {
      switch (direction) {
        case "left":
          this.grid[i] = row;
          break;
        case "right":
          this.grid[i] = row.reverse();
          break;
        case "up":
          for (let r = 0; r < SIZE; r++) this.grid[r][i] = row[r];
          break;
        case "down":
          row.reverse();
          for (let r = 0; r < SIZE; r++) this.grid[r][i] = row[r];
          break;
      }
    };

    for (let i = 0; i < SIZE; i++) {
      const original = getRow(i);
      const { result, merged } = this.slide(original);
      totalMerged += merged;

      if (original.some((v, j) => v !== result[j])) {
        moved = true;
      }
      setRow(i, result);
    }

    this.score += totalMerged;
    return moved;
  }

  private hasMovesLeft(): boolean {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.grid[r][c] === 0) return true;
        if (c < SIZE - 1 && this.grid[r][c] === this.grid[r][c + 1]) return true;
        if (r < SIZE - 1 && this.grid[r][c] === this.grid[r + 1][c]) return true;
      }
    }
    return false;
  }

  handleKey(key: string): void {
    if (this.won || this.lost) return;

    let dir: string | null = null;
    switch (key) {
      case "ArrowUp": dir = "up"; break;
      case "ArrowDown": dir = "down"; break;
      case "ArrowLeft": dir = "left"; break;
      case "ArrowRight": dir = "right"; break;
    }

    if (!dir) return;

    const moved = this.move(dir);
    if (moved) {
      this.addTile();
      if (!this.hasMovesLeft()) {
        this.lost = true;
      }
    }
  }

  render(): string {
    const lines: string[] = [];
    lines.push(`  Score: ${this.score}  |  Arrow keys to move, q to quit`);
    lines.push("");

    const cellWidth = 6;
    const hLine = "─".repeat(cellWidth);
    lines.push("┌" + Array(SIZE).fill(hLine).join("┬") + "┐");

    for (let r = 0; r < SIZE; r++) {
      let row = "│";
      for (let c = 0; c < SIZE; c++) {
        const val = this.grid[r][c];
        const str = val === 0 ? "" : String(val);
        row += str.padStart(Math.ceil((cellWidth + str.length) / 2)).padEnd(cellWidth) + "│";
      }
      lines.push(row);
      if (r < SIZE - 1) {
        lines.push("├" + Array(SIZE).fill(hLine).join("┼") + "┤");
      }
    }

    lines.push("└" + Array(SIZE).fill(hLine).join("┴") + "┘");

    if (this.won) {
      lines.push(`  You win! Score: ${this.score}`);
      lines.push("  Press q or Escape to exit.");
    } else if (this.lost) {
      lines.push(`  No moves left! Score: ${this.score}`);
      lines.push("  Press q or Escape to exit.");
    }

    return lines.join("\n");
  }

  isFinished(): boolean {
    return this.won || this.lost;
  }

  getScore(): number {
    return this.score;
  }
}
