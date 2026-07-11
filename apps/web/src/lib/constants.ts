import pkg from "../../package.json";
import tailwindPkg from "tailwindcss/package.json";

export const MY_NAME = "Fredrik Carsten Hansteen";
export const BIRTHDAY = new Date(2003, 9, 2);
export const MY_EMAIL = "fhansteen@gmail.com";
export const MY_PHONE = "+47 476 30 231";

export const USER_HOST = "fredrik@hansteen";
export const GITHUB_USERNAME = "fredrir";

export const PORTFOLIO_VERSION = pkg.version;
export const START_VERSION = pkg.dependencies["@tanstack/react-start"].replace(
  /^[\^~]/,
  "",
);
export const TAILWIND_VERSION = tailwindPkg.version;
