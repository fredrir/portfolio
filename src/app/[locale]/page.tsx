import type { Metadata } from "next";
import { WindowManager } from "@/window-manager";
import type { localeParams } from "@/i18n/language-types";
import { getDictionary, locales, type Locale } from "@/i18n/dictionaries";
import { fetchGitHubData } from "@/lib/github";
import { fetchSpotifyData } from "@/lib/spotify";
import { notFound } from "next/navigation";

const localeContent = {
  en: {
    title: "Fredrik Carsten Hansteen",
    description: "Fredrik Carsten Hansteen's personal website",
    locale: "en",
  },
  nb: {
    title: "Fredrik Carsten Hansteen",
    description: "Fredrik Carsten Hansteens personlige nettside",
    locale: "nb",
  },
  nn: {
    title: "Fredrik Carsten Hansteen",
    description: "Fredrik Carsten Hansteen si personlege nettside",
    locale: "nn",
  },
  fr: {
    title: "Fredrik Carsten Hansteen",
    description: "Site personnel de Fredrik Carsten Hansteen",
    locale: "fr",
  },
};

export async function generateMetadata({
  params,
}: {
  params: localeParams;
}): Promise<Metadata> {
  const locale = (await params).locale || "en";
  const content =
    localeContent[locale as keyof typeof localeContent] || localeContent.en;

  return {
    title: content.title,
    description: content.description,
    keywords: ["Fredrik Carsten Hansteen", "Hansteen"],
    authors: [
      {
        name: "Fredrik Carsten Hansteen",
      },
    ],
    creator: "Fredrik Carsten Hansteen",
    publisher: "Fredrik Carsten Hansteen",
    metadataBase: new URL("https://hansteen.dev"),
    alternates: {
      canonical: "https://hansteen.dev",
      languages: {
        nb: "https://hansteen.dev/nb",
        nn: "https://hansteen.dev/nn",
        fr: "https://hansteen.dev/fr",
        en: "https://hansteen.dev/en",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    category: "portfolio",
    openGraph: {
      title: content.title,
      description: content.description,
      url: "https://hansteen.dev",
      siteName: content.title,
      images: [
        {
          url: "/screenshot.png",
          width: 1099,
          height: 599,
          alt: content.title,
          type: "image/png",
          secureUrl: "https://hansteen.dev/screenshot.png",
        },
      ],
      locale: content.locale,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function Home(props: { params: localeParams }) {
  const { locale: rawLocale } = await props.params;

  if (!locales.includes(rawLocale as Locale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  const [dict, githubData, spotifyData] = await Promise.all([
    getDictionary(locale),
    fetchGitHubData(),
    fetchSpotifyData(),
  ]);

  return (
    <WindowManager
      locale={locale}
      currentLocale={locale as "en" | "nb" | "nn" | "fr"}
      navbar={dict.navbar}
      landing={dict.landing}
      journey={dict.journey}
      project={dict.project}
      contact={dict.contact}
      ui={dict.ui}
      githubData={githubData}
      spotifyData={spotifyData}
    />
  );
}
