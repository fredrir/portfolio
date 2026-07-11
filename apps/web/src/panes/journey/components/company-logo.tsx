"use client";

import { useState, useEffect } from "react";
import Image from "@/shared/components/image";
import { useTheme } from "next-themes";
import { isDarkTheme } from "@/lib/themes";
import type { journeyType } from "@/shared/types";

export function CompanyLogo({ journey }: { journey: journeyType }) {
  const { resolvedTheme } = useTheme();
  const [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(
      isDarkTheme(resolvedTheme)
        ? journey.darkModeImageUri
        : journey.lightModeImageUri,
    );
  }, [resolvedTheme, journey.darkModeImageUri, journey.lightModeImageUri]);

  if (!src) return null;

  return (
    <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden bg-background border border-border-faint flex items-center justify-center p-1">
      <Image
        src={src}
        alt={journey.company}
        width={75}
        height={75}
        className="object-contain w-8 h-8"
      />
    </div>
  );
}
