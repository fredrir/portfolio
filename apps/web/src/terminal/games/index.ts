import type { TerminalGame } from "../types";
import type { TerminalStrings } from "../translations";
import { Game2048 } from "./2048";
import { SnakeGame } from "./snake";

export function createGame(id: string, t: TerminalStrings): TerminalGame {
  switch (id) {
    case "snake":
      return new SnakeGame(t);
    case "2048":
      return new Game2048(t);
    default:
      throw new Error(`Unknown game: ${id}`);
  }
}
