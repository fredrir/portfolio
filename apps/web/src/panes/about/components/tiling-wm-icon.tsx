export function TilingWmIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" fill="none">
      <rect
        x="2"
        y="2"
        width="20"
        height="28"
        rx="2"
        className="stroke-primary-soft"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="26"
        y="2"
        width="20"
        height="13"
        rx="2"
        className="stroke-primary-soft"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="26"
        y="19"
        width="20"
        height="11"
        rx="2"
        className="stroke-primary-soft"
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="2"
        y="34"
        width="44"
        height="12"
        rx="2"
        className="stroke-primary-soft"
        strokeWidth="1.5"
        fill="none"
      />
      <line x1="6" y1="8" x2="16" y2="8" className="stroke-chart-fill" strokeWidth="1" />
      <line x1="6" y1="11" x2="14" y2="11" className="stroke-primary-subtle" strokeWidth="1" />
      <line x1="6" y1="14" x2="18" y2="14" className="stroke-surface-strong" strokeWidth="1" />
      <circle cx="31" cy="8" r="1.5" className="fill-icon-close" />
      <circle cx="35" cy="8" r="1.5" className="fill-icon-minimize" />
      <circle cx="39" cy="8" r="1.5" className="fill-primary-muted" />
      <text x="6" y="41" className="fill-primary-muted" fontSize="5" fontFamily="monospace">
        $ _
      </text>
    </svg>
  );
}
