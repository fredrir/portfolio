"use client";

import type { NavbarType } from "@/lib/types/types";
import { EnvelopeIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import {
  SparklesIcon,
  MapIcon,
  LayoutGridIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  toggleDropdown: () => void;
  navbar: NavbarType;
  cvHref: string;
}

const MobileDropdownMenu = ({ toggleDropdown, navbar, cvHref }: Props) => {
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
      className="absolute left-0 right-0 top-full w-full border-t border-gray-200 bg-white/90 backdrop-blur-md p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900/90 transition-all duration-300 max-h-[80vh] overflow-y-auto"
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
          href="#journey"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <MapIcon className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span>{navbar.journey}</span>
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
          href="#contact"
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <EnvelopeIcon className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span>{navbar.contact}</span>
        </Link>
        <Link
          href={cvHref}
          onClick={toggleDropdown}
          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <DocumentTextIcon className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
          <span>CV</span>
        </Link>
        <div className="my-2 h-px bg-gray-200 dark:bg-gray-800" />
        <div className="px-3 py-2">
          <div className="flex flex-col gap-2">
            <Link
              href="/en"
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-lg py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              <span className="flex h-4 w-6 items-center justify-center overflow-hidden rounded-sm">
                <Image
                  src="/flags/gb.svg"
                  alt="English"
                  width={24}
                  height={18}
                  className="h-full w-full object-cover"
                />
              </span>
              <span>English</span>
            </Link>
            <Link
              href="/nb"
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-lg  py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              <span className="flex h-4 w-6 items-center justify-center overflow-hidden rounded-sm">
                <Image
                  src="/flags/no.svg"
                  alt="Bokmål"
                  width={24}
                  height={18}
                  className="h-full w-full object-cover"
                />
              </span>
              <span>Bokmål</span>
            </Link>
            <Link
              href="/nn"
              onClick={toggleDropdown}
              className="flex items-center gap-2 rounded-lg  py-2 text-gray-800 transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              <span className="flex h-4 w-6 items-center justify-center overflow-hidden rounded-sm">
                <Image
                  src="/flags/no.svg"
                  alt="Nynorsk"
                  width={24}
                  height={18}
                  className="h-full w-full object-cover"
                />
              </span>
              <span>Nynorsk</span>
            </Link>
          </div>
        </div>
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

export default MobileDropdownMenu;
