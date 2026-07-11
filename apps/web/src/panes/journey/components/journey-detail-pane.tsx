"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { isDarkTheme } from "@/lib/themes";
import Image from "@/shared/components/image";
import type { journeyType } from "@/shared/types";

interface Props {
  journey: journeyType;
}

export function JourneyDetailPane({ journey }: Props) {
  const { resolvedTheme } = useTheme();
  const [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(isDarkTheme(resolvedTheme) ? journey.darkModeImageUri : journey.lightModeImageUri);
  }, [resolvedTheme, journey.darkModeImageUri, journey.lightModeImageUri]);

  return (
    <div className="flex h-full flex-col space-y-5 overflow-auto p-5 text-sm">
      <div className="flex items-start gap-4">
        {src && (
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border-faint bg-background">
            <Image
              src={src}
              alt={journey.company}
              width={400}
              height={400}
              className="h-14 w-14 object-contain p-1"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-col space-y-1">
          <h2 className="font-semibold text-base text-primary leading-tight">{journey.jobTitle}</h2>

          <div className="text-base text-foreground">{journey.company}</div>

          <div className="text-date-accent text-xs tracking-wide">{journey.date}</div>
        </div>
      </div>

      <div className="border-border-faint border-t" />

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm leading-relaxed">{journey.description}</p>
      </div>
    </div>
  );
}
