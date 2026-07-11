"use client";

import { cn } from "@/shared/utils/cn";

interface Props {
  children: React.ReactNode;
  isFloating?: boolean;
}

export function SpeechBubble({ children, isFloating = false }: Props) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border-medium bg-glass-heavy shadow-lg shadow-wm-shadow-soft backdrop-blur-xl",
        isFloating ? "" : "sm:min-w-lg lg:min-w-xl",
      )}
    >
      <div className="absolute right-8 -bottom-2 -z-0 h-4 w-4 rotate-45 border-border-medium border-r border-b bg-glass-heavy" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
