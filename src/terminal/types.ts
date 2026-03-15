export interface CommandOutput {
  command: string;
  output: string;
  isError?: boolean;
}

export interface FileSystemNode {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: { [key: string]: FileSystemNode };
}

export interface TerminalState {
  text: string;
  cursorVisible: boolean;
  cursorIsFinished: boolean;
  isClosed: boolean;
  isExpanded: boolean;
  isSmall: boolean;
  inputValue: string;
  commandHistory: CommandOutput[];
  currentPath: string;
}
