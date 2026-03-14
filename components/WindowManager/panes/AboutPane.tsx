"use client";

import Image from "next/image";
import Link from "next/link";
import Neofetch from "@/components/Neofetch";

interface Props {
  locale?: string;
  landing: {
    title: string;
    terminal: { mainText: string };
  };
}

export function AboutPane({ locale, landing }: Props) {
  return (
    <div className="p-4 font-mono text-xs h-full flex flex-col overflow-auto gap-4">
      <div className="text-muted-foreground/50">
        <span className="text-primary">$</span> neofetch && whoami
      </div>

      <div className="flex gap-6 items-start">
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/30 transition-all" />
            <div className="relative rounded-full overflow-hidden w-28 h-28 border-2 border-primary/30">
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

          <h1 className="text-sm font-bold text-foreground text-center">
            {landing.title}
            <span className="text-primary">{" <Fredrik/>"}</span>
          </h1>
        </div>

        <div className="flex-1 min-w-0">
          <Neofetch animate locale={locale} hideLogo />
        </div>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap border-t border-primary/10 pt-3">
        {landing.terminal.mainText}
      </p>

      <div className="flex flex-wrap gap-3 text-2xs mt-auto pt-2 border-t border-primary/10">
        <Link
          href="https://github.com/fredrir"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="text-primary/30"></span>
          github.com/fredrir
        </Link>
        <Link
          href="https://www.linkedin.com/in/fredrir"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="text-primary/30"></span>
          linkedin.com/in/fredrir
        </Link>
        <Link
          href="https://github.com/fredrir/dotfiles"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="text-primary/30"></span>
          ~/dotfiles
        </Link>
        <Link
          href="mailto:fhansteen@gmail.com"
          className="text-primary/60 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="text-primary/30"></span>
          fhansteen@gmail.com
        </Link>
      </div>
    </div>
  );
}
