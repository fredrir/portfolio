"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import type { journeyType } from "@/lib/types/types";

interface Props {
  journey: journeyType;
}

export function JourneyDetailPane({ journey }: Props) {
  const { theme } = useTheme();
  const [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(
      theme === "dark" ? journey.darkModeImageUri : journey.lightModeImageUri,
    );
  }, [theme, journey.darkModeImageUri, journey.lightModeImageUri]);

  return (
    <div className="p-4 font-mono text-xs h-full flex flex-col overflow-auto">
      <div className="text-muted-foreground/50 mb-3">
        <span className="text-primary">$</span> cat ~/.career/{journey.company.toLowerCase().replace(/\s+/g, "-")}.md
      </div>

      <div className="flex gap-4 items-start mb-4">
        {src && (
          <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-background border border-primary/15 flex items-center justify-center">
            <Image
              src={src}
              alt={journey.company}
              width={48}
              height={48}
              className="object-contain p-1"
            />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-primary">{journey.jobTitle}</h2>
          <div className="text-foreground/80 text-xs mt-0.5">
            {journey.company}
          </div>
          <div className="text-accent-yellow/60 text-2xs mt-0.5">
            {journey.date}
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10 pt-3">
        <p className="text-muted-foreground leading-relaxed text-xs">
          {journey.description}
        </p>
      </div>
    </div>
  );
}
