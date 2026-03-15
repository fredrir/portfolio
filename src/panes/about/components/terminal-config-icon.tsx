export function TerminalConfigIcon() {
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
