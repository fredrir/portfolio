"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GitLogo } from "./logos";
import { LinkLogo } from "./logos";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="relative">
      <div className="flex items-center mb-4 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-2xl">
        <div className="w-1/3 hidden md:block">
          <p>Fredrik Hansteen</p>
        </div>
        <div className="w-1/5 hidden md:block">
          <a href="/">Home</a>
        </div>
        <div className="w-1/5 hidden md:block">
          <a href="/about">CV</a>
        </div>
        <div className="w-1/5 hidden md:block">
          <a href="/contact">Contact</a>
        </div>
        <div className="flex w-1/5 items-center justify-end hidden md:flex">
          <div className="mr-8">
            <Link href="https://www.linkedin.com/in/fredrik-carsten-hansteen-655287281/">
              <LinkLogo />
            </Link>
          </div>
          <div>
            <Link href="https://github.com/fredrir">
              <GitLogo />
            </Link>
          </div>
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
    </div>
  );
}
