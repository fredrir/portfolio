export const GITHUB_ASCII = [
  "        ▄██████▄        ",
  "      ▄████████████▄    ",
  "    ██████████████████   ",
  "   ████████████████████  ",
  "  █████ ▀██████▀ ██████ ",
  "  ██████          ██████ ",
  "  █████            █████ ",
  "  █████            █████ ",
  "  █████            █████ ",
  "  ██████          ██████ ",
  "   ████████    █████████ ",
  "   ███ ██████  █████████  ",
  "    ███  ████  █████████ ",
  "     ████      ████████  ",
  "       █████  ███████    ",
  "         ███  █████      ",
];

export const LANG_ICONS: Record<string, { icon: string; color: string }> = {
  TypeScript: { icon: "TS", color: "text-blue-400" },
  JavaScript: { icon: "JS", color: "text-yellow-400" },
  Python: { icon: "PY", color: "text-blue-300" },
  Java: { icon: "JV", color: "text-orange-400" },
  Kotlin: { icon: "KT", color: "text-purple-400" },
  Go: { icon: "GO", color: "text-cyan-400" },
  Rust: { icon: "RS", color: "text-orange-300" },
  C: { icon: "C ", color: "text-blue-500" },
  "C++": { icon: "++", color: "text-blue-400" },
  "C#": { icon: "C#", color: "text-green-400" },
  Ruby: { icon: "RB", color: "text-red-400" },
  PHP: { icon: "HP", color: "text-indigo-300" },
  Swift: { icon: "SW", color: "text-orange-400" },
  Shell: { icon: "SH", color: "text-green-300" },
  Lua: { icon: "LU", color: "text-blue-600" },
  Dart: { icon: "DT", color: "text-cyan-300" },
  HTML: { icon: "<>", color: "text-orange-500" },
  CSS: { icon: "# ", color: "text-blue-500" },
  Vue: { icon: "VU", color: "text-green-500" },
  Svelte: { icon: "SV", color: "text-orange-600" },
};

export const CONTRIBUTION_LEVEL_CHARS = ["·", "░", "▒", "▓", "█"];

export const CONTRIBUTION_LEVEL_COLORS = [
  "text-muted-foreground/20",
  "text-green-600/40 dark:text-green-400/30",
  "text-green-600/60 dark:text-green-400/50",
  "text-green-600/80 dark:text-green-400/70",
  "text-green-600 dark:text-green-400",
];

export const MS_PER_DAY = 24 * 60 * 60 * 1000;
