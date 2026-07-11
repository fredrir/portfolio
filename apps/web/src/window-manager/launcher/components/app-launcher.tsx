"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UiStrings } from "@/i18n/types";
import { openExternalWindow, WINDOW_CONFIGS } from "../../constants";
import type { WindowConfig, WindowStates } from "../../types";
import { PaneList } from "./pane-list";

interface Props {
  states: WindowStates;
  ui: UiStrings;
  locale: string;
  onOpen: (id: string) => void;
  onStop: (id: string) => void;
  onClose: () => void;
}

export function AppLauncher({ states, ui, locale, onOpen, onStop, onClose }: Props) {
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
        (ui.shortTitles[c.id] ?? c.id).toLowerCase().includes(q),
    );
  }, [query, ui.shortTitles]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleSelect = useCallback(
    (config: WindowConfig) => {
      if (config.isExternal && config.href) {
        openExternalWindow(config, locale);
        onClose();
        return;
      }
      onOpen(config.id);
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
          if (filtered[selectedIdx]) handleSelect(filtered[selectedIdx]);
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
    const el = listRef.current?.children[selectedIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  useEffect(() => {
    setSelectedIdx((idx) => Math.min(idx, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center bg-overlay-heavy pt-[18vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border-medium bg-glass-heavy font-mono shadow-2xl shadow-wm-shadow backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-wm-border border-b px-4 py-3">
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
          <span className="text-2xs text-ghost">ctrl+k</span>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto">
          <PaneList
            configs={filtered}
            states={states}
            ui={ui}
            selectedIdx={selectedIdx}
            onSelect={handleSelect}
            onStop={onStop}
            onHover={setSelectedIdx}
          />
        </div>

        <div className="flex items-center justify-between border-border-faint border-t px-4 py-2 text-2xs text-ghost">
          <span>
            <span className="text-primary-dim">↑↓</span> {ui.navigate}
            <span className="ml-3 text-primary-dim">Enter</span> {ui.open}
            <span className="ml-3 text-primary-dim">Esc</span> {ui.close}
          </span>
          <span>
            {filtered.length} {ui.apps}
          </span>
        </div>
      </div>
    </div>
  );
}
