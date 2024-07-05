import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Roboto } from "next/font/google";

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
    <html lang="no" className={roboto.variable}>
      <head>
        <meta
          name="google-site-verification"
          content="UU8-qICRv5a4sAtHbMB5rFbj9CuO-wzdPKfDur29ai8"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white font-monograph">
        <link rel="icon" href="/favicon.ico" />
        <Toaster />
        <Navbar />
        <main className="flex-grow bg-fixed bg-[#D0C6DF] dark:bg-[#301856] bg-hero-pattern-light dark:bg-hero-pattern-light">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
