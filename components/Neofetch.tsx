"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { THEMES } from "@/lib/themes";

export const LOGO_LINES = [
  "  \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E",
  "  \u2502  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  \u2502",
  "  \u2502  \u2588\u2588        \u2502",
  "  \u2502  \u2588\u2588\u2588\u2588\u2588\u2588    \u2502",
  "  \u2502  \u2588\u2588        \u2502",
  "  \u2502  \u2588\u2588        \u2502",
  "  \u2570\u2500\u2500\u252C\u2500\u252C\u2500\u2500\u252C\u2500\u252C\u2500\u2500\u256F",
  "    \u2502 \u2502  \u2502 \u2502    ",
  "    \u2575 \u2575  \u2575 \u2575    ",
];

export interface NeofetchInfoLine {
  label: string | null;
  value: string;
}

const BIRTHDAY = new Date(2003, 9, 2);

export function computeUptime(): string {
  const now = new Date();
  let years = now.getFullYear() - BIRTHDAY.getFullYear();
  let months = now.getMonth() - BIRTHDAY.getMonth();
  let days = now.getDate() - BIRTHDAY.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  parts.push(`${days}d`);
  return parts.join(" ");
}

const LOCALE_NAMES: Record<string, string> = {
  en: "en_US.UTF-8",
  nb: "nb_NO.UTF-8",
  nn: "nn_NO.UTF-8",
  fr: "fr_FR.UTF-8",
};

export function getDefaultInfo(
  locale?: string,
  themeName?: string,
): NeofetchInfoLine[] {
  return [
    { label: null, value: "fredrir@hansteen" },
    {
      label: null,
      value:
        "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
    },
    { label: "OS", value: "fredrir 2.0" },
    { label: "Kernel", value: "Next.js 15.2.8" },
    { label: "Uptime", value: computeUptime() },
    { label: "Shell", value: "zsh 5.9" },
    { label: "WM", value: "Tailwind CSS" },
    { label: "Theme", value: themeName ?? "fredrir" },
    { label: "Locale", value: LOCALE_NAMES[locale ?? "en"] ?? "en_US.UTF-8" },
  ];
}

const THEME_COLOR_MAP: Record<string, string[]> = {
  fredrir: [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
  ],
  nord: [
    "#bf616a",
    "#d08770",
    "#ebcb8b",
    "#a3be8c",
    "#88c0d0",
    "#5e81ac",
    "#b48ead",
    "#d8dee9",
  ],
  "catppuccin-mocha": [
    "#f38ba8",
    "#fab387",
    "#f9e2af",
    "#a6e3a1",
    "#94e2d5",
    "#89b4fa",
    "#cba6f7",
    "#f5c2e7",
  ],
  rosepine: [
    "#eb6f92",
    "#ebbcba",
    "#f6c177",
    "#31748f",
    "#9ccfd8",
    "#c4a7e7",
    "#e0def4",
    "#908caa",
  ],
  "tokyo-night": [
    "#f7768e",
    "#ff9e64",
    "#e0af68",
    "#9ece6a",
    "#7dcfff",
    "#7aa2f7",
    "#bb9af7",
    "#c0caf5",
  ],
  gruvbox: [
    "#fb4934",
    "#fe8019",
    "#fabd2f",
    "#b8bb26",
    "#8ec07c",
    "#83a598",
    "#d3869b",
    "#ebdbb2",
  ],
  "solarized-light": [
    "#dc322f",
    "#cb4b16",
    "#b58900",
    "#859900",
    "#2aa198",
    "#268bd2",
    "#6c71c4",
    "#d33682",
  ],
  "catppuccin-latte": [
    "#d20f39",
    "#fe640b",
    "#df8e1d",
    "#40a02b",
    "#179299",
    "#1e66f5",
    "#8839ef",
    "#ea76cb",
  ],
  "rose-pine-dawn": [
    "#b4637a",
    "#ea9d34",
    "#d7827e",
    "#286983",
    "#56949f",
    "#907aa9",
    "#c4a7e7",
    "#9893a5",
  ],
};

const DEFAULT_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

interface NeofetchProps {
  info?: NeofetchInfoLine[];
  locale?: string;
  animate?: boolean;
  hideLogo?: boolean;
}

export default function Neofetch({
  info,
  locale,
  animate = true,
  hideLogo = false,
}: NeofetchProps) {
  const { resolvedTheme } = useTheme();
  const themeDef = THEMES.find((t) => t.id === resolvedTheme);
  const themeName = themeDef?.name ?? resolvedTheme ?? "fredrir";
  const themeColors = THEME_COLOR_MAP[resolvedTheme ?? ""] ?? DEFAULT_COLORS;

  const resolvedInfo = useMemo(
    () => info ?? getDefaultInfo(locale, themeName),
    [info, locale, themeName],
  );
  const totalLines = Math.max(LOGO_LINES.length, resolvedInfo.length + 2);
  const [visibleLines, setVisibleLines] = useState(animate ? 0 : totalLines);

  useEffect(() => {
    if (!animate) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= totalLines) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [animate, totalLines]);

  return (
    <div className="flex gap-4 @xs:gap-8 @sm:gap-12 items-start @container">
      {!hideLogo && (
        <div className="shrink-0">
          {LOGO_LINES.map((line, i) => (
            <div
              key={i}
              className="text-primary leading-[1.2] text-[13px] @xs:text-[14px] @sm:text-[15px] whitespace-pre transition-opacity duration-150"
              style={{
                opacity: i < visibleLines ? (i >= 7 ? 0.4 : 1) : 0,
                textShadow:
                  i < 7 && i < visibleLines
                    ? "0 0 8px hsl(var(--primary) / 0.3)"
                    : "none",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      <div className="min-w-0 space-y-0.5 text-xs">
        {resolvedInfo.map((item, i) => (
          <div
            key={i}
            className="leading-[1.4] transition-opacity duration-150"
            style={{ opacity: i < visibleLines ? 1 : 0 }}
          >
            {item.label ? (
              <span>
                <span className="text-primary font-semibold">{item.label}</span>
                <span className="text-muted-foreground"> {item.value}</span>
              </span>
            ) : i === 0 ? (
              <span className="text-primary font-bold">{item.value}</span>
            ) : (
              <span className="text-primary/30 text-[10px]">{item.value}</span>
            )}
          </div>
        ))}
        <div
          className="flex gap-[3px] pt-2 transition-opacity duration-150"
          style={{ opacity: visibleLines >= resolvedInfo.length ? 1 : 0 }}
        >
          {themeColors.map((c, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div
          className="flex gap-[3px] pt-[3px] transition-opacity duration-150"
          style={{ opacity: visibleLines >= resolvedInfo.length + 1 ? 1 : 0 }}
        >
          {themeColors.map((c, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-sm brightness-50"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function getNeofetchPlainText(
  extraLines?: NeofetchInfoLine[],
  locale?: string,
): string {
  const info = extraLines ?? getDefaultInfo(locale);

  const infoStrings = info.map((item) =>
    item.label ? `${item.label.padEnd(8)}${item.value}` : item.value,
  );
  infoStrings.push("");
  infoStrings.push(
    "\u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588",
  );

  const lines: string[] = [];
  const maxLines = Math.max(LOGO_LINES.length, infoStrings.length);
  for (let i = 0; i < maxLines; i++) {
    const logoLine = (LOGO_LINES[i] || "").padEnd(18);
    const infoLine = infoStrings[i] || "";
    lines.push(`${logoLine}  ${infoLine}`);
  }

  return lines.join("\n");
}
