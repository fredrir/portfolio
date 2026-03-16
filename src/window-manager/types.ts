export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowConfig {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  defaultOpen: boolean;
  order: number;
  isDynamic?: boolean;
  isExternal?: boolean;
  href?: string | Record<string, string>;
}

export interface WindowState {
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export type WindowStates = Record<string, WindowState>;

export interface BackgroundConfig {
  id: string;
  name: string;
  type:
    | "animated-dots"
    | "matrix"
    | "grid"
    | "plain"
    | "gradient"
    | "custom-image";
  value?: string;
}
