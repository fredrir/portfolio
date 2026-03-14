"use client";

import { useState, useEffect, useRef } from "react";
import { BACKGROUND_PRESETS } from "./constants";
import type { BackgroundConfig } from "./types";

interface Props {
  current: BackgroundConfig;
  onSelect: (config: BackgroundConfig) => void;
  onClose: () => void;
}

export function BackgroundPicker({ current, onSelect, onClose }: Props) {
  const [customUrl, setCustomUrl] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleCustom = () => {
    if (!customUrl.trim()) return;
    onSelect({
      id: "custom",
      name: "Custom",
      type: "custom-image",
      value: customUrl.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={ref}
        className="w-full max-w-md rounded-xl border border-primary/20 bg-background/95 backdrop-blur-md shadow-2xl shadow-primary/10 overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/15">
          <span className="text-primary text-sm">wallpaper</span>
          <button
            onClick={onClose}
            className="text-muted-foreground/40 hover:text-foreground transition-colors text-sm"
          >
            esc
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {BACKGROUND_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelect(preset)}
                className={`px-3 py-4 rounded-lg border text-xs text-center transition-all ${
                  current.id === preset.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-primary/10 bg-primary/[0.02] text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-primary/10">
            <label className="text-2xs text-muted-foreground/50 block mb-1">
              Custom image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustom();
                }}
                className="flex-1 bg-primary/[0.03] border border-primary/10 rounded px-2 py-1 text-xs text-foreground outline-none focus:border-primary/30 placeholder:text-muted-foreground/20"
                placeholder="https://..."
              />
              <button
                onClick={handleCustom}
                className="px-3 py-1 rounded border border-primary/30 text-primary text-xs hover:bg-primary/10 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
