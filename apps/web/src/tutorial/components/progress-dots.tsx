"use client";

export function ProgressDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`transition-all duration-300 rounded-full ${
            i === current
              ? "w-5 h-2 bg-primary"
              : i < current
                ? "w-2 h-2 bg-primary-muted"
                : "w-2 h-2 bg-primary-hint"
          }`}
        />
      ))}
    </div>
  );
}
