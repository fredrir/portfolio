"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { WINDOW_CONFIGS } from "./constants";
import type { WindowStates } from "./types";
import type { UiStrings } from "./WindowManager";

interface Props {
  states: WindowStates;
  ui: UiStrings;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export function AppLauncher({ states, ui, onOpen, onClose }: Props) {
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
      (c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleSelect = useCallback(
    (id: string) => {
      onOpen(id);
      onClose();
    },
    [onOpen, onClose],
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
    const el = listRef.current?.children[selectedIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-[18vh] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-primary/20 bg-background/95 backdrop-blur-md shadow-2xl shadow-primary/10 overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-primary/15">
          <span className="text-primary text-sm">walker</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/30"
            placeholder={ui.searchApps}
            autoComplete="off"
          />
          <span className="text-muted-foreground/30 text-2xs">ctrl+k</span>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted-foreground/40 text-sm">
              {ui.noMatching}
            </div>
          ) : (
            filtered.map((config, i) => {
              const isOpen = states[config.id]?.isOpen;
              const isSelected = i === selectedIdx;
              return (
                <button
                  key={config.id}
                  onClick={() => handleSelect(config.id)}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors group ${
                    isSelected ? "bg-primary/10" : "hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary/60 w-5 text-center text-sm">
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
                      <span className="text-2xs text-muted-foreground/30 ml-2">
                        {config.id}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-2xs px-1.5 py-0.5 rounded ${
                      isOpen
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground/40"
                    }`}
                  >
                    {isOpen ? ui.running : ui.stopped}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-primary/10 text-2xs text-muted-foreground/30 flex items-center justify-between">
          <span>
            <span className="text-primary/40">↑↓</span> {ui.navigate}
            <span className="text-primary/40 ml-3">Enter</span> {ui.open}
            <span className="text-primary/40 ml-3">Esc</span> {ui.close}
          </span>
          <span>{filtered.length} {ui.apps}</span>
        </div>
      </div>
    </div>
  );
}
