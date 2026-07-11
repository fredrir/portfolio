"use client";

/** Small layout primitives shared by the platform panes. */

export function PaneSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3">
      <h2 className="mb-1.5 font-bold text-2xs text-primary uppercase tracking-wider">{title}</h2>
      {children}
    </section>
  );
}

export function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-border-faint border-b py-0.5 text-xs">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="break-all text-right font-mono">{value}</span>
    </div>
  );
}

export function PaneStatus({ text }: { text: string }) {
  return <p className="p-1 text-muted-foreground text-xs">{text}</p>;
}
