"use client";

import { useEffect } from "react";

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function FloatingDetail({ title, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] rounded-xl border border-primary/30 bg-background/95 backdrop-blur-md shadow-2xl shadow-primary/10 overflow-hidden flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-primary/15 bg-primary/[0.03] shrink-0">
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} className="group">
              <div className="w-3.5 h-3.5 rounded-full bg-destructive/60 group-hover:bg-destructive transition-colors" />
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow/60" />
            <div className="w-3.5 h-3.5 rounded-full bg-primary/60" />
          </div>
          <span className="text-2xs text-muted-foreground/50 truncate mx-2">
            {title}
          </span>
          <span className="text-3xs text-primary/30">fredrir@hansteen</span>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
