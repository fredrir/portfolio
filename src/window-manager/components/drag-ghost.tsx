import type { WindowConfig } from "../types";

interface Props {
  config: WindowConfig;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  children: React.ReactNode;
}

export function DragGhost({ config, pos, size, children }: Props) {
  return (
    <div
      className="fixed z-9990 pointer-events-none rounded-xl border border-chart-fill bg-glass-faint backdrop-blur-md shadow-2xl shadow-surface-selected overflow-hidden flex flex-col"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        opacity: 0.85,
      }}
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-wm-border bg-surface-dim shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-full bg-wm-close" />
          <div className="w-3.5 h-3.5 rounded-full bg-wm-minimize" />
          <div className="w-3.5 h-3.5 rounded-full bg-wm-maximize" />
        </div>
        <span className="font-mono text-xs text-faded truncate mx-2">
          {config.title}
        </span>
        <span className="font-mono text-xs text-primary-subtle"></span>
      </div>
      <div className="flex-1 overflow-hidden opacity-40">{children}</div>
    </div>
  );
}
