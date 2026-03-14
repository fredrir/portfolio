"use client";

import Neofetch from "@/components/Neofetch";

interface Props {
  locale?: string;
}

export function NeofetchPane({ locale }: Props) {
  return (
    <div className="p-4 font-mono text-xs h-full flex flex-col overflow-auto">
      <div className="text-muted-foreground/50 mb-3">
        <span className="text-primary">$</span> neofetch
      </div>
      <Neofetch animate locale={locale} />
    </div>
  );
}
