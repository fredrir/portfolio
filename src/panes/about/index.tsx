"use client";

import { TilingWmIcon } from "./components/tiling-wm-icon";
import { BeerIcon } from "./components/beer-icon";
import { DirewolfIcon } from "./components/direwolf-icon";
import { TerminalConfigIcon } from "./components/terminal-config-icon";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import type { Landing } from "@/shared/types";
import { FredVatar } from "./fredvatar";

interface Props {
  landing: Landing;
}

export function AboutPane({ landing }: Props) {
  return (
    <div className="p-3 @sm:p-4 @xl:p-6 gap-3 @sm:gap-6 @xl:gap-8 h-full flex flex-col @sm:flex-row items-center justify-center overflow-auto">
      <div className="flex flex-col items-center shrink-0">
        <div className="flex flex-col items-center @xs:hidden -mb-2">
          <div className="bg-muted border border-border rounded-2xl px-3 py-1.5 text-xs font-bold text-foreground">
            {landing.title}
            <span className="text-primary">{" <Fredrik/>"}</span>
          </div>
          <div className="w-2.5 h-2.5 bg-muted border border-border rounded-full mt-1" />
          <div className="w-1.5 h-1.5 bg-muted border border-border rounded-full mt-0.5" />
        </div>
        <div className="relative">
          <div className="absolute -top-5 -left-5 @xs:-top-7 @xs:-left-7 @xl:-top-9 @xl:-left-9 w-8 h-8 @xs:w-10 @xs:h-10 @xl:w-12 @xl:h-12 opacity-20 hover:opacity-40 transition-opacity">
            <TilingWmIcon />
          </div>
          <div className="absolute -top-3 -right-6 @xs:-top-4 @xs:-right-8 @xl:-top-6 @xl:-right-10 w-7 h-7 @xs:w-9 @xs:h-9 @xl:w-11 @xl:h-11 opacity-15 hover:opacity-35 transition-opacity">
            <BeerIcon />
          </div>
          <div className="absolute -bottom-4 -left-6 @xs:-bottom-5 @xs:-left-8 @xl:-bottom-7 @xl:-left-10 w-7 h-7 @xs:w-9 @xs:h-9 @xl:w-11 @xl:h-11 opacity-15 hover:opacity-35 transition-opacity">
            <DirewolfIcon />
          </div>
          <div className="absolute -bottom-3 -right-5 @xs:-bottom-4 @xs:-right-7 @xl:-bottom-6 @xl:-right-9 w-8 h-8 @xs:w-10 @xs:h-10 @xl:w-12 @xl:h-12 opacity-20 hover:opacity-40 transition-opacity">
            <TerminalConfigIcon />
          </div>
          <div className="group">
            <div className="absolute -inset-1.5" />
            <div className="relative p-2 @lg:p-3 @xl:p-4 transition-all">
              <FredVatar />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col min-w-0">
        <div className="hidden @xs:inline-flex items-end gap-1.5 mb-2 @xl:mb-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-muted border border-border rounded-full" />
            <div className="w-2 h-2 bg-muted border border-border rounded-full" />
          </div>
          <div className="bg-muted border border-border rounded-2xl px-3 py-1.5 @xl:px-4 @xl:py-2 text-sm font-bold text-foreground">
            {landing.title}
            <span className="text-primary">{" <Fredrik/>"}</span>
          </div>
        </div>
        <div className="text-start flex flex-col h-full space-y-1.5 @xl:space-y-2.5 max-w-xs @lg:max-w-sm @xl:max-w-md">
          <p className="text-muted-foreground text-xs leading-relaxed">
            {landing.mainText}
          </p>
          <div className="pt-1.5 space-y-2 @xl:space-y-2.5 mt-auto text-xs @xl:text-sm">
            <a
              href="mailto:fhansteen@gmail.com"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group/link"
            >
              <EnvelopeIcon
                weight="bold"
                className="w-3 h-3 @xl:w-4 @xl:h-4 text-primary opacity-60 group-hover/link:opacity-100 transition-opacity"
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
                className="w-3 h-3 @xl:w-4 @xl:h-4 text-primary opacity-60 group-hover/link:opacity-100 transition-opacity"
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
