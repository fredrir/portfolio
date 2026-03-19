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
        "relative bg-glass-heavy backdrop-blur-xl border border-border-medium rounded-xl p-4 md:p-6 shadow-lg shadow-wm-shadow-soft",
        isFloating ? "" : "sm:min-w-lg lg:min-w-xl",
      )}
    >
      <div className="absolute -bottom-2 right-8 w-4 h-4 bg-glass-heavy border-b border-r border-border-medium rotate-45 -z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
