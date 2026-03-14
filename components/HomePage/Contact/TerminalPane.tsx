export function TerminalPane({
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden ${className}`}
    >
      <div className="p-3 font-mono text-xs leading-relaxed">{children}</div>
    </div>
  );
}
