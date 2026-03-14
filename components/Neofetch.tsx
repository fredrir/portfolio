"use client";

import { useState, useEffect, useMemo } from "react";

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

const BIRTHDAY = new Date(2003, 9, 2); // October 2, 2003

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

export function getDefaultInfo(locale?: string): NeofetchInfoLine[] {
  return [
    { label: null, value: "fredrir@fredrir" },
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
    { label: "Theme", value: "catppuccin-frappe-blue [Qt]" },
    { label: "Locale", value: LOCALE_NAMES[locale ?? "en"] ?? "en_US.UTF-8" },
  ];
}

const COLOR_BLOCKS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
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
  const resolvedInfo = useMemo(
    () => info ?? getDefaultInfo(locale),
    [info, locale],
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
    <div className="flex gap-12 items-start">
      {!hideLogo && (
        <div className="shrink-0">
          {LOGO_LINES.map((line, i) => (
            <div
              key={i}
              className="text-primary leading-[1.2] text-[11px] whitespace-pre transition-opacity duration-150"
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
          {COLOR_BLOCKS.map((c) => (
            <div key={c} className={`w-2.5 h-2.5 rounded-sm ${c}`} />
          ))}
        </div>
        <div
          className="flex gap-[3px] pt-[3px] transition-opacity duration-150"
          style={{ opacity: visibleLines >= resolvedInfo.length + 1 ? 1 : 0 }}
        >
          {COLOR_BLOCKS.map((c) => (
            <div
              key={c}
              className={`w-2.5 h-2.5 rounded-sm ${c} brightness-50`}
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
