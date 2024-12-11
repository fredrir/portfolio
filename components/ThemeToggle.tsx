"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Sun, Moon, Zap, TreePine, Waves } from "lucide-react";
import { useTheme } from "@/lib/hooks/UseTheme";

const themeConfig = {
  light: { icon: Sun, color: "#F9D71C", background: "#F0F4F8" },
  dark: { icon: Moon, color: "#A0AEC0", background: "#1A202C" },
  neon: { icon: Zap, color: "#00FF00", background: "#0D0D0D" },
  forest: { icon: TreePine, color: "#2ECC71", background: "#1D3B2A" },
  ocean: { icon: Waves, color: "#3498DB", background: "#1A5276" },
} as const;

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  return (
    <motion.button
      className="relative w-28 h-12 rounded-full shadow-lg overflow-hidden focus:outline-none"
      onClick={cycleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Current theme: ${theme}. Click to change theme.`}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ backgroundColor: themeConfig[theme].background }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.3 }}
          >
            {React.createElement(themeConfig[theme].icon, {
              className: "w-8 h-8",
              style: { color: themeConfig[theme].color },
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-white mix-blend-overlay"
        animate={{ opacity: theme === "light" ? 0 : 0.1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: themeConfig[theme].color }}
        layoutId="underline"
      />
    </motion.button>
  );
}
