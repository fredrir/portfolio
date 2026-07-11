"use client";

export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "h-2 w-5 bg-primary"
              : i < current
                ? "h-2 w-2 bg-primary-muted"
                : "h-2 w-2 bg-primary-hint"
          }`}
        />
      ))}
    </div>
  );
}
