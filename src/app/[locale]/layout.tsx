import type React from "react";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { AnalyticsConsentProvider } from "@/shared/components/analytics/analytics-consent-provider";
import { CookieConsentBanner } from "@/shared/components/analytics/cookie-consent";
import { ConditionalAnalytics } from "@/shared/components/analytics/conditional-analytics";
import { RecaptchaProvider } from "@/shared/components/recaptcha-provider";

import type { localeParams } from "@/i18n/language-types";
import { THEMES } from "@/lib/themes";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-roboto",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: localeParams;
}>) {
  const locale = (await params).locale;

  return (
    <html lang={locale} className={roboto.variable} suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="UU8-qICRv5a4sAtHbMB5rFbj9CuO-wzdPKfDur29ai8"
        />
      </head>
      <body className="h-screen overflow-hidden dark:text-white font-mono" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="fredrir"
          enableSystem
          themes={[...THEMES.map((t) => t.id), "system"]}
          disableTransitionOnChange
        >
          <AnalyticsConsentProvider>
            <RecaptchaProvider>
              <Suspense fallback={null}>
                <Toaster />

                {children}

                <CookieConsentBanner locale={locale} />

                <SpeedInsights />
              </Suspense>
            </RecaptchaProvider>
            <ConditionalAnalytics />
          </AnalyticsConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
