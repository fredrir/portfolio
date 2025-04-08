"use client";

import Link from "next/link";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import DropdownMenu from "./DropDownMenu";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className="w-full">
      <div>
        <div
          className={`hidden md:flex fixed left-0 right-0 top-0 z-50 flex justify-between w-full py-5 px-5 items-center dark:bg-rif-darkBlue ${
            isScrolled
              ? "bg-transparent"
              : "bg-white dark:bg-gray-900 border-b-2 border-gray-900 dark:border-white"
          }`}
        >
          {" "}
          {!isScrolled ? (
            <Link href="/">
              <h2 className="text-3xl font-bold">Fredrik Hansteen</h2>
              {/* <Button title="Fredrik Hansteen" color="green" /> */}
            </Link>
          ) : (
            <div></div>
          )}
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal dark:text-white">
            <div className="hidden md:flex">
              <Link href="/cv">
                <Button title="CV" color="white" />
              </Link>
            </div>
            <div className="hidden md:flex">
              <Link href={"#contact-me"}>
                <Button title="Contact" color="green" />
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
          {!isScrolled ? (
            <Link href={"/"}>
              <h1 className="font-bold text-xl">Fredrik Hansteen</h1>
            </Link>
          ) : (
            <div></div>
          )}
          <div className="relative">
            <button
              className={`relative flex h-12 w-12 items-center justify-center transition-all duration-500 hover:opacity-70 md:hidden ${
                !isScrolled
                  ? "border-transparent"
                  : "bg-white dark:bg-gray-900 border-solid border-2 dark:border-white border-gray-900 rounded-full"
              } `}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label={`${isDropdownOpen ? "Lukk" : "Åpne"} meny`}
            >
              <Bars3Icon
                className={clsx(
                  "absolute size-8 text-black dark:text-white transition-transform duration-500",
                  isDropdownOpen
                    ? "rotate-180 opacity-0"
                    : "rotate-0 opacity-100"
                )}
              />
              <XMarkIcon
                className={clsx(
                  "absolute size-8 text-black dark:text-white transition-transform duration-500",
                  isDropdownOpen
                    ? "rotate-0  opacity-100"
                    : "rotate-180 opacity-0"
                )}
              />
            </button>
            {isDropdownOpen && <DropdownMenu toggleDropdown={toggleDropdown} />}
          </div>
        </div>
      </div>
    </nav>
  );
}
