"use client";

import Image from "next/image";
import Neofetch from "@/components/Neofetch";
import Link from "next/link";

interface Props {
  locale?: string;
  landing: {
    title: string;
    terminal: { mainText: string };
  };
}

export function NeofetchPane({ locale, landing }: Props) {
  return (
    <div className="p-3 font-mono text-xs h-full flex flex-col">
      <div className="text-muted-foreground/50 mb-3">
        <span className="text-primary">$</span> neofetch
      </div>

      <div className="flex gap-6 items-start flex-1 min-h-0">
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="rounded-full overflow-hidden w-20 h-20 border border-primary/20">
            <Image
              src="/Fredrik_Carsten_Hansteen.png"
              alt="Fredrik Carsten Hansteen"
              priority
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>
          <Neofetch animate={false} locale={locale} hideLogo />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {landing.title}
              <span className="text-primary">{" <Fredrik/>"}</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap">
            {landing.terminal.mainText}
          </p>
          <div className="pt-2 border-t border-primary/10 flex flex-wrap gap-3">
            <Link
              href="https://github.com/fredrir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
            >
              github.com/fredrir
            </Link>
            <Link
              href="https://www.linkedin.com/in/fredrir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
            >
              linkedin.com/in/fredrir
            </Link>
            <Link
              href="https://github.com/fredrir/dotfiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
            >
              ~/dotfiles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
