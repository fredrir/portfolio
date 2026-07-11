import { match } from "@formatjs/intl-localematcher";
import { createFileRoute } from "@tanstack/react-router";
import Negotiator from "negotiator";

import { locales } from "@/i18n/types";

function negotiateLocale(request: Request): string {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();
  try {
    return match(languages, locales, "en");
  } catch {
    return "en";
  }
}

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const locale = negotiateLocale(request);
        return Response.redirect(new URL(`/${locale}`, request.url), 307);
      },
    },
  },
});
