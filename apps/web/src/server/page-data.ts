import { createServerFn } from "@tanstack/react-start";

import { getDictionary } from "@/i18n/dictionaries.server";
import { type Locale, locales } from "@/i18n/types";
import { api, traceHeaders } from "@/server/api";
import type { GitHubData } from "@/shared/types";

export const getPageData = createServerFn()
  .validator((data: { locale: Locale }) => {
    if (!locales.includes(data.locale)) {
      throw new Error(`Unsupported locale: ${data.locale}`);
    }
    return data;
  })
  .handler(async ({ data }) => {
    const [dict, github] = await Promise.all([
      getDictionary(data.locale),
      api.GET("/api/v1/github", { headers: traceHeaders() }).catch(() => ({ data: null })),
    ]);
    // Spotify is captcha-gated and loads client-side in its pane.
    return {
      locale: data.locale,
      dict,
      githubData: (github.data ?? null) as GitHubData | null,
      spotifyData: null as null,
    };
  });
