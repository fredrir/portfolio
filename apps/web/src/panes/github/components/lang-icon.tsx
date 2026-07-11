import { LANG_ICONS } from "../constants";

export function LangIcon({ lang }: { lang: string }) {
  const info = LANG_ICONS[lang];
  if (!info) {
    return (
      <span className="inline-block w-4 font-bold text-2xs text-muted-foreground">
        {lang.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return <span className={`${info.color} inline-block w-4 font-bold text-2xs`}>{info.icon}</span>;
}
