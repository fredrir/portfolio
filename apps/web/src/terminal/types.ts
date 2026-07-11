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

export interface CommandAction {
  type: "openPane" | "closePane" | "startGame" | "wasmPlugin";
  payload: string;
}

export interface CommandResult {
  output: CommandOutput;
  newPath?: string;
  action?: CommandAction;
}

export interface TerminalGame {
  id: string;
  render(): string;
  handleKey(key: string): void;
  isFinished(): boolean;
  getScore(): number;
}

export interface FileSystemConfig {
  paneIds: string[];
  projects: { title: string }[];
  careers: { jobTitle: string; company: string }[];
}
