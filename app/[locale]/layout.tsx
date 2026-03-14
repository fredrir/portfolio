import type React from "react";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnimatedBackground } from "@/components/AnimatedLinesBackground";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { AnalyticsConsentProvider } from "@/components/Analytics/AnalyticsConsentProvider";
import { CookieConsentBanner } from "@/components/Analytics/CookieConsent";
import { ConditionalAnalytics } from "@/components/Analytics/ConditionalAnalytics";
import { RecaptchaProvider } from "@/components/RecaptchaProvider";
import type { localeParams } from "@/lib/locale/languageTypes";

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
      <body className="flex flex-col min-h-screen dark:text-white font-mono" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsConsentProvider>
            <RecaptchaProvider>
              <Suspense fallback={null}>
                <AnimatedBackground />
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
