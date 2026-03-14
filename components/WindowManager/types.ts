export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowConfig {
  id: string;
  title: string;
  icon: string;
  defaultOpen: boolean;
  order: number;
  isDynamic?: boolean;
  heightWeight?: number;
}

export interface WindowState {
  isOpen: boolean;
  isMaximized: boolean;
  isFloating: boolean;
  rect: Rect;
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
