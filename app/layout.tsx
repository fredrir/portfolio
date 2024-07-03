import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Fredrik Hansteen",
  description: "Fredrik Hansteen's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className="flex flex-col min-h-screen bg-white dark:text-white dark:bg-gray-900">
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
