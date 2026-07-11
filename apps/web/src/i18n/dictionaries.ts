import en from "./en.json";
import fr from "./fr.json";
import nb from "./nb.json";
import nn from "./nn.json";
import { type Locale, locales } from "./types";

export { type Locale, locales };

const staticDictionaries = { en, nb, nn, fr } satisfies Record<Locale, typeof en>;

const dictionaries: Record<Locale, () => Promise<typeof import("./en.json")>> = {
  en: () => import("./en.json").then((module) => module.default),
  nb: () => import("./nb.json").then((module) => module.default),
  nn: () => import("./nn.json").then((module) => module.default),
  fr: () => import("./fr.json").then((module) => module.default),
};

export function resolveLocale(locale?: string | null): Locale {
  const language = locale?.toLowerCase().split(/[-_]/)[0];
  if (language === "no") return "nb";
  return locales.includes(language as Locale) ? (language as Locale) : "en";
}

export function getStaticDictionary(locale?: string | null): typeof en {
  return staticDictionaries[resolveLocale(locale)];
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
