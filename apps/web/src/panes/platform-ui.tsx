"use client";

/**
 * Instrument primitives shared by the platform panes. The visual language is a
 * live operator's console: framed panels, status LEDs, animated meters, and
 * hairline box-drawing accents, all derived from the theme's primary tint so
 * every instrument re-skins with the active theme.
 */
import { type ReactNode, useEffect, useState } from "react";

import { cn } from "@/shared/utils/cn";

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return mounted;
}

export type Tone = "ok" | "warn" | "fail" | "idle" | "info";

const DOT_TONE: Record<Tone, string> = {
  ok: "bg-primary",
  warn: "bg-accent-yellow",
  fail: "bg-destructive",
  idle: "bg-primary-subtle",
  info: "bg-accent-blue",
};

export function StatusDot({ tone, pulse }: { tone: Tone; pulse?: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {pulse && tone === "ok" && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", DOT_TONE[tone])} />
    </span>
  );
}

export function Instrument({
  label,
  right,
  children,
  className,
}: {
  label: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-md border border-border-faint bg-surface-faint", className)}>
      <header className="flex items-center justify-between gap-2 border-border-faint border-b px-2.5 py-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <h2 className="truncate font-bold text-2xs text-primary uppercase tracking-[0.18em]">
            {label}
          </h2>
        </div>
        {right != null && <div className="shrink-0 text-2xs">{right}</div>}
      </header>
      <div className="p-2.5">{children}</div>
    </section>
  );
}

export function Readout({
  value,
  label,
  tone = "default",
}: {
  value: ReactNode;
  label: string;
  tone?: "default" | "primary";
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={cn(
          "font-mono text-xl tabular-nums leading-none",
          tone === "primary" ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-3xs text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

export function Badge({ children, tone = "idle" }: { children: ReactNode; tone?: Tone }) {
  const toneClass: Record<Tone, string> = {
    ok: "text-primary border-primary-hint bg-surface-soft",
    warn: "text-accent-yellow border-accent-yellow/30 bg-surface-soft",
    fail: "text-destructive border-destructive/30 bg-surface-soft",
    idle: "text-muted-foreground border-border-faint bg-surface-dim",
    info: "text-accent-blue border-accent-blue/30 bg-surface-soft",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-px font-mono text-2xs",
        toneClass[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Meter({
  label,
  value,
  max,
  display,
  leading,
}: {
  label: string;
  value: number;
  max: number;
  display?: string;
  leading?: ReactNode;
}) {
  const mounted = useMounted();
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-2 py-0.5 text-xs">
      {leading != null && <span className="shrink-0">{leading}</span>}
      <span className="@xs:w-24 w-16 shrink-0 truncate text-muted-foreground">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-sm bg-chart-track">
        <div
          className="h-full rounded-sm bg-chart-fill transition-[width] duration-700 ease-out"
          style={{ width: mounted ? `${pct}%` : "0%" }}
        />
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-readable tabular-nums">
        {display ?? value}
      </span>
    </div>
  );
}

/** Vertical bars for a daily time series; hover reveals the exact value. */
export function Sparkbars({
  data,
  height = 64,
  ariaLabel,
}: {
  data: { day: string; count: number }[];
  height?: number;
  ariaLabel?: (peak: number) => string;
}) {
  const mounted = useMounted();
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div
      className="flex items-end gap-px"
      style={{ height }}
      role="img"
      aria-label={ariaLabel ? ariaLabel(max) : `Daily series, peak ${max}`}
    >
      {data.map((d, i) => {
        const pct = Math.max(3, (d.count / max) * 100);
        return (
          <div
            key={d.day}
            title={`${d.day}: ${d.count}`}
            className="group flex flex-1 items-end self-stretch"
          >
            <div
              className="w-full rounded-t-[1px] bg-primary-soft transition-[height] duration-500 ease-out group-hover:bg-primary"
              style={{
                height: mounted ? `${pct}%` : "0%",
                transitionDelay: `${Math.min(i * 8, 240)}ms`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function HashChip({ hash }: { hash: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-surface-dim px-1.5 py-px font-mono text-2xs text-muted-foreground">
      <span className="text-primary-dim">#</span>
      {hash.slice(0, 12)}
    </span>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 border-border-faint border-t pt-2 text-2xs text-muted-foreground leading-relaxed">
      {children}
    </p>
  );
}

export function PaneShell({ children }: { children: ReactNode }) {
  return <div className="h-full space-y-2.5 overflow-y-auto @sm:p-3 p-2.5">{children}</div>;
}

export function relativeTime(iso: string): string {
  return relativeTimeWithLabels(iso);
}

export function relativeTimeWithLabels(
  iso: string,
  labels: {
    secondsAgo: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  } = {
    secondsAgo: "s ago",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    daysAgo: "d ago",
  },
): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const s = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (s < 60) return `${s}${labels.secondsAgo}`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}${labels.minutesAgo}`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}${labels.hoursAgo}`;
  return `${Math.round(h / 24)}${labels.daysAgo}`;
}
