import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  MusicalNoteIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import React from "react";

const availableThemes = ["light", "dark", "ambient", "orange"] as const;
type Theme = (typeof availableThemes)[number];

const themeIcons: Record<
  Theme,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  light: SunIcon,
  dark: MoonIcon,
  ambient: SparklesIcon,
  orange: MusicalNoteIcon,
};

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return (window.localStorage.getItem("theme") as Theme) || "dark";
    }
    return "dark";
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    availableThemes.forEach((t) => root.classList.remove(t));
    root.classList.add(theme);

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center items-center w-full p-2 transition duration-300 ease-in-out rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {themeIcons[theme] &&
          React.createElement(themeIcons[theme], {
            className: "w-6 h-6 text-gray-800 dark:text-gray-200",
          })}
        <ChevronDownIcon className="w-5 h-5 ml-2" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <div className="py-1">
            {availableThemes.map((t) => (
              <button
                key={t}
                onClick={() => selectTheme(t)}
                className={`${
                  theme === t
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-600"
                } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              >
                {themeIcons[t] &&
                  React.createElement(themeIcons[t], {
                    className: "w-5 h-5 mr-3",
                  })}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
