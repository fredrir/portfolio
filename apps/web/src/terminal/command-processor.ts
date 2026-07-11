import { FileSystemManager } from "./file-system";
import { computeUptime, getNeofetchPlainText } from "@/terminal/neofetch";
import { PORTFOLIO_VERSION, MY_NAME } from "@/lib/constants";
import type { CommandResult, FileSystemConfig } from "./types";
import { getTerminalStrings, type TerminalStrings } from "./translations";

interface CommandDef {
  name: string;
  descKey: keyof TerminalStrings;
}

const COMMANDS: CommandDef[] = [
  { name: "help", descKey: "helpDesc" },
  { name: "neofetch", descKey: "neofetchDesc" },
  { name: "ls [path]", descKey: "lsDesc" },
  { name: "cd <path>", descKey: "cdDesc" },
  { name: "pwd", descKey: "pwdDesc" },
  { name: "cat <file>", descKey: "catDesc" },
  { name: "clear", descKey: "clearDesc" },
  { name: "whoami", descKey: "whoamiDesc" },
  { name: "date", descKey: "dateDesc" },
  { name: "echo <text>", descKey: "echoDesc" },
  { name: "tree", descKey: "treeDesc" },
  { name: "about", descKey: "aboutDesc" },
  { name: "uname", descKey: "unameDesc" },
  { name: "uptime", descKey: "uptimeDesc" },
  { name: "open <pane>", descKey: "openDesc" },
  { name: "close <pane>", descKey: "closeDesc" },
  { name: "snake", descKey: "snakeDesc" },
  { name: "2048", descKey: "game2048Desc" },
  { name: "fract [zoom]", descKey: "fractDesc" },
];

export const COMMAND_NAMES = COMMANDS.map((c) => c.name.split(" ")[0]);

export class CommandProcessor {
  private fileSystemManager: FileSystemManager;
  private paneIds: string[];
  private isStandalone: boolean;
  private t: TerminalStrings;

  constructor(
    config?: FileSystemConfig,
    isStandalone = false,
    locale?: string,
  ) {
    this.fileSystemManager = new FileSystemManager(config);
    this.paneIds = config?.paneIds ?? [];
    this.isStandalone = isStandalone;
    this.t = getTerminalStrings(locale);
  }

  get fs(): FileSystemManager {
    return this.fileSystemManager;
  }

  processCommand(command: string, currentPath: string): CommandResult {
    const [cmd, ...args] = command.trim().split(" ");

    switch (cmd.toLowerCase()) {
      case "help": {
        const maxLen = Math.max(...COMMANDS.map((c) => c.name.length));
        const lines = COMMANDS.map(
          (c) => `  ${c.name.padEnd(maxLen + 2)} ${this.t[c.descKey]}`,
        );
        return {
          output: {
            command,
            output: this.t.availableCommands + "\n" + lines.join("\n"),
          },
        };
      }

      case "neofetch":
        return {
          output: {
            command,
            output: getNeofetchPlainText(),
          },
        };

      case "ls":
        return this.handleLsCommand(command, args, currentPath);

      case "cd":
        return this.handleCdCommand(command, args, currentPath);

      case "pwd":
        return {
          output: { command, output: currentPath },
        };

      case "cat":
        return this.handleCatCommand(command, args, currentPath);

      case "clear":
        return {
          output: { command, output: "" },
        };

      case "whoami":
        return {
          output: { command, output: "fredrir" },
        };

      case "date":
        return {
          output: { command, output: new Date().toString() },
        };

      case "echo":
        return {
          output: { command, output: args.join(" ") },
        };

      case "tree":
        return this.handleTreeCommand(command, currentPath);

      case "about":
        return {
          output: {
            command,
            output: `fredrir v${PORTFOLIO_VERSION}
Built with Next.js + Tailwind
Type 'help' for available commands
Repository: https://github.com/fredrir/portfolio
Author: ${MY_NAME}`,
          },
        };

      case "uname": {
        const unameFlag = args[0];
        let unameOutput = `fredrir ${PORTFOLIO_VERSION}`;
        if (unameFlag === "-a") {
          unameOutput = `fredrir fredrir-terminal ${PORTFOLIO_VERSION} #1 SMP Web Browser x86_64 GNU/Linux`;
        } else if (unameFlag === "-r") {
          unameOutput = "1.0.0";
        } else if (unameFlag === "-m") {
          unameOutput = "x86_64";
        }
        return {
          output: { command, output: unameOutput },
        };
      }

      case "uptime":
        return {
          output: {
            command,
            output: `up ${computeUptime()}`,
          },
        };

      case "open":
        return this.handleOpenCommand(command, args);

      case "close":
        return this.handleCloseCommand(command, args);

      case "fract": {
        return {
          output: { command, output: this.t.runningFract },
          action: { type: "wasmPlugin", payload: `fract ${args.join(" ")}`.trim() },
        };
      }

      case "snake":
        if (this.isStandalone) {
          return {
            output: { command, output: this.t.wmOnly, isError: true },
          };
        }
        return {
          output: { command, output: this.t.startingSnake },
          action: { type: "startGame", payload: "snake" },
        };

      case "2048":
        if (this.isStandalone) {
          return {
            output: { command, output: this.t.wmOnly, isError: true },
          };
        }
        return {
          output: { command, output: this.t.starting2048 },
          action: { type: "startGame", payload: "2048" },
        };

      default:
        return {
          output: {
            command,
            output: `zsh: ${this.t.commandNotFound}: ${cmd}`,
            isError: true,
          },
        };
    }
  }

