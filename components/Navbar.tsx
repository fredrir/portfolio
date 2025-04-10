"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  XIcon as XMarkIcon,
  SparklesIcon,
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

type Navbar = {
  home: string;
  projects: string;
  journey: string;
  contact: string;
  lightMode: string;
  darkMode: string;
  language: string;
  toggleTheme: string;
  openMenu: string;
  closeMenu: string;
};

interface Props {
  navbar: Navbar;
}

interface DropdownMenuProps {
  toggleDropdown: () => void;
  navbar: Navbar;
}

const DropdownMenu = ({ toggleDropdown, navbar }: DropdownMenuProps) => {
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleDropdown]);

  return (
    <div
      ref={menuRef}
      className="absolute left-0 right-0 top-full w-full border-t border-gray-200 bg-white/90 backdrop-blur-md p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900/90 transition-all duration-300"
    >
      <div className="container mx-auto flex flex-col gap-2">
        <Link
          href="#start"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <SparklesIcon className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span>{navbar.home}</span>
        </Link>
        <Link
          href="#projects"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <LayoutGridIcon className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span>{navbar.projects}</span>
        </Link>
        <Link
          href="#journey"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <MapIcon className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span>{navbar.journey}</span>
        </Link>
        <Link
          href="/cv"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <DocumentTextIcon className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span>CV</span>
        </Link>
        <Link
          href="#contact"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <EnvelopeIcon className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span>{navbar.contact}</span>
        </Link>
        <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
        <button
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          {theme === "dark" ? (
            <>
              <SunIcon className="h-5 w-5 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
              <span>{navbar.lightMode}</span>
            </>
          ) : (
            <>
              <MoonIcon className="h-5 w-5 text-emerald-400 transition-transform duration-300 group-hover:rotate-12" />
              <span>{navbar.darkMode}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default function Navbar({ navbar }: Props) {
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
                  <h2 className="text-base sm:text-xl lg:text-2xl px-4 font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                    Fredrik Carsten Hansteen
                  </h2>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-6">
                <Link href="#projects">
                  <Button variant="outline" className="gap-2 font-medium">
                    <LayoutGridIcon className="h-4 w-4" />
                    {navbar.projects}
                  </Button>
                </Link>
                <Link href="#journey">
                  <Button variant="outline" className="gap-2 font-medium">
                    <MapIcon className="h-4 w-4" />
                    {navbar.journey}
                  </Button>
                </Link>
                <Link href="/cv">
                  <Button variant="outline" className="gap-2 font-medium">
                    <DocumentTextIcon className="h-4 w-4" />
                    CV
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button className="gap-2 font-medium bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400">
                    <EnvelopeIcon className="h-4 w-4" />
                    {navbar.contact}
                  </Button>
                </Link>
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

              <div className="flex lg:hidden">
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
                  <DropdownMenu
                    toggleDropdown={toggleDropdown}
                    navbar={navbar}
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
