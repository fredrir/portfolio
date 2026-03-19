import type { TutorialStep } from "./types";

export const TUTORIAL_STEPS: TutorialStep[] = [
  { id: "welcome" },
  { id: "theme" },
  { id: "wallpaper" },
  { id: "pane-selection" },
  { id: "launcher", desktopOnly: true },
  { id: "drag", desktopOnly: true },
  { id: "resize", desktopOnly: true },
  { id: "done" },
];

export const LS_TUTORIAL_COMPLETED = "tutorial-completed";
export const LS_OPEN_PANES = "wm-open-panes";
export const SS_TUTORIAL_STATE = "tutorial-state";