  private handleOpenCommand(command: string, args: string[]): CommandResult {
    if (this.isStandalone) {
      return {
        output: { command, output: this.t.wmOnlyOpenClose, isError: true },
      };
    }

    if (!args[0]) {
      return {
        output: {
          command,
          output: `${this.t.usageOpen}\n${this.t.available}: ${this.paneIds.join(", ")}`,
          isError: true,
        },
      };
    }

    const paneId = args[0].toLowerCase();
    if (!this.paneIds.includes(paneId)) {
      return {
        output: {
          command,
          output: `${this.t.unknownPane}: ${paneId}\n${this.t.available}: ${this.paneIds.join(", ")}`,
          isError: true,
        },
      };
    }

    return {
      output: { command, output: `${this.t.opening} ${paneId}...` },
      action: { type: "openPane", payload: paneId },
    };
  }

  private handleCloseCommand(command: string, args: string[]): CommandResult {
    if (this.isStandalone) {
      return {
        output: { command, output: this.t.wmOnlyOpenClose, isError: true },
      };
    }

    if (!args[0]) {
      return {
        output: {
          command,
          output: `${this.t.usageClose}\n${this.t.available}: ${this.paneIds.join(", ")}`,
          isError: true,
        },
      };
    }

    const paneId = args[0].toLowerCase();
    if (!this.paneIds.includes(paneId)) {
      return {
        output: {
          command,
          output: `${this.t.unknownPane}: ${paneId}\n${this.t.available}: ${this.paneIds.join(", ")}`,
          isError: true,
        },
      };
    }

    if (paneId === "terminal") {
      return {
        output: {
          command,
          output: this.t.cannotCloseTerminal,
          isError: true,
        },
      };
    }

    return {
      output: { command, output: `${this.t.closing} ${paneId}...` },
      action: { type: "closePane", payload: paneId },
    };
  }

  private handleLsCommand(
    command: string,
    args: string[],
    currentPath: string,
  ): CommandResult {
    try {
      const lsPath = args[0]
        ? this.fileSystemManager.resolvePath(args[0], currentPath)
        : currentPath;
      const output = this.fileSystemManager.listDirectory(lsPath);
      return {
        output: { command, output },
      };
    } catch (error) {
      return {
        output: {
          command,
          output: `ls: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          isError: true,
        },
      };
    }
  }

  private handleCdCommand(
    command: string,
    args: string[],
    currentPath: string,
  ): CommandResult {
    if (!args[0] || args[0] === "~") {
      return {
        output: { command, output: "" },
        newPath: "/home/fredrik",
      };
    }

    try {
      const newPath = this.fileSystemManager.resolvePath(args[0], currentPath);
      if (!this.fileSystemManager.exists(newPath)) {
        return {
          output: {
            command,
            output: `cd: ${this.t.noSuchFileOrDir}: ${args[0]}`,
            isError: true,
          },
        };
      }

      if (!this.fileSystemManager.isDirectory(newPath)) {
        return {
          output: {
            command,
            output: `cd: ${this.t.notADirectory}: ${args[0]}`,
            isError: true,
          },
        };
      }

      return {
        output: { command, output: "" },
        newPath,
      };
    } catch (error) {
      return {
        output: {
          command,
          output: `cd: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          isError: true,
        },
      };
    }
  }

  private handleCatCommand(
    command: string,
    args: string[],
    currentPath: string,
  ): CommandResult {
    if (!args[0]) {
      return {
        output: {
          command,
          output: `cat: ${this.t.missingFileOperand}`,
          isError: true,
        },
      };
    }

    try {
      const catPath = this.fileSystemManager.resolvePath(args[0], currentPath);
      const content = this.fileSystemManager.readFile(catPath);
      return {
        output: { command, output: content },
      };
    } catch (error) {
      return {
        output: {
          command,
          output: `cat: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          isError: true,
        },
      };
    }
  }

  private handleTreeCommand(
    command: string,
    currentPath: string,
  ): CommandResult {
    try {
      const currentNode = this.fileSystemManager.getNodeAtPath(currentPath);
      if (currentNode) {
        const treeOutput = this.fileSystemManager
          .buildDirectoryTree(currentNode)
          .trim();
        return {
          output: { command, output: treeOutput },
        };
      }

      return {
        output: {
          command,
          output: `Error: ${this.t.cannotAccessDir}`,
          isError: true,
        },
      };
    } catch (error) {
      return {
        output: {
          command,
          output: `tree: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          isError: true,
        },
      };
    }
  }
}
