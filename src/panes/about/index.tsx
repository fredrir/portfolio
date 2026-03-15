"use client";

import Image from "next/image";
import { TilingWmIcon } from "./components/tiling-wm-icon";
import { BeerIcon } from "./components/beer-icon";
import { DirewolfIcon } from "./components/direwolf-icon";
import { TerminalConfigIcon } from "./components/terminal-config-icon";

interface Props {
  locale?: string;
  landing: {
    title: string;
    terminal: { mainText: string };
  };
}

export function AboutPane({ landing }: Props) {
  return (
    <div className="p-3 @sm:p-4 gap-8 font-mono text-xs h-full flex flex-row items-center justify-center overflow-auto @container">
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
          <div className="absolute -inset-1.5 rounded-2xl bg-primary/15 blur-lg group-hover:bg-primary/25 transition-all" />
          <div className="relative rounded-2xl overflow-hidden w-24 h-24 @xs:w-28 @xs:h-28 @md:w-36 @md:h-36 @lg:w-40 @lg:h-40 border-2 border-primary/30 shadow-lg shadow-primary/10 transition-all">
            <Image
              src="/Fredrik_Carsten_Hansteen.png"
              alt="Fredrik Carsten Hansteen"
              priority
              width={256}
              height={256}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="text-start mt-4 space-y-1.5 max-w-xs @lg:max-w-sm">
        <h1 className="text-xs @sm:text-sm @md:text-base font-bold text-foreground">
          {landing.title}
          <span className="text-primary">{" <Fredrik/>"}</span>
        </h1>
        <p className="text-muted-foreground text-3xs @xs:text-2xs @md:text-xs leading-relaxed">
          {landing.terminal.mainText}
        </p>
      </div>
    </div>
  );
}
