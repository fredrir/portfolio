"use client";

import { useEffect } from "react";
import { USER_HOST } from "@/lib/constants";
import { WindowFrame } from "../../shell/components/window-frame";

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
      <div className="mx-2" onClick={(e) => e.stopPropagation()}>
        <WindowFrame
          title={<span className="hidden text-primary-subtle md:flex">{title}</span>}
          trailing={<span className="text-primary-subtle text-xs">{USER_HOST}</span>}
          dots="close-only"
          onClose={onClose}
          className="max-h-[80vh] w-full max-w-lg border-wm-border-drag bg-glass-heavy font-mono shadow-2xl shadow-wm-shadow"
          titleBarClassName="px-4 py-2"
        >
          {children}
        </WindowFrame>
      </div>
    </div>
  );
}
