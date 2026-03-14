"use client";

import Image from "next/image";

interface Props {
  locale?: string;
  landing: {
    title: string;
    terminal: { mainText: string };
  };
}

export function AboutPane({ landing }: Props) {
  return (
    <div className="p-4 font-mono text-xs h-full flex flex-col items-center justify-center gap-4 overflow-auto">
      <div className="relative group">
        <div className="absolute -inset-1.5 rounded-2xl bg-primary/15 blur-lg group-hover:bg-primary/25 transition-all" />
        <div className="relative rounded-2xl overflow-hidden w-32 h-32 border-2 border-primary/30 shadow-lg shadow-primary/10">
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

      <div className="text-center space-y-2 max-w-xs">
        <h1 className="text-sm font-bold text-foreground">
          {landing.title}
          <span className="text-primary">{" <Fredrik/>"}</span>
        </h1>

        <p className="text-muted-foreground text-2xs leading-relaxed">
          {landing.terminal.mainText}
        </p>
      </div>
    </div>
  );
}
