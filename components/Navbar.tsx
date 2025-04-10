"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  XIcon as XMarkIcon,
  TextIcon as DocumentTextIcon,
  InboxIcon as EnvelopeIcon,
  SunIcon,
  MoonIcon,
  LayoutGridIcon,
  MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobeIcon } from "lucide-react";
import { NavbarType } from "@/lib/types/types";
import MobileDropdownMenu from "./MobileDropdownMenu";
import LanguageSwitcher from "./LanguageSwitcher";

interface Props {
  navbar: NavbarType;
  currentLocale: "en" | "nb" | "nn";
}

export default function Navbar({ navbar, currentLocale }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cvHref = currentLocale === "nn" ? "/cv/nb" : `/cv/${currentLocale}`;

  return (
    <nav className="w-full">
      <div className="fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300">
        <div
          className={cn(
            "w-full transition-all duration-300",
            isScrolled
              ? "py-3 bg-white/80 backdrop-blur-md shadow-md dark:bg-gray-900/80"
              : "py-5 bg-white dark:bg-gray-900 dark:border-gray-800"
          )}
        >
          <div className="mx-auto container px-4">
            <div className="flex items-center justify-between">
              <Link href="#start" className="group">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 opacity-70 blur-md group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                      <Image
                        src="/Fredrik_Carsten_Hansteen.png"
                        alt="Fredrik Carsten Hansteen"
                        width={75}
                        height={75}
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-lg xl:text-2xl px-4 font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                    Fredrik Carsten Hansteen
                  </h2>
                </div>
              </Link>

              <div className="hidden xl:flex items-center gap-6">
                <Link href="#journey">
                  <Button variant="outline" className="gap-2 font-medium">
                    <MapIcon className="h-4 w-4" />
                    {navbar.journey}
                  </Button>
                </Link>
                <Link href="#projects">
                  <Button variant="outline" className="gap-2 font-medium">
                    <LayoutGridIcon className="h-4 w-4" />
                    {navbar.projects}
                  </Button>
                </Link>

                <Link href="#contact">
                  <Button variant="outline" className="gap-2 font-medium">
                    <EnvelopeIcon className="h-4 w-4" />
                    {navbar.contact}
                  </Button>
                </Link>
                <Link href={cvHref}>
                  <Button variant="outline" className="gap-2 font-medium">
                    <DocumentTextIcon className="h-4 w-4" />
                    CV
                  </Button>
                </Link>

                <LanguageSwitcher
                  navbar={navbar}
                  currentLocale={currentLocale}
                />

                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full p-2 group text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  aria-label={
                    theme === "dark" ? navbar.lightMode : navbar.darkMode
                  }
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5 text-amber-500 group-hover:animate-[spin_2s_linear_infinite] transition-transform" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-emerald-400" />
                  )}
                  <span className="sr-only">{navbar.toggleTheme}</span>
                </button>
              </div>

              <div className="flex xl:hidden">
                <motion.button
                  onClick={toggleDropdown}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                    isScrolled
                      ? "bg-white/90 shadow-md dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                  aria-label={
                    isDropdownOpen ? navbar.closeMenu : navbar.openMenu
                  }
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDropdownOpen ? (
                    <XMarkIcon className="h-5 w-5 text-gray-700 dark:text-gray-200 transition-transform duration-300 rotate-90" />
                  ) : (
                    <Bars3Icon className="h-5 w-5 text-gray-700 dark:text-gray-200 transition-transform duration-300 hover:scale-110" />
                  )}
                </motion.button>
                {isDropdownOpen && (
                  <MobileDropdownMenu
                    toggleDropdown={toggleDropdown}
                    navbar={navbar}
                    cvHref={cvHref}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
