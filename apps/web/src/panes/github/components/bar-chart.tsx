import { LangIcon } from "./lang-icon";

export function BarChart({
  items,
  maxCount,
}: {
  items: { lang: string; count: number }[];
  maxCount: number;
}) {
  return (
    <div className="mt-1 w-full space-y-0.5">
      {items.map(({ lang, count }) => {
        const pct = Math.max(5, Math.round((count / maxCount) * 100));
        return (
          <div key={lang} className="flex w-full items-center gap-2">
            <LangIcon lang={lang} />
            <span className="@xs:w-20 w-14 shrink-0 truncate text-muted-foreground">{lang}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-sm bg-chart-track">
              <div
                className="h-full rounded-sm bg-chart-fill transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-readable">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
