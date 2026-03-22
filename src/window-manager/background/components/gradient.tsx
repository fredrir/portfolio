export function GradientBackground() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--color-primary) 15%, transparent) 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 80% 100%, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}
