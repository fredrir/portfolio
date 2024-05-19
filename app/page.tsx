"use client";
import Navbar from "./ui/navbar";
import { InfoBox } from "./components/info_box";
import { useSpring, animated } from "@react-spring/web";
import { useEffect, useState } from "react";
import { AboutMeBox } from "./components/about_me";
import { GithubStats } from "./components/github_stats";
import Image from "next/image";
import TopPage from "./components/top_page";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const checkDarkMode = () => {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    };

    checkDarkMode();

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);

    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    handleThemeChange(); // Check the initial theme

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const backgroundProps = useSpring({
    background:
      theme === "dark"
        ? "linear-gradient(to right, #8f3801, #6d0171)"
        : "linear-gradient(to right, #ff7e5f, #feb47b)",
  });

  return (
    <animated.div
      style={{ ...backgroundProps, minHeight: "100vh" }}
      className="flex flex-col"
    >
      <Navbar />
      <TopPage />
      <div className="w-full h-2border-solid border-white border rounded items-center">
        <p className="text-center text-white">Skills</p>
      </div>
    </animated.div>
  );
}
