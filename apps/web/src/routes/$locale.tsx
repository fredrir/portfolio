import { createFileRoute, notFound } from "@tanstack/react-router";

import { type Locale, locales } from "@/i18n/types";
import { MY_NAME } from "@/lib/constants";
import { getPageData } from "@/server/page-data";
import { WindowManager } from "@/window-manager";

const BASE_URL = "https://hansteen.dev";

export const Route = createFileRoute("/$locale")({
  loader: async ({ params }) => {
    if (!locales.includes(params.locale as Locale)) {
      throw notFound();
    }
    return getPageData({ data: { locale: params.locale as Locale } });
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? "en";
    const description = loaderData?.dict.seo.description ?? MY_NAME;
    return {
      meta: [
        { title: MY_NAME },
        { name: "description", content: description },
        { name: "keywords", content: `${MY_NAME}, Hansteen` },
        { name: "author", content: MY_NAME },
        { name: "creator", content: MY_NAME },
        { name: "publisher", content: MY_NAME },
        { name: "robots", content: "index, follow" },
        {
          name: "googlebot",
          content: "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
        },
        { name: "category", content: "portfolio" },
        { property: "og:title", content: MY_NAME },
        { property: "og:description", content: description },
        { property: "og:url", content: BASE_URL },
        { property: "og:site_name", content: MY_NAME },
        { property: "og:locale", content: locale },
        { property: "og:type", content: "website" },
        { property: "og:image", content: `${BASE_URL}/screenshot.png` },
        { property: "og:image:secure_url", content: `${BASE_URL}/screenshot.png` },
        { property: "og:image:width", content: "1099" },
        { property: "og:image:height", content: "599" },
        { property: "og:image:alt", content: MY_NAME },
        { property: "og:image:type", content: "image/png" },
      ],
      links: [
        { rel: "canonical", href: BASE_URL },
        ...locales.map((l) => ({
          rel: "alternate",
          hrefLang: l,
          href: `${BASE_URL}/${l}`,
        })),
      ],
    };
  },
  component: Page,
});

function Page() {
  const { locale, dict, githubData, spotifyData, weatherData } = Route.useLoaderData();
  return (
    <WindowManager
      currentLocale={locale}
      dict={dict}
      githubData={githubData}
      spotifyData={spotifyData}
      weatherData={weatherData}
    />
  );
}
