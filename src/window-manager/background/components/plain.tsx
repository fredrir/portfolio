export function PlainBackground() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--color-primary) 3%, transparent) 0%, transparent 70%)`,
      }}
    />
  );
}
