"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { isDarkTheme } from "@/lib/themes";
import Image from "@/shared/components/image";
import type { journeyType } from "@/shared/types";

export function CompanyLogo({ journey }: { journey: journeyType }) {
  const { resolvedTheme } = useTheme();
  const [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(isDarkTheme(resolvedTheme) ? journey.darkModeImageUri : journey.lightModeImageUri);
  }, [resolvedTheme, journey.darkModeImageUri, journey.lightModeImageUri]);

  if (!src) return null;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border-faint bg-background p-1">
      <Image
        src={src}
        alt={journey.company}
        width={75}
        height={75}
        className="h-8 w-8 object-contain"
      />
    </div>
  );
}
