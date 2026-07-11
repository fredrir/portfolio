export function GridBackground() {
  return (
    <div
      className="absolute inset-0 [background-size:40px_40px]"
      style={{
        backgroundImage: `linear-gradient(color-mix(in srgb, var(--color-primary) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 5%, transparent) 1px, transparent 1px)`,
      }}
    />
  );
}
