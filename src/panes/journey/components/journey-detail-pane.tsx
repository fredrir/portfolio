"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { isDarkTheme } from "@/lib/themes";
import type { journeyType } from "@/shared/types";

interface Props {
  journey: journeyType;
}

export function JourneyDetailPane({ journey }: Props) {
  const { resolvedTheme } = useTheme();
  const [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(
      isDarkTheme(resolvedTheme)
        ? journey.darkModeImageUri
        : journey.lightModeImageUri,
    );
  }, [resolvedTheme, journey.darkModeImageUri, journey.lightModeImageUri]);

  return (
    <div className="h-full flex flex-col overflow-auto text-sm p-5 space-y-5">
      <div className="flex gap-4 items-start">
        {src && (
          <div className="relative shrink-0 w-16 h-16 rounded-md overflow-hidden bg-background border border-border-faint flex items-center justify-center">
            <Image
              src={src}
              alt={journey.company}
              width={400}
              height={400}
              className="object-contain p-1 w-14 h-14"
            />
          </div>
        )}

        <div className="flex flex-col min-w-0 space-y-1">
          <h2 className="text-base font-semibold text-primary leading-tight">
            {journey.jobTitle}
          </h2>

          <div className="text-sm text-foreground">{journey.company}</div>

          <div className="text-xs text-date-accent tracking-wide">
            {journey.date}
          </div>
        </div>
      </div>

      <div className="border-t border-border-faint" />

      <div className="space-y-2">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {journey.description}
        </p>
      </div>
    </div>
  );
}
