export type { BackgroundConfig } from "./background/types";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowConfig {
  id: string;
  title: string;
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
