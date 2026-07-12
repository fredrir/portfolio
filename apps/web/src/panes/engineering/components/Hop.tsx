import { useMounted } from "@/panes/platform-ui";
import { cn } from "@/shared/utils/cn";

export function Hop({
  name,
  detail,
  index,
  live,
  glow,
}: {
  name: string;
  detail: string;
  index: number;
  live: boolean;
  glow?: boolean;
}) {
  const mounted = useMounted();
  const on = mounted && live;
  return (
    <div
      className={cn(
        "min-h-24 w-full flex-1 rounded border px-2 py-1.5 transition-all duration-300",
        on
          ? glow
            ? "border-primary bg-surface-soft shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
            : "border-primary-hint bg-surface-dim"
          : "border-border-faint bg-transparent opacity-40",
      )}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-foreground text-sm">{name}</span>
      </div>
      <span className="mt-0.5 block font-mono text-3xs text-muted-foreground">{detail}</span>
    </div>
  );
}
