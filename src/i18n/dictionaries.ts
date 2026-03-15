import "server-only";

export const locales = ["en", "nb", "nn", "fr"] as const;
export type Locale = (typeof locales)[number];

const dictionaries: Record<Locale, () => Promise<typeof import("./en.json")>> = {
  en: () => import("./en.json").then((module) => module.default),
  nb: () => import("./nb.json").then((module) => module.default),
  nn: () => import("./nn.json").then((module) => module.default),
  fr: () => import("./fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
