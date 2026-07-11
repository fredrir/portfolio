export function ThemeSwatch({ colors }: { colors: readonly [string, string, string] }) {
  return (
    <div className="flex shrink-0 gap-0.5">
      {colors.map((c, i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full border border-white/10"
          style={{ background: c }}
        />
      ))}
    </div>
  );
}
