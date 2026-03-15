import { FileSystemManager } from "./file-system";
import { computeUptime, getNeofetchPlainText } from "@/shared/components/neofetch";
import type { CommandOutput } from "./types";

export class CommandProcessor {
  private fileSystemManager: FileSystemManager;

  constructor() {
    this.fileSystemManager = new FileSystemManager();
  }

  processCommand(
    command: string,
    currentPath: string,
  ): { output: CommandOutput; newPath?: string } {
    const [cmd, ...args] = command.trim().split(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        return {
          output: {
            command,
            output: `Available commands:
  help          - Show this help message
  neofetch      - System information display
  ls [path]     - List directory contents
  cd <path>     - Change directory
  pwd           - Print working directory
  cat <file>    - Display file contents
  clear         - Clear terminal
  whoami        - Display current user
  date          - Show current date and time
  echo <text>   - Display text
  tree          - Show directory tree
  about         - About this terminal
  uname         - System information
  uptime        - System uptime`,
          },
        };

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
            output: `fredrir v2.0
Built with Next.js + Tailwind
Type 'help' for available commands
Repository: https://github.com/fredrir/portfolio
Author: Fredrik Carsten Hansteen`,
          },
        };

      case "uname":
        const unameFlag = args[0];
        let unameOutput = "fredrir 2.0.0";
        if (unameFlag === "-a") {
          unameOutput =
            "fredrir fredrir-terminal 2.0.0 #1 SMP Web Browser x86_64 GNU/Linux";
        } else if (unameFlag === "-r") {
          unameOutput = "1.0.0";
        } else if (unameFlag === "-m") {
          unameOutput = "x86_64";
        }
        return {
          output: { command, output: unameOutput },
        };

      case "uptime":
        return {
          output: {
            command,
            output: `up ${computeUptime()}`,
          },
        };

      default:
        return {
          output: {
            command,
            output: `zsh: command not found: ${cmd}`,
            isError: true,
          },
        };
    }
  }

  private handleLsCommand(
    command: string,
    args: string[],
    currentPath: string,
  ): { output: CommandOutput } {
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
  ): { output: CommandOutput; newPath?: string } {
    if (!args[0]) {
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
            output: `cd: no such file or directory: ${args[0]}`,
            isError: true,
          },
        };
      }

      if (!this.fileSystemManager.isDirectory(newPath)) {
        return {
          output: {
            command,
            output: `cd: not a directory: ${args[0]}`,
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
  ): { output: CommandOutput } {
    if (!args[0]) {
      return {
        output: {
          command,
          output: "cat: missing file operand",
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
  ): { output: CommandOutput } {
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
          output: "Error: Cannot access current directory",
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
