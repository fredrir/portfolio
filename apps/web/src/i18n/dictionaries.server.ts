import type en from "./en.json";
import type { Locale } from "./types";

const dictionaries: Record<Locale, () => Promise<typeof en>> = {
  en: () => import("./en.json").then((module) => module.default),
  nb: () => import("./nb.json").then((module) => module.default),
  nn: () => import("./nn.json").then((module) => module.default),
  fr: () => import("./fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
