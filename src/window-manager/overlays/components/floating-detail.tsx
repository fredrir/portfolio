"use client";

import { useEffect } from "react";
import { USER_HOST } from "@/lib/constants";
import { cn } from "@/shared/utils/cn";

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
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-overlay-medium backdrop-blur-sm"
      onClick={onClose}
    >
      {" "}
      <div className="mx-2">
        <div
          className="w-full max-w-lg max-h-[80vh] rounded-xl border border-wm-border-drag bg-glass-heavy backdrop-blur-md shadow-2xl shadow-wm-shadow overflow-hidden flex flex-col font-mono"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-wm-border bg-surface-faint shrink-0">
            <div className="flex items-center gap-2.5">
              <button onClick={onClose} className="group">
                <div className="w-4 h-4 rounded-full bg-wm-close group-hover:bg-destructive transition-colors" />
              </button>
            </div>
            <span
              className={cn(
                "text-xs hidden md:flex text-primary-subtle truncate mx-2",
              )}
            >
              {title}
            </span>
            <span className="text-xs text-primary-subtle">{USER_HOST}</span>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
