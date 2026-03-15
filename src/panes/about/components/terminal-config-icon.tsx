export function TerminalConfigIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <rect
        x="4"
        y="6"
        width="40"
        height="36"
        rx="3"
        className="stroke-primary-soft"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="4"
        y="6"
        width="40"
        height="8"
        rx="3"
        className="stroke-primary-soft fill-wm-titlebar"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="10" r="1.5" className="fill-icon-close" />
      <circle cx="15" cy="10" r="1.5" className="fill-icon-minimize" />
      <circle cx="20" cy="10" r="1.5" className="fill-primary-muted" />
      <text
        x="8"
        y="22"
        className="fill-primary-muted"
        fontSize="4"
        fontFamily="monospace"
      >
        bind = SUPER, Q
      </text>
      <text
        x="8"
        y="27"
        className="fill-chart-fill"
        fontSize="4"
        fontFamily="monospace"
      >
        monitor = ,auto
      </text>
      <text
        x="8"
        y="32"
        className="fill-surface-strong"
        fontSize="4"
        fontFamily="monospace"
      >
        gaps_in = 4
      </text>
      <text
        x="8"
        y="37"
        className="fill-surface-selected"
        fontSize="4"
        fontFamily="monospace"
      >
        rounding = 8
      </text>
    </svg>
  );
}
