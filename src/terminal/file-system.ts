import { FileSystemNode } from "./types";

export const createFileSystem = (): FileSystemNode => ({
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
            documents: {
              name: "documents",
              type: "directory",
              children: {
                "readme.txt": {
                  name: "readme.txt",
                  type: "file",
                  content: "Welcome to FredrikOS!\n",
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
            projects: {
              name: "projects",
              type: "directory",
              children: {
                portfolio: {
                  name: "portfolio",
                  type: "directory",
                  children: {
                    LICENSE: {
                      name: "LICENSE",
                      type: "file",
                      content: `MIT License\n\nCopyright (c) ${new Date().getFullYear()} Fredrik Carsten Hansteen\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`,
                    },

                    "package.json": {
                      name: "package.json",
                      type: "file",
                      content:
                        '{\n  "name": "portfolio",\n  "version": "1.0.0"\n}',
                    },
                    app: {
                      name: "app",
                      type: "directory",
                      children: {
                        "page.tsx": {
                          name: "page.tsx",
                          type: "file",
                          content:
                            "export default function Page() {\n  return <div>Welcome to my portfolio!</div>;\n}",
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
              content:
                "Fredrik Carsten Hansteen - Developer of FredrikOS\n" +
                "Contact: fhansteen@gmail.com",
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
              content: "Node.js executable",
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
                "[2024-01-15 10:30:15] System started\n[2024-01-15 10:30:16] Terminal initialized\n[2024-01-15 10:30:17] Ready for commands",
            },
          },
        },
      },
    },
  },
});

export class FileSystemManager {
  private fileSystem: FileSystemNode;

  constructor() {
    this.fileSystem = createFileSystem();
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
    if (inputPath.startsWith("/")) {
      return inputPath;
    }

    if (inputPath === "..") {
      const parts = currentPath.split("/").filter(Boolean);
      parts.pop();
      return "/" + parts.join("/");
    }

    if (inputPath === ".") {
      return currentPath;
    }

    return currentPath === "/"
      ? `/${inputPath}`
      : `${currentPath}/${inputPath}`;
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
      throw new Error(`cannot access '${path}': No such file or directory`);
    }

    if (node.type === "file") {
      return node.name;
    }

    const items = node.children ? Object.values(node.children) : [];
    return (
      items
        .map((item) =>
          item.type === "directory" ? `📁 ${item.name}` : `📄 ${item.name}`
        )
        .join("\n") || "(empty directory)"
    );
  }

  readFile(path: string): string {
    const node = this.getNodeAtPath(path);

    if (!node) {
      throw new Error(`${path}: No such file or directory`);
    }

    if (node.type === "directory") {
      throw new Error(`${path}: Is a directory`);
    }

    return node.content || "(empty file)";
  }

  isDirectory(path: string): boolean {
    const node = this.getNodeAtPath(path);
    return node?.type === "directory" || false;
  }

  exists(path: string): boolean {
    return this.getNodeAtPath(path) !== null;
  }
}
