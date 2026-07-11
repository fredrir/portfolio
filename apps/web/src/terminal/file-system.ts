import { MY_EMAIL, MY_NAME } from "@/lib/constants";
import type { TerminalStrings } from "./translations";
import type { FileSystemConfig, FileSystemNode } from "./types";

function toFileName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createFileSystem(
  config: FileSystemConfig | undefined,
  t: TerminalStrings,
): FileSystemNode {
  const appsChildren: Record<string, FileSystemNode> = {};
  if (config?.paneIds) {
    for (const id of config.paneIds) {
      appsChildren[id] = {
        name: id,
        type: "file",
        content: `${t.application}: ${id}`,
      };
    }
  }

  const projectsChildren: Record<string, FileSystemNode> = {};
  if (config?.projects) {
    for (const p of config.projects) {
      const name = toFileName(p.title);
      projectsChildren[name] = {
        name,
        type: "file",
        content: p.title,
      };
    }
  }

  const careerChildren: Record<string, FileSystemNode> = {};
  if (config?.careers) {
    for (const c of config.careers) {
      const name = toFileName(`${c.company}`);
      careerChildren[name] = {
        name,
        type: "file",
        content: `${c.company}`,
      };
    }
  }

  return {
    name: "/",
    type: "directory",
    children: {
      home: {
        name: "home",
        type: "directory",
        children: {
          fredrik: {
            name: "fredrik",
            type: "directory",
            children: {
              apps: {
                name: "apps",
                type: "directory",
                children: appsChildren,
              },
              documents: {
                name: "documents",
                type: "directory",
                children: {
                  projects: {
                    name: "projects",
                    type: "directory",
                    children: projectsChildren,
                  },
                  career: {
                    name: "career",
                    type: "directory",
                    children: careerChildren,
                  },
                  secret: {
                    name: "secret",
                    type: "directory",
                    children: {
                      "super-secret": {
                        name: "super-secret",
                        type: "directory",
                        children: {
                          "flag.txt": {
                            name: "flag.txt",
                            type: "file",
                            content: "FLAG{congrats_you_found_me}",
                          },
                        },
                      },
                    },
                  },
                },
              },
              "profile.txt": {
                name: "profile.txt",
                type: "file",
                content: `${MY_NAME} - ${t.profileDeveloperOf}\n` + `${t.profileContact}: ${MY_EMAIL}`,
              },
              ".bashrc": {
                name: ".bashrc",
                type: "file",
                content:
                  "# ~/.bashrc\nexport PATH=$PATH:/usr/local/bin\nalias ll='ls -la'\nalias la='ls -A'",
              },
            },
          },
        },
      },
      usr: {
        name: "usr",
        type: "directory",
        children: {
          bin: {
            name: "bin",
            type: "directory",
            children: {
              node: {
                name: "node",
                type: "file",
                content: t.nodeExecutable,
              },
            },
          },
          local: {
            name: "local",
            type: "directory",
            children: {
              bin: {
                name: "bin",
                type: "directory",
                children: {},
              },
            },
          },
        },
      },
      var: {
        name: "var",
        type: "directory",
        children: {
          log: {
            name: "log",
            type: "directory",
            children: {
              "system.log": {
                name: "system.log",
                type: "file",
                content:
                  `[2024-01-15 10:30:15] ${t.systemStarted}\n` +
                  `[2024-01-15 10:30:16] ${t.terminalInitialized}\n` +
                  `[2024-01-15 10:30:17] ${t.readyForCommands}`,
              },
            },
          },
        },
      },
    },
  };
}

export class FileSystemManager {
  private fileSystem: FileSystemNode;
  private t: TerminalStrings;

  constructor(config: FileSystemConfig | undefined, t: TerminalStrings) {
    this.t = t;
    this.fileSystem = createFileSystem(config, t);
  }

  getNodeAtPath(path: string): FileSystemNode | null {
    const parts = path.split("/").filter(Boolean);
    let current = this.fileSystem;

    for (const part of parts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current;
  }

  resolvePath(inputPath: string, currentPath: string): string {
    if (inputPath.startsWith("~")) {
      inputPath = "/home/fredrik" + inputPath.slice(1);
    }

    if (inputPath.startsWith("/")) {
      return this.normalizePath(inputPath);
    }

    if (inputPath === "..") {
      const parts = currentPath.split("/").filter(Boolean);
      parts.pop();
      return "/" + parts.join("/");
    }

    if (inputPath === ".") {
      return currentPath;
    }

    const combined = currentPath === "/" ? `/${inputPath}` : `${currentPath}/${inputPath}`;
    return this.normalizePath(combined);
  }

  private normalizePath(path: string): string {
    const parts = path.split("/").filter(Boolean);
    const resolved: string[] = [];
    for (const part of parts) {
      if (part === "..") {
        resolved.pop();
      } else if (part !== ".") {
        resolved.push(part);
      }
    }
    return "/" + resolved.join("/");
  }

  buildDirectoryTree(node: FileSystemNode, prefix = "", isLast = true): string {
    const connector = isLast ? "└── " : "├── ";
    const icon = node.type === "directory" ? "📁" : "📄";
    let result = `${prefix}${connector}${icon} ${node.name}\n`;

    if (node.children) {
      const children = Object.values(node.children);
      children.forEach((child, index) => {
        const isLastChild = index === children.length - 1;
        const newPrefix = prefix + (isLast ? "    " : "│   ");
        result += this.buildDirectoryTree(child, newPrefix, isLastChild);
      });
    }

    return result;
  }

  listDirectory(path: string): string {
    const node = this.getNodeAtPath(path);

    if (!node) {
      throw new Error(`${this.t.cannotAccess} '${path}': ${this.t.noSuchFileOrDir}`);
    }

    if (node.type === "file") {
      return node.name;
    }

    const items = node.children ? Object.values(node.children) : [];
    return (
      items
        .map((item) => (item.type === "directory" ? `📁 ${item.name}` : `📄 ${item.name}`))
        .join("\n") || this.t.emptyDirectory
    );
  }

  readFile(path: string): string {
    const node = this.getNodeAtPath(path);

    if (!node) {
      throw new Error(`${path}: ${this.t.noSuchFileOrDir}`);
    }

    if (node.type === "directory") {
      throw new Error(`${path}: ${this.t.isADirectory}`);
    }

    return node.content || this.t.emptyFile;
  }

  isDirectory(path: string): boolean {
    const node = this.getNodeAtPath(path);
    return node?.type === "directory" || false;
  }

  exists(path: string): boolean {
    return this.getNodeAtPath(path) !== null;
  }

  getCompletions(partialPath: string, currentPath: string): string[] {
    const resolved = partialPath.startsWith("~")
      ? "/home/fredrik" + partialPath.slice(1)
      : partialPath.startsWith("/")
        ? partialPath
        : currentPath === "/"
          ? `/${partialPath}`
          : `${currentPath}/${partialPath}`;

    const lastSlash = resolved.lastIndexOf("/");
    const dirPath = lastSlash === 0 ? "/" : resolved.slice(0, lastSlash);
    const prefix = resolved.slice(lastSlash + 1);

    const dirNode = this.getNodeAtPath(dirPath);
    if (!dirNode || !dirNode.children) return [];

    return Object.keys(dirNode.children)
      .filter((name) => name.startsWith(prefix))
      .map((name) => {
        const child = dirNode.children![name];
        const inputLastSlash = partialPath.lastIndexOf("/");
        const inputDir = inputLastSlash >= 0 ? partialPath.slice(0, inputLastSlash + 1) : "";
        return inputDir + name + (child.type === "directory" ? "/" : "");
      });
  }
}
