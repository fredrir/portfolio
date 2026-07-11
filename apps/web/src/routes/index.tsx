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
        // Relative Location: an absolute URL from request.url would carry the
        // private origin host (origin.hansteen.dev) and send the browser to a
        // hostname it cannot reach.
        return new Response(null, {
          status: 307,
          headers: { location: `/${locale}` },
        });
      },
    },
  },
});
