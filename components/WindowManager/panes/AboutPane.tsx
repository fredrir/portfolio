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
    <div className="p-4 font-mono text-xs h-full flex flex-col overflow-auto">
      <div className="text-muted-foreground/50 mb-3">
        <span className="text-primary">$</span> neofetch && whoami
      </div>

      <div className="flex gap-4 items-start flex-1 min-h-0">
        <div className="flex-1 min-w-0">
          <Neofetch animate locale={locale} />

          <div className="mt-3 pt-3 border-t border-primary/10 space-y-2">
            <h1 className="text-sm font-bold text-foreground">
              {landing.title}
              <span className="text-primary">{" <Fredrik/>"}</span>
            </h1>

            <p className="text-muted-foreground text-2xs leading-relaxed">
              {landing.terminal.mainText}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-3">
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

          <div className="flex flex-col gap-1 text-2xs text-center">
            <Link
              href="https://github.com/fredrir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/50 hover:text-primary transition-colors"
            >
               github
            </Link>
            <Link
              href="https://www.linkedin.com/in/fredrir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/50 hover:text-primary transition-colors"
            >
               linkedin
            </Link>
            <Link
              href="https://github.com/fredrir/dotfiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/50 hover:text-primary transition-colors"
            >
               dotfiles
            </Link>
            <Link
              href="mailto:fhansteen@gmail.com"
              className="text-primary/50 hover:text-primary transition-colors"
            >
               email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
