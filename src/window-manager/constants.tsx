import {
  UserCircle,
  GithubLogo,
  SpotifyLogo,
  Path,
  FolderSimple,
  EnvelopeSimple,
  GearSix,
  Terminal,
  Images,
  FileText,
} from "@phosphor-icons/react";
import type { WindowConfig } from "./types";
import type { BackgroundConfig } from "./background/types";

export const GAP = 10;
export const STATUS_BAR_HEIGHT = 28;

export const STORAGE_KEYS = {
  openPanes: "wm-open-panes",
  background: "wm-background",
  backgroundImage: "wm-background-image",
  mobileActiveApp: "mobileActiveApp",
  tipDismissed: "wm-tip-dismissed",
  weather: "wm-weather",
  visited: "wm-visited",
} as const;

export function openExternalWindow(config: WindowConfig, locale: string): void {
  if (!config.href) return;
  const url =
    typeof config.href === "string"
      ? config.href
      : (config.href[locale] ?? config.href.en);
  window.open(url, "_blank", "noopener,noreferrer");
}

const S = 14;
const W = "bold" as const;

export const WINDOW_CONFIGS: WindowConfig[] = [
  {
    id: "about",
    title: "whoami",
    icon: <UserCircle size={S} weight={W} />,
    defaultOpen: true,
    order: 0,
  },
  {
    id: "github",
    title: "cat /proc/github",
    icon: <GithubLogo size={S} weight={W} />,
    defaultOpen: true,
    order: 1,
  },
  {
    id: "spotify",
    title: "./spotify.sh",
    icon: <SpotifyLogo size={S} weight={W} />,
    defaultOpen: true,
    order: 2,
  },
  {
    id: "journey",
    title: "cat ~/.career/log",
    icon: <Path size={S} weight={W} />,
    defaultOpen: true,
    order: 3,
  },
  {
    id: "projects",
    title: "ls ~/projects",
    icon: <FolderSimple size={S} weight={W} />,
    defaultOpen: true,
    order: 4,
  },
  {
    id: "contact",
    title: "vim mail.tmp",
    icon: <EnvelopeSimple size={S} weight={W} />,
    defaultOpen: true,
    order: 5,
  },
  {
    id: "settings",
    title: "./settings.sh",
    icon: <GearSix size={S} weight={W} />,
    defaultOpen: true,
    order: 7,
  },
  {
    id: "terminal",
    title: "~/ terminal",
    icon: <Terminal size={S} weight={W} />,
    defaultOpen: true,
    order: 8,
  },
  {
    id: "gallery",
    title: "ls ~/gallery",
    icon: <Images size={S} weight={W} />,
    defaultOpen: false,
    order: 9,
  },
  {
    id: "resume",
    title: "cat ~/resume.pdf",
    icon: <FileText size={S} weight={W} />,
    defaultOpen: false,
    order: 10,
    isExternal: true,
    href: {
      en: "/cv-en.pdf",
      fr: "/cv-en.pdf",
      nb: "/cv-nb.pdf",
      nn: "/cv-nb.pdf",
    },
  },
];

export const configMap = Object.fromEntries(
  WINDOW_CONFIGS.map((c) => [c.id, c]),
);

export const BACKGROUND_PRESETS: BackgroundConfig[] = [
  { id: "starfield", name: "Starfield", type: "animated-dots" },
  { id: "matrix", name: "Matrix", type: "matrix" },
  { id: "grid", name: "Grid", type: "grid" },
  { id: "gradient", name: "Gradient", type: "gradient" },
  { id: "plain", name: "Minimal", type: "plain" },
];
