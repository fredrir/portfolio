import { LANG_ICONS } from "../constants";

export function LangIcon({ lang }: { lang: string }) {
  const info = LANG_ICONS[lang];
  if (!info) {
    return (
      <span className="text-muted-foreground font-bold text-2xs w-4 inline-block">
        {lang.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <span className={`${info.color} font-bold text-2xs w-4 inline-block`}>
      {info.icon}
    </span>
  );
}
