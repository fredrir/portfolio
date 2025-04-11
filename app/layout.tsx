import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnimatedBackground } from "@/components/AnimatedLinesBackground";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Fredrik Carsten Hansteen",
  description: "Fredrik Carsten Hansteen's personal website",
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
    title: "Fredrik Carsten Hansteen",
    description: "Fredrik Carsten Hansteen's personal website.",
    url: "https://hansteen.dev",
    siteName: "Fredrik Carsten Hansteen",
    images: [
      {
        url: "/screenshot.png",
        width: 1099,
        height: 599,
        alt: "Fredrik Carsten Hansteen",
        type: "image/png",
        secureUrl: "https://hansteen.dev/screenshot.png",
      },
    ],
    locale: "nb_NO, nn_NO, fr_FR, en_US",
    type: "website",
  },
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className={roboto.variable} suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="UU8-qICRv5a4sAtHbMB5rFbj9CuO-wzdPKfDur29ai8"
        />
      </head>
      <body className="flex flex-col min-h-screen dark:text-white font-mono">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedBackground />
          <Toaster />

          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
