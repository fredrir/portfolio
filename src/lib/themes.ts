export const THEMES = [
  {
    id: "fredrir",
    name: "fredrir",
    dark: true,
    colors: ["#0a1628", "#4ade80", "#3b82f6"],
  },
  {
    id: "nord",
    name: "Nord",
    dark: true,
    colors: ["#272d38", "#8fbcbb", "#5e81ac"],
  },
  {
    id: "catppuccin-mocha",
    name: "Catppuccin Mocha",
    dark: true,
    colors: ["#1e1e2e", "#cba6f7", "#89b4fa"],
  },
  {
    id: "rosepine",
    name: "Rosé Pine",
    dark: true,
    colors: ["#191724", "#eb6f92", "#ebbcba"],
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    dark: true,
    colors: ["#1a1b26", "#7aa2f7", "#7dcfff"],
  },
  {
    id: "gruvbox",
    name: "Gruvbox",
    dark: true,
    colors: ["#282828", "#fe8019", "#fabd2f"],
  },
  {
    id: "solarized-light",
    name: "Solarized Light",
    dark: false,
    colors: ["#fdf6e3", "#2aa198", "#268bd2"],
  },
  {
    id: "catppuccin-latte",
    name: "Catppuccin Latte",
    dark: false,
    colors: ["#eff1f5", "#8839ef", "#1e66f5"],
  },
  {
    id: "rose-pine-dawn",
    name: "Rosé Pine Dawn",
    dark: false,
    colors: ["#faf4ed", "#907aa9", "#286983"],
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const DARK_IDS: Set<string> = new Set(
  THEMES.filter((t) => t.dark).map((t) => t.id),
);

export function isDarkTheme(theme?: string): boolean {
  return theme === "dark" || DARK_IDS.has(theme ?? "");
}

export const DARK_THEME_SELECTOR = THEMES.filter((t) => t.dark)
  .map((t) => `.${t.id}`)
  .concat(".dark")
  .join(", ");
