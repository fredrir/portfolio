import "@fontsource/roboto/400.css";

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useParams,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

import { PosthogGate } from "@/shared/analytics/posthog-gate";
import { AnalyticsConsentProvider } from "@/shared/components/analytics/analytics-consent-provider";
import { CookieConsentBanner } from "@/shared/components/analytics/cookie-consent";
import { RecaptchaProvider } from "@/shared/components/recaptcha-provider";
import { NotificationProvider } from "@/shared/notification";
import { THEMES } from "@/lib/themes";
import globalsCss from "@/styles/globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "google-site-verification",
        content: "UU8-qICRv5a4sAtHbMB5rFbj9CuO-wzdPKfDur29ai8",
      },
    ],
    links: [
      { rel: "stylesheet", href: globalsCss },
      { rel: "icon", href: "/favicon.ico" },
      {
        rel: "icon",
        href: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      { rel: "apple-touch-icon", href: "/apple-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const params = useParams({ strict: false }) as { locale?: string };
  const locale = params.locale ?? "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className="h-screen overflow-hidden dark:text-white font-mono"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="fredrir"
          enableSystem
          themes={[...THEMES.map((t) => t.id), "system"]}
          disableTransitionOnChange
        >
          <AnalyticsConsentProvider>
            <RecaptchaProvider>
              <NotificationProvider>
                <Outlet />
                <CookieConsentBanner locale={locale} />
                <PosthogGate />
              </NotificationProvider>
            </RecaptchaProvider>
          </AnalyticsConsentProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
