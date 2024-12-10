import { useState, useEffect } from "react";

const availableThemes = ["light", "dark", "ambient", "orange"] as const;
type Theme = (typeof availableThemes)[number];

export const useTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(storedTheme);

    const handleThemeChange = () => {
      const currentTheme = availableThemes.find((t) =>
        document.documentElement.classList.contains(t)
      );
      if (currentTheme) {
        setTheme(currentTheme);
      }
    };

    handleThemeChange();

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
};
