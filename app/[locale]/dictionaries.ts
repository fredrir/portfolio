import "server-only";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  nb: () => import("./nb.json").then((module) => module.default),
  nn: () => import("./nn.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "nb" | "nn") =>
  dictionaries[locale]();
