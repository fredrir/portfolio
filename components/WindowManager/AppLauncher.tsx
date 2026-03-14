"use client";

import { useState, useEffect, useRef } from "react";
import { WINDOW_CONFIGS } from "./constants";
import type { WindowStates } from "./types";

interface Props {
  states: WindowStates;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export function AppLauncher({ states, onOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const filtered = WINDOW_CONFIGS.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.id.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    onOpen(id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered.length > 0) {
                handleSelect(filtered[0].id);
              }
            }}
            className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/30"
            placeholder="Search applications..."
            autoComplete="off"
          />
          <span className="text-muted-foreground/30 text-2xs">
            ctrl+k
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted-foreground/40 text-sm">
              No matching windows
            </div>
          ) : (
            filtered.map((config) => {
              const isOpen = states[config.id]?.isOpen;
              return (
                <button
                  key={config.id}
                  onClick={() => handleSelect(config.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-primary/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary/60 w-5 text-center text-sm">
                      {config.icon || "·"}
                    </span>
                    <div>
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
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
                    {isOpen ? "running" : "stopped"}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-primary/10 text-2xs text-muted-foreground/30 flex items-center justify-between">
          <span>
            <span className="text-primary/40">Enter</span> to open
            <span className="text-primary/40 ml-3">Esc</span> to close
          </span>
          <span>{filtered.length} apps</span>
        </div>
      </div>
    </div>
  );
}
