import type { TerminalGame } from "../types";
import { SnakeGame } from "./snake";
import { Game2048 } from "./2048";

export function createGame(id: string): TerminalGame {
  switch (id) {
    case "snake":
      return new SnakeGame();
    case "2048":
      return new Game2048();
    default:
      throw new Error(`Unknown game: ${id}`);
  }
}
