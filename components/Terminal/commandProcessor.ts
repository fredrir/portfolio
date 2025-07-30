import { FileSystemManager } from "./fileSystem";
import { CommandOutput } from "./types";

export class CommandProcessor {
  private fileSystemManager: FileSystemManager;

  constructor() {
    this.fileSystemManager = new FileSystemManager();
  }

  processCommand(
    command: string,
    currentPath: string
  ): { output: CommandOutput; newPath?: string } {
    const [cmd, ...args] = command.trim().split(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        return {
          output: {
            command,
            output: `Available commands:
  help          - Show this help message
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
  history       - Show command history
  uname         - System information
  uptime        - System uptime`,
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
          output: { command, output: "fredrik" },
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
            output: `🖥️  Fredrik's Interactive Terminal v1.0
Built with  Next.js and Tailwind
Features a simulated file system with navigation commands
Type 'help' for available commands

Repository: https://github.com/fredrir/portfolio
Author: Fredrik Carsten Hansteen`,
          },
        };

      case "history":
        return {
          output: {
            command,
            output: "Command history is managed by the terminal interface",
          },
        };

      case "uname":
        const unameFlag = args[0];
        let unameOutput = "FredrikOS";

        if (unameFlag === "-a") {
          unameOutput =
            "FredrikOS fredrik-terminal 1.0.0 #1 SMP Web Browser x86_64 GNU/Linux";
        } else if (unameFlag === "-r") {
          unameOutput = "1.0.0";
        } else if (unameFlag === "-m") {
          unameOutput = "x86_64";
        }

        return {
          output: { command, output: unameOutput },
        };

      case "uptime":
        const uptime = Math.floor(Math.random() * 86400);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);

        return {
          output: {
            command,
            output: `up ${hours}:${minutes
              .toString()
              .padStart(2, "0")}, 1 user, load average: 0.${Math.floor(
              Math.random() * 99
            )}, 0.${Math.floor(Math.random() * 99)}, 0.${Math.floor(
              Math.random() * 99
            )}`,
          },
        };

      default:
        return {
          output: {
            command,
            output: `bash: ${cmd}: command not found`,
            isError: true,
          },
        };
    }
  }

  private handleLsCommand(
    command: string,
    args: string[],
    currentPath: string
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
    currentPath: string
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
    currentPath: string
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
    currentPath: string
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
