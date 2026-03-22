"use client";

import { cn } from "@/shared/utils/cn";

type DotVariant = "interactive" | "close-only" | "static";

interface Props {
  title: React.ReactNode;
  trailing?: React.ReactNode;
  dots?: DotVariant;
  className?: string;
  titleBarClassName?: string;
  contentClassName?: string;
  onClose?: () => void;
  onMaximize?: () => void;
  onTitleBarMouseDown?: (e: React.MouseEvent) => void;
  onTitleBarDoubleClick?: () => void;
  children: React.ReactNode;
}

function Dot({
  color,
  hoverColor,
  onClick,
  interactive,
}: {
  color: string;
  hoverColor?: string;
  onClick?: () => void;
  interactive: boolean;
}) {
  if (!interactive) {
    return <div className={cn("w-3 h-3 rounded-full", color)} />;
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className="group p-1.5"
    >
      <div
        className={cn(
          "w-3 h-3 rounded-full transition-colors",
          color,
          hoverColor && `group-hover:${hoverColor}`,
        )}
      />
    </button>
  );
}

function TitleDots({
  variant,
  onClose,
  onMaximize,
}: {
  variant: DotVariant;
  onClose?: () => void;
  onMaximize?: () => void;
}) {
  if (variant === "static") {
    return (
      <div className="flex items-center gap-2.5">
        <div className="w-3.5 h-3.5 rounded-full bg-wm-close" />
        <div className="w-3.5 h-3.5 rounded-full bg-wm-minimize" />
        <div className="w-3.5 h-3.5 rounded-full bg-wm-maximize" />
      </div>
    );
  }

  if (variant === "close-only") {
    return (
      <div className="flex items-center gap-2.5">
        <button onClick={onClose} className="group">
          <div className="w-4 h-4 rounded-full bg-wm-close group-hover:bg-destructive transition-colors" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center -ml-1.5">
      <Dot
        color="bg-wm-close"
        hoverColor="bg-destructive"
        onClick={onClose}
        interactive
      />
      <Dot
        color="bg-wm-minimize"
        hoverColor="bg-accent-yellow"
        onClick={onClose}
        interactive
      />
      <Dot
        color="bg-wm-maximize"
        hoverColor="bg-primary"
        onClick={onMaximize}
        interactive
      />
    </div>
  );
}

export function WindowFrame({
  title,
  trailing,
  dots = "interactive",
  className,
  titleBarClassName,
  contentClassName,
  onClose,
  onMaximize,
  onTitleBarMouseDown,
  onTitleBarDoubleClick,
  children,
}: Props) {
  return (
    <div className={cn("rounded-xl border backdrop-blur-md overflow-hidden flex flex-col", className)}>
      <div
        className={cn(
          "flex items-center justify-between px-3 py-0.5 border-b border-wm-border bg-surface-faint shrink-0",
          titleBarClassName,
        )}
        onMouseDown={onTitleBarMouseDown}
        onDoubleClick={onTitleBarDoubleClick}
      >
        <TitleDots variant={dots} onClose={onClose} onMaximize={onMaximize} />

        <span className="font-mono text-xs truncate mx-2">
          {title}
        </span>

        <span className="font-mono text-3xs text-primary-subtle">
          {trailing}
        </span>
      </div>

      <div className={cn("flex-1 overflow-auto min-h-0", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
