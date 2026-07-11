import tailwindPkg from "tailwindcss/package.json";
import pkg from "../../package.json";

export const MY_NAME = "Fredrik Carsten Hansteen";
export const BIRTHDAY = new Date(2003, 9, 2);
export const MY_EMAIL = "fhansteen@gmail.com";
export const MY_PHONE = "+47 476 30 231";

export const USER_HOST = "fredrik@hansteen";
export const GITHUB_USERNAME = "fredrir";

// Release version injected at build time by CI (VITE_APP_VERSION); the
// package.json version is the local/dev fallback.
export const PORTFOLIO_VERSION = import.meta.env.VITE_APP_VERSION || pkg.version;
export const START_VERSION = pkg.dependencies["@tanstack/react-start"].replace(/^[\^~]/, "");
export const TAILWIND_VERSION = tailwindPkg.version;
