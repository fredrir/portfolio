"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import type { journeyType } from "@/lib/types/types";
import type { Journey } from "@/lib/locale/languageTypes";

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function isActiveJob(dateStr: string): boolean {
  const lower = dateStr.toLowerCase();
  if (lower.includes("present") || lower.includes("nå") || lower.includes("nåværende")) return true;

  const endPart = dateStr.split("-").pop()?.trim().toLowerCase() || "";
  const parts = endPart.split(/\s+/);
  if (parts.length >= 2) {
    const monthNum = MONTHS[parts[0]];
    const year = parseInt(parts[1], 10);
    if (monthNum !== undefined && !isNaN(year)) {
      const endDate = new Date(year, monthNum + 1, 0);
      return endDate >= new Date();
    }
  }
  return false;
}

interface Props {
  journey: Journey;
  onOpenDetail: (journey: journeyType) => void;
}

function CompanyLogo({ journey }: { journey: journeyType }) {
  const { theme } = useTheme();
  const [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(
      theme === "dark" ? journey.darkModeImageUri : journey.lightModeImageUri,
    );
  }, [theme, journey.darkModeImageUri, journey.lightModeImageUri]);

  if (!src) return null;

  return (
    <div className="shrink-0 w-8 h-8 rounded-md overflow-hidden bg-background border border-primary/10 flex items-center justify-center">
      <Image
        src={src}
        alt={journey.company}
        width={28}
        height={28}
        className="object-contain p-0.5"
      />
    </div>
  );
}

export function JourneyPane({ journey, onOpenDetail }: Props) {
  return (
    <div className="p-3 font-mono text-xs h-full flex flex-col">
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> cat ~/.career/log
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
        {journey.journeys.map((j: journeyType) => (
          <button
            key={j.id}
            onClick={() => onOpenDetail(j)}
            className="w-full text-left flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-primary/5 transition-colors group"
          >
            <CompanyLogo journey={j} />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-primary font-semibold truncate text-xs group-hover:underline">
                  {j.jobTitle}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-foreground/80 text-2xs">
                  {j.company}
                </span>
                <span className="text-muted-foreground/30 text-2xs">•</span>
                <span className="text-accent-yellow/60 text-2xs">
                  {j.date}
                </span>
              </div>
            </div>

            {isActiveJob(j.date) && (
              <span className="text-primary/50 text-2xs px-1.5 py-0.5 rounded bg-primary/8 shrink-0">
                active
              </span>
            )}

            <span className="text-primary/20 group-hover:text-primary/50 transition-colors shrink-0">
              ↗
            </span>
          </button>
        ))}
      </div>

      <div className="pt-1 border-t border-primary/10 text-muted-foreground/30 text-2xs mt-1 flex justify-between">
        <span>{journey.journeys.length} entries</span>
        <span className="text-primary/30">click to open</span>
      </div>
    </div>
  );
}
