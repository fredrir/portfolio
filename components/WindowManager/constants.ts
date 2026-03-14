import type { WindowConfig, BackgroundConfig } from "./types";

export const GAP = 10;
export const STATUS_BAR_HEIGHT = 28;

export const WINDOW_CONFIGS: WindowConfig[] = [
  { id: "about", title: "whoami", icon: "~", defaultOpen: true, order: 0 },
  { id: "github", title: "cat /proc/github", icon: "", defaultOpen: true, order: 1 },
  { id: "spotify", title: "cat /proc/spotify", icon: "♪", defaultOpen: true, order: 2 },
  { id: "journey", title: "cat ~/.career/log", icon: "", defaultOpen: true, order: 3 },
  { id: "projects", title: "ls ~/projects", icon: "", defaultOpen: true, order: 4 },
  { id: "contact", title: "vim mail.tmp", icon: "", defaultOpen: true, order: 5 },
  { id: "settings", title: "settings", icon: "⚙", defaultOpen: true, order: 7 },
  { id: "terminal", title: "kitty", icon: ">_", defaultOpen: true, order: 8 },
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
