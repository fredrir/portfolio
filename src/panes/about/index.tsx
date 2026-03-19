"use client";

import { EnvelopeIcon } from "@phosphor-icons/react";
import { PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import type { Landing } from "@/shared/types";
import { FredVatar } from "./fredvatar";

interface Props {
  landing: Landing;
}

export function AboutPane({ landing }: Props) {
  return (
    <div className="p-4 gap-3  h-full flex flex-row items-center justify-center overflow-auto">
      <FredVatar />
      <div className="flex flex-col min-w-0">
        <div className="inline-flex items-end gap-1.5 mb-2 @xl:mb-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-overlay-medium border border-border rounded-full" />
            <div className="w-2 h-2 bg-overlay-medium border border-border rounded-full" />
          </div>
          <div className="bg-overlay-medium border border-border rounded-2xl px-3 py-1.5 @xl:px-4 @xl:py-2 text-sm font-bold text-foreground">
            {landing.title}
            <span className="text-primary">{" <Fredrik/>"}</span>
          </div>
        </div>
        <div className="text-start flex flex-col h-full space-y-1.5 @xl:space-y-2.5 max-w-xs @lg:max-w-sm @xl:max-w-md">
          <p className="text-muted-foreground text-xs leading-relaxed">
            {landing.mainText}
          </p>
          <div className="pt-1.5 space-y-2 @xl:space-y-2.5 mt-auto text-xs">
            <a
              href="mailto:fhansteen@gmail.com"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group/link"
            >
              <EnvelopeIcon
                weight="bold"
                className="w-3 h-3 text-primary opacity-60 group-hover/link:opacity-100 transition-opacity"
              />
              <span className="text-primary/70">~</span>
              fhansteen@gmail.com
            </a>
            <a
              href="tel:+4747630231"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group/link"
            >
              <PhoneIcon
                weight="bold"
                className="w-3 h-3 text-primary opacity-60 group-hover/link:opacity-100 transition-opacity"
              />
              <span className="text-primary/70">~</span>
              +47 476 30 231
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
