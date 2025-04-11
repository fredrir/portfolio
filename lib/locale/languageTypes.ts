import { journeyType } from "../types/types";

export type NavbarType = {
  home: string;
  projects: string;
  journey: string;
  contact: string;
  lightMode: string;
  darkMode: string;
  language: string;
  toggleTheme: string;
  openMenu: string;
  closeMenu: string;
};

export type Journey = {
  title: string;
  journeys: journeyType[];
};

export type localeParams = Promise<{ locale: "en" | "nb" | "nn" | "fr" }>;
