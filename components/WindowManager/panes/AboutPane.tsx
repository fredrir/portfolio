"use client";

import Image from "next/image";

interface Props {
  locale?: string;
  landing: {
    title: string;
    terminal: { mainText: string };
  };
}

function TilingWmIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <rect
        x="2"
        y="2"
        width="20"
        height="28"
        rx="2"
        className="stroke-primary/60"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="26"
        y="2"
        width="20"
        height="13"
        rx="2"
        className="stroke-primary/60"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="26"
        y="19"
        width="20"
        height="11"
        rx="2"
        className="stroke-primary/60"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="2"
        y="34"
        width="44"
        height="12"
        rx="2"
        className="stroke-primary/60"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="6"
        y1="8"
        x2="16"
        y2="8"
        className="stroke-primary/40"
        strokeWidth="1"
      />
      <line
        x1="6"
        y1="11"
        x2="14"
        y2="11"
        className="stroke-primary/30"
        strokeWidth="1"
      />
      <line
        x1="6"
        y1="14"
        x2="18"
        y2="14"
        className="stroke-primary/25"
        strokeWidth="1"
      />
      <circle cx="31" cy="8" r="1.5" className="fill-destructive/50" />
      <circle cx="35" cy="8" r="1.5" className="fill-accent-yellow/50" />
      <circle cx="39" cy="8" r="1.5" className="fill-primary/50" />
      <text
        x="6"
        y="41"
        className="fill-primary/50"
        fontSize="5"
        fontFamily="monospace"
      >
        $ _
      </text>
    </svg>
  );
}

function BeerIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <path
        d="M12 10 L12 40 Q12 44 16 44 L28 44 Q32 44 32 40 L32 10 Z"
        className="stroke-primary/60"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M32 16 L38 16 Q42 16 42 20 L42 28 Q42 32 38 32 L32 32"
        className="stroke-primary/40"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M14 10 L30 10" className="stroke-primary/30" strokeWidth="1" />
      <ellipse cx="18" cy="18" rx="1.5" ry="2" className="fill-primary/15" />
      <ellipse cx="24" cy="20" rx="1" ry="1.5" className="fill-primary/15" />
      <ellipse cx="20" cy="24" rx="1.5" ry="2" className="fill-primary/10" />
      <path d="M14 34 L30 34" className="stroke-primary/15" strokeWidth="0.5" />
      <path
        d="M16 6 Q18 2 20 6"
        className="stroke-primary/20"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M22 4 Q24 0 26 4"
        className="stroke-primary/15"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M20 8 Q22 4 24 8"
        className="stroke-primary/20"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

function DirewolfIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <path
        d="M8 38 Q8 28 14 24 Q10 20 12 14 Q14 8 20 8 L22 6 Q24 4 26 6 L28 8 Q34 8 36 14 Q38 20 34 24 Q40 28 40 38"
        className="stroke-primary/60"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="18" r="1.5" className="fill-primary/50" />
      <circle cx="29" cy="18" r="1.5" className="fill-primary/50" />
      <path
        d="M22 24 L24 26 L26 24"
        className="stroke-primary/40"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 30 Q24 33 28 30"
        className="stroke-primary/30"
        strokeWidth="1"
        fill="none"
      />
      <path d="M8 38 L40 38" className="stroke-primary/20" strokeWidth="1" />
      <path d="M14 42 L16 38" className="stroke-primary/25" strokeWidth="1" />
      <path d="M34 42 L32 38" className="stroke-primary/25" strokeWidth="1" />
    </svg>
  );
}

function TerminalConfigIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <rect
        x="4"
        y="6"
        width="40"
        height="36"
        rx="3"
        className="stroke-primary/60"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="4"
        y="6"
        width="40"
        height="8"
        rx="3"
        className="stroke-primary/60 fill-primary/[0.04]"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="10" r="1.5" className="fill-destructive/50" />
      <circle cx="15" cy="10" r="1.5" className="fill-accent-yellow/50" />
      <circle cx="20" cy="10" r="1.5" className="fill-primary/50" />
      <text
        x="8"
        y="22"
        className="fill-primary/50"
        fontSize="4"
        fontFamily="monospace"
      >
        bind = SUPER, Q
      </text>
      <text
        x="8"
        y="27"
        className="fill-primary/35"
        fontSize="4"
        fontFamily="monospace"
      >
        monitor = ,auto
      </text>
      <text
        x="8"
        y="32"
        className="fill-primary/25"
        fontSize="4"
        fontFamily="monospace"
      >
        gaps_in = 4
      </text>
      <text
        x="8"
        y="37"
        className="fill-primary/20"
        fontSize="4"
        fontFamily="monospace"
      >
        rounding = 8
      </text>
    </svg>
  );
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
