import en from "./en.json";
import fr from "./fr.json";
import nb from "./nb.json";
import nn from "./nn.json";
import { type Locale, locales } from "./types";

export { type Locale, locales };

const staticDictionaries = { en, nb, nn, fr } satisfies Record<Locale, typeof en>;

export function resolveLocale(locale?: string | null): Locale {
  const language = locale?.toLowerCase().split(/[-_]/)[0];
  if (language === "no") return "nb";
  return locales.includes(language as Locale) ? (language as Locale) : "en";
}

export function getStaticDictionary(locale?: string | null): typeof en {
  return staticDictionaries[resolveLocale(locale)];
}
