export type TutorialStepId =
  | "welcome"
  | "theme"
  | "wallpaper"
  | "pane-selection"
  | "launcher"
  | "drag"
  | "resize"
  | "done";

export interface TutorialStep {
  id: TutorialStepId;
  desktopOnly?: boolean;
}

export interface TutorialChoices {
  locale: string;
  theme: string;
  wallpaper: string;
  openPanes: string[];
}

export interface TutorialStrings {
  welcomeTitle: string;
  welcomeBody: string;
  themeTitle: string;
  themeBody: string;
  wallpaperTitle: string;
  wallpaperBody: string;
  paneSelectionTitle: string;
  paneSelectionBody: string;
  launcherTitle: string;
  launcherBody: string;
  launcherWaiting: string;
  dragTitle: string;
  dragBody: string;
  dragWaiting: string;
  resizeTitle: string;
  resizeBody: string;
  resizeWaiting: string;
  doneTitle: string;
  doneBody: string;
  skip: string;
  next: string;
  back: string;
  startExploring: string;
  restartTutorial: string;
  paneDescriptions: Record<string, string>;
}
