"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { WINDOW_CONFIGS, openExternalWindow } from "../../constants";
import type { WindowStates } from "../../types";
import type { UiStrings } from "@/i18n/types";

interface Props {
  states: WindowStates;
  ui: UiStrings;
  locale: string;
  onOpen: (id: string) => void;
  onStop: (id: string) => void;
  onClose: () => void;
}

export function AppLauncher({
  states,
  ui,
  locale,
  onOpen,
  onStop,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return WINDOW_CONFIGS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (ui.shortTitles[c.id] ?? c.shortTitle).toLowerCase().includes(q),
    );
  }, [query, ui.shortTitles]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleSelect = useCallback(
    (id: string) => {
      const config = WINDOW_CONFIGS.find((c) => c.id === id);
      if (config?.isExternal && config.href) {
        openExternalWindow(config, locale);
        onClose();
        return;
      }
      onOpen(id);
      onClose();
    },
    [onOpen, onClose, locale],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIdx((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[selectedIdx]) handleSelect(filtered[selectedIdx].id);
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filtered, selectedIdx, handleSelect, onClose],
  );

  useEffect(() => {
    const el = listRef.current?.children[selectedIdx] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-[18vh] bg-overlay-heavy backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border-medium bg-glass-heavy backdrop-blur-md shadow-2xl shadow-wm-shadow overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-wm-border">
          <span className="text-primary text-sm">walker</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground text-sm outline-hidden placeholder:text-placeholder"
            placeholder={ui.searchApps}
            autoComplete="off"
          />
          <span className="text-ghost text-2xs">ctrl+k</span>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-subtle text-sm">
              {ui.noMatching}
            </div>
          ) : (
            filtered.map((config, i) => {
              const isOpen = states[config.id]?.isOpen;
              const isSelected = i === selectedIdx;
              return (
                <div
                  key={config.id}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors group ${
                    isSelected ? "bg-control-active" : "hover:bg-control-hover"
                  }`}
                >
                  <button
                    onClick={() => handleSelect(config.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <span className="text-primary-soft w-5 text-center text-sm">
                      {config.icon || "·"}
                    </span>
                    <div>
                      <span
                        className={`text-sm transition-colors ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {config.title}
                      </span>
                      <span className="text-2xs text-ghost ml-2">
                        {ui.shortTitles[config.id] ?? config.shortTitle}
                      </span>
                    </div>
                  </button>
                  {config.isExternal ? (
                    <span className="text-2xs px-1.5 py-0.5 rounded bg-launcher-bg text-primary">
                      ↗
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isOpen) {
                          onStop(config.id);
                        } else {
                          handleSelect(config.id);
                        }
                      }}
                      className={`text-2xs px-1.5 py-0.5 rounded transition-colors ${
                        isOpen
                          ? "bg-badge-stop text-red-400 hover:bg-badge-stop-hover"
                          : "bg-launcher-bg text-primary hover:bg-launcher-hover"
                      }`}
                    >
                      {isOpen ? ui.stop : ui.start}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-border-faint text-2xs text-ghost flex items-center justify-between">
          <span>
            <span className="text-primary-dim">↑↓</span> {ui.navigate}
            <span className="text-primary-dim ml-3">Enter</span> {ui.open}
            <span className="text-primary-dim ml-3">Esc</span> {ui.close}
          </span>
          <span>
            {filtered.length} {ui.apps}
          </span>
        </div>
      </div>
    </div>
  );
}
