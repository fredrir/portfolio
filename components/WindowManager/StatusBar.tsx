"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { STATUS_BAR_HEIGHT } from "./constants";
import type { WindowConfig, WindowStates } from "./types";
import { computeUptime } from "@/components/Neofetch";

interface Props {
  states: WindowStates;
  allConfigs?: WindowConfig[];
  locale: string;
  focusedWindowId: string | null;
  onOpenLauncher: () => void;
  onOpenSettings: () => void;
  onFocusWindow: (id: string) => void;
}

function Clock({ locale }: { locale: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  return <span>{time}</span>;
}

function Weather() {
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("wm-weather");
    if (stored) {
      setWeather(stored);
      return;
    }
    fetch("https://wttr.in/?format=%t+%C&m")
      .then((r) => r.text())
      .then((text) => {
        const clean = text.trim().slice(0, 30);
        setWeather(clean);
        sessionStorage.setItem("wm-weather", clean);
      })
      .catch(() => setWeather(null));
  }, []);

  if (!weather) return null;
  return <span>{weather}</span>;
}

function VisitorCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const key = "wm-visitor-count";
    const visited = sessionStorage.getItem("wm-visited");
    let current = parseInt(localStorage.getItem(key) || "0", 10);
    if (!visited) {
      current++;
      localStorage.setItem(key, String(current));
      sessionStorage.setItem("wm-visited", "1");
    }
    setCount(current);
  }, []);

  return <span>visitors: {count}</span>;
}

export function StatusBar({
  states,
  allConfigs = [],
  locale,
  focusedWindowId,
  onOpenLauncher,
  onOpenSettings,
  onFocusWindow,
}: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const githubSrc =
    mounted && theme === "dark" ? "/github-dark.svg" : "/github.svg";
  const linkedInSrc =
    mounted && theme === "dark" ? "/linkedin-dark.svg" : "/linkedin.svg";

  const openWindows = allConfigs.filter((c) => states[c.id]?.isOpen);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-2 font-mono text-3xs border-t border-primary/15 bg-background/95 backdrop-blur-md select-none z-[9999]"
      style={{ height: STATUS_BAR_HEIGHT }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenLauncher}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-bold"
        >

          <span className="text-3xs text-primary/60 hidden sm:inline">Apps</span>
        </button>

        <div className="flex items-center gap-0.5 ml-1">
          {openWindows.map((config) => (
            <button
              key={config.id}
              onClick={() => onFocusWindow(config.id)}
              className={`px-1.5 py-0.5 rounded transition-colors truncate max-w-24 ${
                focusedWindowId === config.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground/60 hover:text-primary hover:bg-primary/10"
              }`}
            >
              {config.icon && <span className="mr-0.5">{config.icon}</span>}
              {config.id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 text-muted-foreground/50">
        <span className="text-primary/40 hidden sm:inline">
          uptime: {computeUptime()}
        </span>

        <Weather />
        <VisitorCount />

        <div className="flex items-center gap-1.5">
          <Link
            href="https://www.linkedin.com/in/fredrir"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={linkedInSrc}
              alt="LinkedIn"
              width={12}
              height={12}
              className="opacity-50 hover:opacity-100 transition-opacity"
            />
          </Link>
          <Link
            href="https://www.github.com/fredrir"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={githubSrc}
              alt="GitHub"
              width={12}
              height={12}
              className="opacity-50 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        <button
          onClick={onOpenSettings}
          className="text-muted-foreground/40 hover:text-primary transition-colors"
          title="Settings"
        >

        </button>

        <span className="text-primary/50">
          <Clock locale={locale} />
        </span>
      </div>
    </div>
  );
}
