"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { BIRTHDAY, USER_HOST } from "@/lib/constants";
import { THEMES } from "@/lib/themes";
import {
  PORTFOLIO_VERSION,
  START_VERSION,
  TAILWIND_VERSION,
} from "@/lib/constants";
import { WINDOW_CONFIGS } from "@/window-manager/constants";

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
    { label: null, value: USER_HOST },
    {
      label: null,
      value:
        "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
    },
    { label: "OS", value: `fredrir ${PORTFOLIO_VERSION}` },
    { label: "Kernel", value: `TanStack Start ${START_VERSION}` },
    { label: "Uptime", value: computeUptime() },
    { label: "Shell", value: "zsh 5.9" },
    { label: "WM", value: `Tailwind CSS v${TAILWIND_VERSION}` },
    { label: "Theme", value: themeName ?? "fredrir" },
    { label: "Packages", value: `${WINDOW_CONFIGS.length}` },
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

type AnimPhase = "logo" | "info" | "colors" | "done";

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

  const [phase, setPhase] = useState<AnimPhase>(animate ? "logo" : "done");
  const [logoLine, setLogoLine] = useState(animate ? 0 : LOGO_LINES.length);
  const [infoChars, setInfoChars] = useState(animate ? 0 : Infinity);
  const [colorVisible, setColorVisible] = useState(!animate);
  const resolvedInfoRef = React.useRef(resolvedInfo);
  resolvedInfoRef.current = resolvedInfo;

  useEffect(() => {
    if (!animate) return;

    if (phase === "logo") {
      let line = 0;
      const interval = setInterval(() => {
        line++;
        setLogoLine(line);
        if (line >= LOGO_LINES.length) {
          clearInterval(interval);
          setPhase("info");
        }
      }, 60);
      return () => clearInterval(interval);
    }

    if (phase === "info") {
      const info = resolvedInfoRef.current;
      const totalChars = info.reduce(
        (sum, item) =>
          sum +
          (item.label
            ? item.label.length + 1 + item.value.length
            : item.value.length),
        0,
      );
      let chars = 0;
      const interval = setInterval(() => {
        chars += 2;
        setInfoChars(chars);
        if (chars >= totalChars) {
          clearInterval(interval);
          setPhase("colors");
        }
      }, 15);
      return () => clearInterval(interval);
    }

    if (phase === "colors") {
      const timeout = setTimeout(() => {
        setColorVisible(true);
        setPhase("done");
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [animate, phase]);

  const getInfoLineVisibility = (
    index: number,
  ): { visible: boolean; text: string } => {
    if (phase === "done" || !animate) {
      const item = resolvedInfo[index];
      return {
        visible: true,
        text: item.label ? `${item.label} ${item.value}` : item.value,
      };
    }

    if (phase === "logo") return { visible: false, text: "" };

    let charsBefore = 0;
    for (let i = 0; i < index; i++) {
      const item = resolvedInfo[i];
      charsBefore += item.label
        ? item.label.length + 1 + item.value.length
        : item.value.length;
    }

    const item = resolvedInfo[index];
    const fullText = item.label ? `${item.label} ${item.value}` : item.value;
    const charsAvailable = Math.max(0, infoChars - charsBefore);

    if (charsAvailable <= 0) return { visible: false, text: "" };

    return {
      visible: true,
      text: fullText.slice(0, charsAvailable),
    };
  };

  return (
    <div className="flex gap-3 @[300px]:gap-6 @[500px]:gap-10 items-start @container">
      {!hideLogo && (
        <div className="shrink-0">
          {LOGO_LINES.map((line, i) => (
            <div
              key={i}
              className="text-primary leading-[1.2] text-[12px] @[300px]:text-[14px] @[500px]:text-[15px] whitespace-pre transition-opacity duration-150"
              style={{
                opacity: i < logoLine ? (i >= 7 ? 0.4 : 1) : 0,
                textShadow:
                  i < 7 &&
                  i < logoLine &&
                  i === logoLine - 1 &&
                  phase === "logo"
                    ? "0 0 12px hsl(var(--primary) / 0.5)"
                    : i < 7 && i < logoLine
                      ? "0 0 8px hsl(var(--primary) / 0.3)"
                      : "none",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-0.5 text-xs">
        {resolvedInfo.map((item, i) => {
          const { visible, text } = getInfoLineVisibility(i);
          return (
            <div
              key={i}
              className="leading-[1.4] transition-opacity duration-150"
              style={{ opacity: visible ? 1 : 0 }}
            >
              {item.label ? (
                <span>
                  <span className="text-primary font-semibold">
                    {text.slice(0, item.label.length)}
                  </span>
                  <span className="text-muted-foreground">
                    {text.slice(item.label.length)}
                  </span>
                </span>
              ) : i === 0 ? (
                <span className="text-primary font-bold">{text}</span>
              ) : (
                <span className="text-primary-subtle text-[10px]">{text}</span>
              )}
            </div>
          );
        })}
        <div
          className="flex gap-[3px] pt-2 transition-opacity duration-300"
          style={{ opacity: colorVisible ? 1 : 0 }}
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
          className="flex gap-[3px] pt-[3px] transition-opacity duration-300"
          style={{ opacity: colorVisible ? 1 : 0 }}
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
    item.label ? `${item.label.padEnd(10)}${item.value}` : item.value,
  );
  infoStrings.push("");
  infoStrings.push(
    "\u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588",
  );

  const lines: string[] = [];
  const maxLines = Math.max(LOGO_LINES.length, infoStrings.length);
  for (let i = 0; i < maxLines; i++) {
    const logoLine = (LOGO_LINES[i] || "").padEnd(22);
    const infoLine = infoStrings[i] || "";
    lines.push(`${logoLine}  ${infoLine}`);
  }

  return lines.join("\n");
}
