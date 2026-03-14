"use client";

import { useState } from "react";
import type { journeyType } from "@/lib/types/types";
import type { Journey } from "@/lib/locale/languageTypes";

interface Props {
  journey: Journey;
}

export function JourneyPane({ journey }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="p-3 font-mono text-xs h-full flex flex-col">
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> cat ~/.career/log
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {journey.journeys.map((j: journeyType) => (
          <div key={j.id}>
            <button
              onClick={() =>
                setExpandedId(expandedId === j.id ? null : j.id)
              }
              className="w-full text-left flex items-start gap-2 py-1 px-1 rounded hover:bg-primary/5 transition-colors group"
            >
              <span className="text-primary/40 shrink-0 mt-0.5">
                {expandedId === j.id ? "▼" : "▶"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-accent-yellow/70 text-2xs shrink-0">
                    [{j.date}]
                  </span>
                  <span className="text-primary font-semibold truncate">
                    {j.jobTitle}
                  </span>
                  <span className="text-muted-foreground/40">@</span>
                  <span className="text-foreground">{j.company}</span>
                </div>
              </div>
            </button>

            {expandedId === j.id && (
              <div className="ml-5 pl-3 border-l border-primary/10 py-1 mb-1">
                <p className="text-muted-foreground leading-relaxed">
                  {j.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-1 border-t border-primary/10 text-muted-foreground/30 text-2xs mt-1">
        {journey.journeys.length} entries
      </div>
    </div>
  );
}
