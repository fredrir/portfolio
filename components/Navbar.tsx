"use client";

import Link from "next/link";
import { useTheme } from "@/lib/hooks/UseTheme";
import Image from "next/image";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { Suspense, useEffect, useState } from "react";
import FocusTrap from "focus-trap-react";
import DropdownMenu from "./DropDownMenu";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="w-full">
      <div>
        <div
          className={`hidden md:flex fixed left-0 right-0 top-0 z-50 flex justify-between w-full py-5 px-5 items-center  dark:bg-rif-darkBlue ${
            isScrolled ? "bg-transparent" : "bg-white dark:bg-gray-900"
          }`}
        >
          <Link href="/">
            <h2 className="text-3xl font-bold">Fredrik Hansteen</h2>
          </Link>
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal dark:text-white">
            <div className="hidden md:flex">
              <Link href="/cv">
                <Button title="CV" color="white" size="small" />
              </Link>
            </div>
            <div className="hidden md:flex">
              <Link href={"#contact-me"}>
                <Button title="Contact" color="green" size="small" />
              </Link>
            </div>

            <ThemeToggle />
          </div>
        </div>
        <div
          className={`md:hidden flex fixed left-0 right-0 top-0 z-50  justify-between items-center px-5 py-5  ${
            isScrolled ? "bg-transparent" : "bg-white dark:bg-gray-900"
          }`}
        >
          <h1 className="font-bold text-xl">Hansteen</h1>
          <div className="relative">
            <button onClick={toggleDropdown} className="flex justify-end">
              {isDropdownOpen ? (
                <XMarkIcon className="w-10 h-10 text-black transition-transform transform rotate-45 dark:text-white" />
              ) : (
                <Bars3Icon className="w-10 h-10 text-black transition-transform transform dark:text-white" />
              )}
            </button>
            {isDropdownOpen && <DropdownMenu toggleDropdown={toggleDropdown} />}
          </div>
        </div>
      </div>
    </nav>
  );
}
