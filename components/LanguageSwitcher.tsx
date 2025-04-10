"use client";

import { useState, useRef, useEffect } from "react";
import { GlobeIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { NavbarType } from "@/lib/types/types";

interface LanguageSwitcherProps {
  navbar: NavbarType;
  currentLocale: "en" | "nb" | "nn";
}

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "nb", name: "Norsk (Bokmål)", flag: "🇳🇴" },
  { code: "nn", name: "Norsk (Nynorsk)", flag: "🇳🇴" },
];

export default function LanguageSwitcher({
  navbar,
  currentLocale,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage = languages.find(
    (language) => language.code === currentLocale
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-all duration-300 border border-emerald-200/50 dark:border-emerald-700/30 group"
        aria-label={navbar.language}
      >
        <GlobeIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:animate-pulse" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="py-1">
              {languages.map((language) => {
                const isActive = language.code === currentLocale;

                return (
                  <Link
                    key={language.code}
                    href={`/${language.code}`}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center justify-between px-4 py-2.5 text-sm
                      ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-300"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                    {isActive && (
                      <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
