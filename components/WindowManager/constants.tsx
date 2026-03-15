import {
  UserCircle,
  GithubLogo,
  SpotifyLogo,
  Path,
  FolderSimple,
  EnvelopeSimple,
  GearSix,
  Terminal,
} from "@phosphor-icons/react";
import type { WindowConfig, BackgroundConfig } from "./types";

export const GAP = 10;
export const STATUS_BAR_HEIGHT = 28;

const S = 14;
const W = "bold" as const;

export const WINDOW_CONFIGS: WindowConfig[] = [
  {
    id: "about",
    title: "whoami",
    shortTitle: "whoami",
    icon: <UserCircle size={S} weight={W} />,
    defaultOpen: true,
    order: 0,
  },
  {
    id: "github",
    title: "cat /proc/github",
    shortTitle: "github",
    icon: <GithubLogo size={S} weight={W} />,
    defaultOpen: true,
    order: 1,
  },
  {
    id: "spotify",
    title: "cat /proc/spotify",
    shortTitle: "spotify",
    icon: <SpotifyLogo size={S} weight={W} />,
    defaultOpen: true,
    order: 2,
  },
  {
    id: "journey",
    title: "cat ~/.career/log",
    shortTitle: "log",
    icon: <Path size={S} weight={W} />,
    defaultOpen: true,
    order: 3,
  },
  {
    id: "projects",
    title: "ls ~/projects",
    shortTitle: "projects",
    icon: <FolderSimple size={S} weight={W} />,
    defaultOpen: true,
    order: 4,
  },
  {
    id: "contact",
    title: "vim mail.tmp",
    shortTitle: "mail",
    icon: <EnvelopeSimple size={S} weight={W} />,
    defaultOpen: true,
    order: 5,
  },
  {
    id: "settings",
    title: "settings",
    shortTitle: "settings",
    icon: <GearSix size={S} weight={W} />,
    defaultOpen: true,
    order: 7,
  },
  {
    id: "terminal",
    title: "kitty",
    shortTitle: "kitty",
    icon: <Terminal size={S} weight={W} />,
    defaultOpen: true,
    order: 8,
  },
];

export const BACKGROUND_PRESETS: BackgroundConfig[] = [
  { id: "starfield", name: "Starfield", type: "animated-dots" },
  { id: "matrix", name: "Matrix Rain", type: "matrix" },
  { id: "grid", name: "Grid", type: "grid" },
  {
    id: "gradient",
    name: "Gradient",
    type: "gradient",
    value: "linear-gradient(135deg, #0a0e1a 0%, #0d1117 50%, #090c14 100%)",
  },
  { id: "plain", name: "Minimal", type: "plain" },
];
