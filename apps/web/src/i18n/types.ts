import type EnDictionary from "./en.json";

export type DictType = typeof EnDictionary;

export const locales = ["en", "nb", "nn", "fr"] as const;
export type Locale = (typeof locales)[number];

export type localeParams = Promise<{ locale: string }>;

export type Landing = DictType["landing"];
export type Journey = DictType["journey"];
export type NavbarType = DictType["navbar"];
export type AdminStrings = DictType["admin"];
export type CookieConsentStrings = DictType["cookieConsent"];
export type ContactStrings = DictType["contact"];

type RawUi = DictType["ui"];
export type UiStrings = Omit<RawUi, "backgrounds" | "localeTitles" | "shortTitles"> & {
  backgrounds: Record<string, string>;
  localeTitles: Record<string, string>;
  shortTitles: Record<string, string>;
};

type RawTutorial = DictType["tutorial"];
export type TutorialStrings = Omit<RawTutorial, "paneDescriptions"> & {
  paneDescriptions: Record<string, string>;
};

export type ContactProps = {
  contact: DictType["contact"];
};
