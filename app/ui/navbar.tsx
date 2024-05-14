"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GitLogo, LinkLogo } from "./logos";
import {
  Bars3Icon,
  MoonIcon as MoonIconOutline,
} from "@heroicons/react/24/outline";
import { MoonIcon as MoonIconSolid } from "@heroicons/react/24/solid";
import { useSpring, animated } from "@react-spring/web";

export default function Navbar({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const navbarProps = useSpring({
    background: darkMode
      ? "linear-gradient(to right, #232526, #414345)"
      : "linear-gradient(to right, #ff7e5f, #feb47b)",
  });

  return (
    <animated.div style={navbarProps} className="relative">
      <div className="flex items-center mb-4 p-6 text-2xl">
        <div className="w-1/3 hidden md:block">
          <p className="text-3xl">Fredrik Hansteen</p>
        </div>
        <div className="w-1/5 hidden md:block cv-box">
          <a
            href="/about"
            className="rounded-full border-2 border-white py-1 px-4 cv-text"
          >
            CV
          </a>
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
          <button className="group" onClick={toggleDarkMode}>
            {darkMode ? (
              <MoonIconSolid className="h-10 w-10 text-white group-hover:fill-current" />
            ) : (
              <MoonIconOutline className="h-10 w-10 text-white group-hover:fill-current" />
            )}
          </button>
        </div>
        <div className="flex md:hidden w-full justify-between items-center">
          <p className="w-3/4">Fredrik Hansteen</p>
          <button onClick={toggleDropdown} className="w-1/4 flex justify-end">
            <Bars3Icon className="h-10 w-10 text-white" />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
              <Link
                href="/about"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                CV
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Contact
              </Link>
              <Link
                href="https://www.linkedin.com/in/fredrik-carsten-hansteen-655287281/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                LinkedIn
              </Link>
              <Link
                href="https://github.com/fredrir"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Github
              </Link>
            </div>
          )}
        </div>
      </div>
    </animated.div>
  );
}
