"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { isDarkTheme } from "@/lib/themes";
import { STATUS_BAR_HEIGHT } from "../constants";
import type { WindowConfig, WindowStates } from "../types";
import type { UiStrings } from "@/shared/types";
import { computeUptime } from "@/shared/components/neofetch";
import { Clock } from "./clock";
import { Weather } from "./weather";
import { VisitorCount } from "./visitor-count";

interface Props {
  states: WindowStates;
  allConfigs?: WindowConfig[];
  locale: string;
  ui: UiStrings;
  focusedWindowId: string | null;
  onOpenLauncher: () => void;
  onOpenSettings: () => void;
  onFocusWindow: (id: string) => void;
}

export function StatusBar({
  states,
  allConfigs = [],
  locale,
  ui,
  focusedWindowId,
  onOpenLauncher,
  onOpenSettings,
  onFocusWindow,
}: Props) {
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
      className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-2 font-mono text-3xs border-t border-primary/15 bg-background/95 backdrop-blur-md select-none z-[9999]"
      style={{ height: STATUS_BAR_HEIGHT }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
        <button
          onClick={onOpenLauncher}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/15 text-primary hover:bg-primary/25 active:bg-primary/35 transition-all font-bold border border-primary/20 hover:border-primary/40 hover:shadow-xs hover:shadow-primary/10 shrink-0"
        >
          <span className="text-2xs font-extrabold tracking-tight">F</span>
          <span className="text-3xs text-primary/70 hidden sm:inline">
            FredOS
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3 text-muted-foreground/50">
        <span className="text-primary/40 hidden sm:inline">
          {ui.uptime}: {computeUptime()}
        </span>

        <Weather />
        <VisitorCount label={ui.visitors} />

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
          className="text-muted-foreground/40 hover:text-primary transition-colors text-xs"
          title="Settings"
        >
          ⚙
        </button>

        <span className="text-primary/50">
          <Clock locale={locale} />
        </span>
      </div>
    </div>
  );
}
