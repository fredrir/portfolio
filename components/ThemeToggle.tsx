import { useState, useEffect } from "react";
import {
  MoonIcon as MoonIconSolid,
  SunIcon as SunIconSolid,
} from "@heroicons/react/24/solid";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div>
      <div className="hidden md:block">
        <button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="p-2 transition duration-300 ease-in-out rounded-full group"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <MoonIconSolid className="w-8 h-8 transition-transform duration-300 ease-in-out group-hover:scale-110" />
          ) : (
            <SunIconSolid className="w-8 h-8 transition-transform duration-300 ease-in-out group-hover:scale-110" />
          )}
        </button>
      </div>
      <div className="md:hidden">
        <button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="w-full p-2 px-4 py-2 text-left text-gray-700 cursor-pointer group dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <p>Lightmode</p> : <p>Darkmode</p>}
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
