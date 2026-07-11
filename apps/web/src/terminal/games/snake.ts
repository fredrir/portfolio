import type { TerminalStrings } from "../translations";
import type { TerminalGame } from "../types";

type Direction = "up" | "down" | "left" | "right";
type Point = { x: number; y: number };

const WIDTH = 20;
const HEIGHT = 20;

export class SnakeGame implements TerminalGame {
  id = "snake";
  private snake: Point[];
  private food: Point;
  private direction: Direction = "right";
  private nextDirection: Direction = "right";
  private score = 0;
  private gameOver = false;

  constructor(private t: TerminalStrings) {
    this.snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    this.food = this.spawnFood();
  }

  private spawnFood(): Point {
    let pos: Point;
    do {
      pos = {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
      };
    } while (this.snake.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
  }

  handleKey(key: string): void {
    if (this.gameOver) return;

    switch (key) {
      case "ArrowUp":
        if (this.direction !== "down") this.nextDirection = "up";
        break;
      case "ArrowDown":
        if (this.direction !== "up") this.nextDirection = "down";
        break;
      case "ArrowLeft":
        if (this.direction !== "right") this.nextDirection = "left";
        break;
      case "ArrowRight":
        if (this.direction !== "left") this.nextDirection = "right";
        break;
      case "tick":
        this.tick();
        break;
    }
  }

  private tick(): void {
    this.direction = this.nextDirection;
    const head = this.snake[0];
    const newHead = { ...head };

    switch (this.direction) {
      case "up":
        newHead.y--;
        break;
      case "down":
        newHead.y++;
        break;
      case "left":
        newHead.x--;
        break;
      case "right":
        newHead.x++;
        break;
    }

    if (
      newHead.x < 0 ||
      newHead.x >= WIDTH ||
      newHead.y < 0 ||
      newHead.y >= HEIGHT ||
      this.snake.some((s) => s.x === newHead.x && s.y === newHead.y)
    ) {
      this.gameOver = true;
      return;
    }

    this.snake.unshift(newHead);

    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score++;
      this.food = this.spawnFood();
    } else {
      this.snake.pop();
    }
  }

  render(): string {
    const lines: string[] = [];
    lines.push(`  ${this.t.score}: ${this.score}  |  ${this.t.arrowKeysToMove}, ${this.t.qToQuit}`);
    lines.push("┌" + "──".repeat(WIDTH) + "┐");

    for (let y = 0; y < HEIGHT; y++) {
      let row = "│";
      for (let x = 0; x < WIDTH; x++) {
        const isHead = this.snake[0].x === x && this.snake[0].y === y;
        const isBody = !isHead && this.snake.some((s) => s.x === x && s.y === y);
        const isFood = this.food.x === x && this.food.y === y;

        if (isHead) row += "O ";
        else if (isBody) row += "o ";
        else if (isFood) row += "* ";
        else row += "  ";
      }
      row += "│";
      lines.push(row);
    }

    lines.push("└" + "──".repeat(WIDTH) + "┘");

    if (this.gameOver) {
      lines.push(`  ${this.t.gameOverFinalScore}: ${this.score}`);
      lines.push(`  ${this.t.pressExit}`);
    }

    return lines.join("\n");
  }

  isFinished(): boolean {
    return this.gameOver;
  }

  getScore(): number {
    return this.score;
  }
}
