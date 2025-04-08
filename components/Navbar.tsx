"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Bars3Icon } from "@heroicons/react/24/solid";

const DropdownMenu = ({ toggleDropdown }: { toggleDropdown: () => void }) => {
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
  }, [menuRef]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      ref={menuRef}
      className="absolute right-0 top-16 w-64 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-md p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900/90"
    >
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <SparklesIcon className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" />
          <span>Home</span>
        </Link>
        <Link
          href="#projects"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <LayoutGridIcon className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" />
          <span>Projects</span>
        </Link>
        <Link
          href="#journey"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <MapIcon className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" />
          <span>Journey</span>
        </Link>
        <Link
          href="/cv"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <DocumentTextIcon className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" />
          <span>CV</span>
        </Link>
        <Link
          href="#contact"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <EnvelopeIcon className="h-5 w-5 text-emerald-500 group-hover:animate-pulse" />
          <span>Contact</span>
        </Link>
        <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
        <button
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
            toggleDropdown();
          }}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          {theme === "dark" ? (
            <>
              <SunIcon className="h-5 w-5 text-amber-500 group-hover:animate-spin" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <MoonIcon className="h-5 w-5 text-indigo-400 group-hover:animate-pulse" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme, setTheme } = useTheme();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className="w-full">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div
          className={cn(
            "fixed left-0 right-0 top-0 z-50 w-full transition-all duration-500",
            isScrolled
              ? "py-3 bg-white/80 backdrop-blur-md shadow-md dark:bg-gray-900/80"
              : "py-5 bg-white dark:bg-gray-900  dark:border-gray-800"
          )}
        >
          <div className="mx-auto container px-4 ">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href="/" className="group">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 opacity-70 blur-md group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                        <SparklesIcon className="h-6 w-6 text-emerald-500 group-hover:animate-pulse" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                      Fredrik Hansteen
                    </h2>
                  </div>
                </Link>
              </motion.div>

              <div className="hidden lg:flex items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="#projects">
                    <Button variant="outline" className="gap-2 font-medium">
                      <LayoutGridIcon className="h-4 w-4" />
                      Projects
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="#journey">
                    <Button variant="outline" className="gap-2 font-medium">
                      <MapIcon className="h-4 w-4" />
                      Journey
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/cv">
                    <Button variant="outline" className="gap-2 font-medium">
                      <DocumentTextIcon className="h-4 w-4" />
                      CV
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="#contact">
                    <Button className="gap-2 font-medium bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400">
                      <EnvelopeIcon className="h-4 w-4" />
                      Contact
                    </Button>
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5 text-amber-500" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-indigo-400" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </motion.button>
              </div>

              <div className="flex lg:hidden">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDropdown}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full transition-all",
                    isScrolled
                      ? "bg-white/90 shadow-md dark:bg-gray-800/90"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                  aria-label={isDropdownOpen ? "Close menu" : "Open menu"}
                >
                  <Bars3Icon
                    className={cn(
                      "absolute h-5 w-5 text-gray-700 dark:text-gray-200 transition-all duration-300",
                      isDropdownOpen
                        ? "opacity-0 rotate-90"
                        : "opacity-100 rotate-0"
                    )}
                  />
                  <XMarkIcon
                    className={cn(
                      "absolute h-5 w-5 text-gray-700 dark:text-gray-200 transition-all duration-300",
                      isDropdownOpen
                        ? "opacity-100 rotate-0"
                        : "opacity-0 rotate-90"
                    )}
                  />
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <DropdownMenu toggleDropdown={toggleDropdown} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
