"use client";

import Link from "next/link";
import { useTheme } from "@/lib/hooks/UseTheme";
import Image from "next/image";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { Suspense, useEffect, useState } from "react";
import FocusTrap from "focus-trap-react";
import { RolldownMenu } from "./RollDownMenu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.querySelector("body")?.classList.add("overflow-hidden");
    } else {
      document.querySelector("body")?.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

  return (
    <nav className="w-full">
      <FocusTrap active={isMenuOpen}>
        <div>
          <div className="flex justify-between w-full py-5 px-5 items-center border-b-[1px] border-gray-200 dark:border-0 dark:bg-rif-darkBlue">
            <Link href="/">
              <h2 className="text-3xl font-bold">Fredrik Hansteen</h2>
            </Link>
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:gap-5 sm:items-center text-online-darkTeal dark:text-white">
              <Button
                title="CV"
                color="white"
                size="small"
                hiddenMobile={true}
              />

              <Button
                title="Contact"
                color="green"
                size="small"
                hiddenMobile={true}
              />

              <ThemeToggle />
              <button
                className="flex items-center justify-center md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Image
                  src="/menu-burger.svg"
                  alt="Menu"
                  width={32}
                  height={32}
                />
                <span className="sr-only">
                  {isMenuOpen && <>Close Menu</>}
                  {!isMenuOpen && <>Open Menu</>}
                </span>
              </button>
            </div>
          </div>
          <Suspense>
            <RolldownMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            >
              <ul className="mt-4 grid gap-4 bg-rif-darkBlue">
                <li>
                  <Link href="/" className="">
                    Home
                  </Link>
                </li>
                <li>...</li>
              </ul>
            </RolldownMenu>
          </Suspense>
        </div>
      </FocusTrap>
    </nav>
  );
}
