"use client";

import { useState, useEffect } from "react";
import type { UiStrings } from "@/shared/types";

interface Props {
  ui: UiStrings;
}

export function TipBar({ ui }: Props) {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("wm-tip-dismissed")) {
      setVisible(false);
      setDismissed(true);
    }
  }, []);
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, [dismissed]);
  if (!visible || dismissed) return null;
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9998] font-mono text-xs bg-glass-medium border border-border-medium backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-wm-shadow-soft">
      <span className="text-readable">
        <span className="text-primary-medium font-bold">Ctrl+K</span>{" "}
        {ui.tipLauncher}
        <span className="text-primary-hint mx-2">|</span>
        {ui.tipDrag}
        <span className="text-primary-hint mx-2">|</span>
        {ui.tipResize}
      </span>
      <button
        onClick={() => {
          setVisible(false);
          setDismissed(true);
          sessionStorage.setItem("wm-tip-dismissed", "1");
        }}
        className="text-ghost hover:text-foreground transition-colors ml-2"
      >
        ×
      </button>
    </div>
  );
}
