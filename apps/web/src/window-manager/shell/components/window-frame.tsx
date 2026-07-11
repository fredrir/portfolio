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
    return <div className={cn("h-3 w-3 rounded-full", color)} />;
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
          "h-3 w-3 rounded-full transition-colors",
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
        <div className="h-3.5 w-3.5 rounded-full bg-wm-close" />
        <div className="h-3.5 w-3.5 rounded-full bg-wm-minimize" />
        <div className="h-3.5 w-3.5 rounded-full bg-wm-maximize" />
      </div>
    );
  }

  if (variant === "close-only") {
    return (
      <div className="flex items-center gap-2.5">
        <button onClick={onClose} className="group">
          <div className="h-4 w-4 rounded-full bg-wm-close transition-colors group-hover:bg-destructive" />
        </button>
      </div>
    );
  }

  return (
    <div className="-ml-1.5 flex items-center">
      <Dot color="bg-wm-close" hoverColor="bg-destructive" onClick={onClose} interactive />
      <Dot color="bg-wm-minimize" hoverColor="bg-accent-yellow" onClick={onClose} interactive />
      <Dot color="bg-wm-maximize" hoverColor="bg-primary" onClick={onMaximize} interactive />
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
    <div
      className={cn("flex flex-col overflow-hidden rounded-xl border backdrop-blur-md", className)}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-between border-wm-border border-b bg-surface-faint px-3 py-0.5",
          titleBarClassName,
        )}
        onMouseDown={onTitleBarMouseDown}
        onDoubleClick={onTitleBarDoubleClick}
      >
        <TitleDots variant={dots} onClose={onClose} onMaximize={onMaximize} />

        <span className="mx-2 truncate font-mono text-xs">{title}</span>

        <span className="font-mono text-3xs text-primary-subtle">{trailing}</span>
      </div>

      <div className={cn("min-h-0 flex-1 overflow-auto", contentClassName)}>{children}</div>
    </div>
  );
}
