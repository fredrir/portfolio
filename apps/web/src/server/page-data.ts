import { createServerFn } from "@tanstack/react-start";

import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/types";
import { fetchGitHubData } from "@/lib/github";
import { fetchSpotifyData } from "@/lib/spotify";

export const getPageData = createServerFn()
  .validator((data: { locale: Locale }) => {
    if (!locales.includes(data.locale)) {
      throw new Error(`Unsupported locale: ${data.locale}`);
    }
    return data;
  })
  .handler(async ({ data }) => {
    const [dict, githubData, spotifyData] = await Promise.all([
      getDictionary(data.locale),
      fetchGitHubData(),
      fetchSpotifyData(),
    ]);
    return { locale: data.locale, dict, githubData, spotifyData };
  });
