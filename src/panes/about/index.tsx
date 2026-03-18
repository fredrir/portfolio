"use client";

import { AsciiAvatar } from "./components/ascii-avatar";
import { TilingWmIcon } from "./components/tiling-wm-icon";
import { BeerIcon } from "./components/beer-icon";
import { DirewolfIcon } from "./components/direwolf-icon";
import { TerminalConfigIcon } from "./components/terminal-config-icon";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import type { Landing } from "@/shared/types";

interface Props {
  landing: Landing;
  isMobile?: boolean;
}

export function AboutPane({ landing, isMobile }: Props) {
  return (
    <div className="p-3 @sm:p-4 gap-4 @sm:gap-8 h-full flex flex-col @sm:flex-row items-center justify-center overflow-auto">
      <div className="relative">
        <div className="absolute -top-5 -left-5 @xs:-top-7 @xs:-left-7 w-8 h-8 @xs:w-10 @xs:h-10 opacity-20 hover:opacity-40 transition-opacity">
          <TilingWmIcon />
        </div>
        <div className="absolute -top-3 -right-6 @xs:-top-4 @xs:-right-8 w-7 h-7 @xs:w-9 @xs:h-9 opacity-15 hover:opacity-35 transition-opacity">
          <BeerIcon />
        </div>
        <div className="absolute -bottom-4 -left-6 @xs:-bottom-5 @xs:-left-8 w-7 h-7 @xs:w-9 @xs:h-9 opacity-15 hover:opacity-35 transition-opacity">
          <DirewolfIcon />
        </div>
        <div className="absolute -bottom-3 -right-5 @xs:-bottom-4 @xs:-right-7 w-8 h-8 @xs:w-10 @xs:h-10 opacity-20 hover:opacity-40 transition-opacity">
          <TerminalConfigIcon />
        </div>

        <div className="group">
          <div className="absolute -inset-1.5 " />
          <div className="relative  p-2 @md:p-3 transition-all">
            <AsciiAvatar isMobile={isMobile} />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-start flex flex-col h-full mt-4 space-y-1.5 max-w-xs @lg:max-w-sm">
          <h1 className="text-sm @md:text-base font-bold text-foreground">
            {landing.title}
            <span className="text-primary">{" <Fredrik/>"}</span>
          </h1>
          <p className="text-muted-foreground text-3xs @xs:text-2xs @md:text-xs leading-relaxed">
            {landing.mainText}
          </p>
          <div className="pt-1.5  space-y-2 mt-auto text-3xs @xs:text-2xs @md:text-xs">
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
