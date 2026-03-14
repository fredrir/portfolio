"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  landing: {
    title: string;
    terminal: { mainText: string };
  };
}

export function AboutPane({ landing }: Props) {
  return (
    <div className="p-4 font-mono text-xs h-full flex flex-col overflow-auto">
      <div className="text-muted-foreground/50 mb-3">
        <span className="text-primary">$</span> whoami
      </div>

      <div className="flex gap-5 items-start flex-1 min-h-0">
        <div className="shrink-0">
          <div className="rounded-full overflow-hidden w-20 h-20 border-2 border-primary/20 shadow-lg shadow-primary/5">
            <Image
              src="/Fredrik_Carsten_Hansteen.png"
              alt="Fredrik Carsten Hansteen"
              priority
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <h1 className="text-base font-bold text-foreground">
            {landing.title}
            <span className="text-primary">{" <Fredrik/>"}</span>
          </h1>

          <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap">
            {landing.terminal.mainText}
          </p>

          <div className="pt-2 border-t border-primary/10 flex flex-wrap gap-x-4 gap-y-1 text-2xs">
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
            <Link
              href="mailto:fhansteen@gmail.com"
              className="text-primary/60 hover:text-primary transition-colors"
            >
               fhansteen@gmail.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
