export function TerminalPane({
  children,
  className = "",
  bare = false,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <div
      className={`${bare ? "h-full" : "rounded-md border border-primary/20 bg-background/80 backdrop-blur-sm"} overflow-hidden ${className}`}
    >
      <div className="p-3 font-mono text-xs leading-relaxed">{children}</div>
    </div>
  );
}
