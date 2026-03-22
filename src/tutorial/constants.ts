import type { TutorialStep } from "./types";

export const TUTORIAL_STEPS: TutorialStep[] = [
  { id: "welcome" },
  { id: "theme" },
  { id: "wallpaper" },
  { id: "pane-selection", desktopOnly: true },
  { id: "launcher", desktopOnly: true },
  { id: "drag", desktopOnly: true },
  { id: "resize", desktopOnly: true },
  { id: "done" },
];

