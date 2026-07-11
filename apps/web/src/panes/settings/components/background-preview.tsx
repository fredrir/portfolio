import type { BackgroundConfig } from "@/window-manager/types";

function StarfieldPreview() {
  const dots = [
    { cx: 4, cy: 3, r: 0.8 },
    { cx: 12, cy: 6, r: 1 },
    { cx: 8, cy: 10, r: 0.6 },
    { cx: 18, cy: 4, r: 0.7 },
    { cx: 15, cy: 12, r: 0.9 },
    { cx: 6, cy: 14, r: 0.5 },
    { cx: 20, cy: 9, r: 0.6 },
    { cx: 10, cy: 2, r: 0.7 },
  ];

  return (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <rect width="24" height="16" className="fill-background" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} className="fill-chart-fill" />
      ))}
      <line x1="4" y1="3" x2="12" y2="6" className="stroke-wm-border" strokeWidth="0.3" />
      <line x1="12" y1="6" x2="18" y2="4" className="stroke-wm-border" strokeWidth="0.3" />
      <line x1="8" y1="10" x2="15" y2="12" className="stroke-wm-border" strokeWidth="0.3" />
    </svg>
  );
}

function MatrixPreview() {
  const cols = [
    { x: 3, chars: "ア1ウ", y: 2 },
    { x: 8, chars: "0キ3", y: 5 },
    { x: 13, chars: "セ7ノ", y: 1 },
    { x: 18, chars: "2ヲ4", y: 4 },
  ];

  return (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <rect width="24" height="16" className="fill-background" />
      {cols.map((col, i) =>
        col.chars.split("").map((ch, j) => (
          <text
            key={`${i}-${j}`}
            x={col.x}
            y={col.y + j * 4}
            fontSize="3"
            className="fill-primary-subtle"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {ch}
          </text>
        )),
      )}
    </svg>
  );
}

function GridPreview() {
  return (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <rect width="24" height="16" className="fill-background" />
      {[4, 8, 12, 16, 20].map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="16"
          className="stroke-surface-soft"
          strokeWidth="0.3"
        />
      ))}
      {[4, 8, 12].map((y) => (
        <line
          key={`h${y}`}
          x1="0"
          y1={y}
          x2="24"
          y2={y}
          className="stroke-surface-soft"
          strokeWidth="0.3"
        />
      ))}
    </svg>
  );
}

function GradientPreview() {
  return (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <defs>
        <radialGradient id="gp" cx="50%" cy="0%" r="80%">
          <stop offset="0%" className="[stop-color:var(--color-primary)]" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="24" height="16" className="fill-background" />
      <rect width="24" height="16" fill="url(#gp)" />
    </svg>
  );
}

function PlainPreview() {
  return (
    <svg viewBox="0 0 24 16" className="h-full w-full">
      <defs>
        <radialGradient id="pp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" className="[stop-color:var(--color-primary)]" stopOpacity="0.05" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="24" height="16" className="fill-background" />
      <rect width="24" height="16" fill="url(#pp)" />
    </svg>
  );
}

export function BackgroundPreview({ config }: { config: BackgroundConfig }) {
  return (
    <div className="aspect-[3/2] w-full overflow-hidden rounded-sm border border-control-border">
      {config.type === "animated-dots" && <StarfieldPreview />}
      {config.type === "matrix" && <MatrixPreview />}
      {config.type === "grid" && <GridPreview />}
      {config.type === "gradient" && <GradientPreview />}
      {config.type === "plain" && <PlainPreview />}
    </div>
  );
}
