"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { UiStrings } from "@/i18n/types";
import { isDarkTheme } from "@/lib/themes";
import Image from "@/shared/components/image";
import type { WeatherData } from "@/shared/types";
import { computeUptime } from "@/terminal/neofetch";
import { STATUS_BAR_HEIGHT } from "../constants";
import { Clock } from "./components/clock";
import { VisitorCount } from "./components/visitor-count";
import { Weather } from "./components/weather";

interface Props {
  locale: string;
  ui: UiStrings;
  onOpenLauncher: () => void;
  onOpenSettings: () => void;
  weather: WeatherData | null;
}

export function StatusBar({ locale, ui, onOpenLauncher, onOpenSettings, weather }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dark = mounted && isDarkTheme(resolvedTheme);
  const githubSrc = dark ? "/github-dark.svg" : "/github.svg";
  const linkedInSrc = dark ? "/linkedin-dark.svg" : "/linkedin.svg";

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-[9999] flex select-none items-center justify-between border-wm-border border-t bg-glass-heavy px-2 font-mono text-xs backdrop-blur-md"
      style={{ height: STATUS_BAR_HEIGHT }}
    >
      <button
        onClick={onOpenLauncher}
        className="flex shrink-0 items-center gap-1.5 rounded-md border border-border-medium bg-launcher-bg px-2 py-0.5 font-bold text-primary transition-all hover:border-chart-fill hover:bg-launcher-hover hover:shadow-wm-shadow hover:shadow-xs active:bg-launcher-active"
      >
        <span className="font-extrabold text-2xs tracking-tight">F</span>
        <span className="hidden text-primary-medium text-sm sm:inline">FredOS</span>
      </button>

      <div className="flex items-center gap-3 text-faded">
        <span className="hidden text-primary-dim sm:inline">
          {ui.uptime}: {computeUptime()}
        </span>

        <Weather data={weather} strings={ui.weather} />
        <VisitorCount label={ui.visitors} />

        <div className="flex items-center gap-1.5">
          <a href="https://www.linkedin.com/in/fredrir" target="_blank" rel="noopener noreferrer">
            <Image
              src={linkedInSrc}
              alt="LinkedIn"
              width={12}
              height={12}
              className="opacity-50 transition-opacity hover:opacity-100"
            />
          </a>
          <a href="https://www.github.com/fredrir" target="_blank" rel="noopener noreferrer">
            <Image
              src={githubSrc}
              alt="GitHub"
              width={12}
              height={12}
              className="opacity-50 transition-opacity hover:opacity-100"
            />
          </a>
        </div>

        <span className="text-primary-muted">
          <Clock locale={locale} />
        </span>
      </div>
    </div>
  );
}
