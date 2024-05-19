"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GitLogo, LinkLogo } from "./logos";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSpring, animated } from "@react-spring/web";
import ThemeToggle from "../components/theme_toggle";

export default function Navbar({}: {}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const navbarProps = useSpring({
    background: "linear-gradient(to right, #ff7e5f, #feb47b)",
  });

  return (
    <animated.div
      // style={navbarProps}
      className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:bg-gradient-to-r dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"
    >
      <div className="flex items-center mb-4 p-6 text-2xl">
        <div className="w-1/3 hidden md:block ">
          <p className="text-3xl">Fredrik Hansteen</p>
        </div>
        <div className="w-1/5 hidden md:block cv-box">
          <Link
            href="/about"
            className="rounded-full border-2 border-white py-1 px-4 cv-text"
          >
            CV
          </Link>
        </div>
        <div className="w-1/5 hidden md:block cv-box">
          <a
            href="/"
            className="rounded-full border-2 border-white py-1 px-4 cv-text"
          >
            Home
          </a>
        </div>
        <div className="w-1/5 hidden md:block cv-box">
          <a
            href="/contact"
            className="rounded-full border-2 border-white py-1 px-4 cv-text"
          >
            Contact
          </a>
        </div>
        <div className="flex w-1/6 items-center justify-between hidden md:flex">
          <Link href="https://www.linkedin.com/in/fredrik-carsten-hansteen-655287281/">
            <LinkLogo />
          </Link>
          <Link href="https://github.com/fredrir">
            <GitLogo />
          </Link>
          <ThemeToggle />
        </div>
        <div className={`flex md:hidden w-full justify-between items-center `}>
          <p className="w-3/4">Fredrik Hansteen</p>
          <button onClick={toggleDropdown} className="w-1/4 flex justify-end">
            <Bars3Icon className="h-10 w-10 text-white" />
          </button>
          {isDropdownOpen && (
            <div
              className={`absolute top-full right-0 mt-2 py-2 w-48 "dark:bg-gradient-to-r from-indigo-800 via-pink-900 to-purple-800 bg-gradient-to-r from-yellow-400 via-red-300 to-blue-300"
              } rounded-lg shadow-xl`}
            >
              <Link
                href="/about"
                className="block px-4 py-2 text-sm dark:text-gray-white text-gray-700 hover:bg-gray-100"
              >
                CV
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-sm dark:text-gray-white text-gray-700 hover:bg-gray-100"
              >
                Contact
              </Link>
              <Link
                href="https://www.linkedin.com/in/fredrik-carsten-hansteen-655287281/"
                className="block px-4 py-2 text-sm dark:text-gray-white text-gray-700 hover:bg-gray-100"
              >
                LinkedIn
              </Link>
              <Link
                href="https://github.com/fredrir"
                className="block px-4 py-2 text-sm dark:text-gray-white text-gray-700 hover:bg-gray-100"
              >
                Github
              </Link>
              {/* <button clasName="text-white px-4 py-2 text-sm dark:text-gray-800" onClick={toggleDarkMode}>
                
                
              </button> */}
            </div>
          )}
        </div>
      </div>
    </animated.div>
  );
}
