import { LangIcon } from "./lang-icon";

export function BarChart({
  items,
  maxCount,
}: {
  items: { lang: string; count: number }[];
  maxCount: number;
}) {
  return (
    <div className="space-y-0.5 mt-1 w-full">
      {items.map(({ lang, count }) => {
        const pct = Math.max(5, Math.round((count / maxCount) * 100));
        return (
          <div key={lang} className="flex items-center gap-2 w-full">
            <LangIcon lang={lang} />
            <span className="text-muted-foreground w-14 @xs:w-20 shrink-0 truncate">
              {lang}
            </span>
            <div className="flex-1 h-3 bg-chart-track rounded-sm overflow-hidden">
              <div
                className="h-full bg-chart-fill rounded-sm transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-readable shrink-0 w-6 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
