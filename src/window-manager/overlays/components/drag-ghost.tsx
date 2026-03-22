import type { WindowConfig } from "../../types";
import { WindowFrame } from "../../shell/components/window-frame";

interface Props {
  config: WindowConfig;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  children: React.ReactNode;
}

export function DragGhost({ config, pos, size, children }: Props) {
  return (
    <div
      className="fixed z-9990 pointer-events-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        opacity: 0.85,
      }}
    >
      <WindowFrame
        title={<span className="text-faded">{config.title}</span>}
        dots="static"
        className="h-full border-chart-fill bg-glass-faint shadow-2xl shadow-surface-selected"
        titleBarClassName="py-1.5 bg-surface-dim"
        contentClassName="opacity-40 overflow-hidden"
      >
        {children}
      </WindowFrame>
    </div>
  );
}
