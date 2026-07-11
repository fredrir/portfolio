export function ThemeSwatch({ colors }: { colors: readonly [string, string, string] }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      {colors.map((c, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full border border-white/10"
          style={{ background: c }}
        />
      ))}
    </div>
  );
}
