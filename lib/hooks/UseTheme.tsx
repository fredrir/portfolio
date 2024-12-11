"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const themes = ["light", "dark", "neon", "forest", "ocean"] as const;
type Theme = (typeof themes)[number];

const backgroundColors: Record<Theme, string> = {
  light: "bg-white",
  dark: "bg-gray-900",
  neon: "bg-neon-light",
  forest: "bg-forest-light",
  ocean: "bg-ocean-light",
};

const textColors: Record<Theme, string> = {
  light: "text-gray-900",
  dark: "text-white",
  neon: "text-neon-opposite",
  forest: "text-forest-opposite",
  ocean: "text-ocean-opposite",
};

interface ThemeContextProps {
  theme: Theme;
  cycleTheme: () => void;
  background: string;
  text: string;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...themes);
    root.classList.add(theme);
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const background = backgroundColors[theme];
  const text = textColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, background, text }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
