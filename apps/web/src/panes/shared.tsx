"use client";

/** Small layout primitives shared by the platform panes. */

export function PaneSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-3">
      <h2 className="text-primary font-bold text-2xs uppercase tracking-wider mb-1.5">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function KVRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-3 py-0.5 border-b border-border-faint text-xs">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-mono text-right break-all">{value}</span>
    </div>
  );
}

export function PaneStatus({ text }: { text: string }) {
  return <p className="text-xs text-muted-foreground p-1">{text}</p>;
}
