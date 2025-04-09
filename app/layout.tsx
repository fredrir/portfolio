import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnimatedBackground } from "@/components/AnimatedLinesBackground";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Fredrik Hansteen",
  description: "Fredrik Hansteen's personal website",
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
          <Navbar />
          <main className="flex-grow bg-fixed z-20">{children}</main>
          <SpeedInsights />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
