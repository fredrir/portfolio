"use client";

import { AnimatePresence, motion } from "framer-motion";
import { USER_HOST } from "@/lib/constants";
import { WINDOW_CONFIGS } from "../constants";
import { MobileHomeScreen } from "./mobile-home-screen";
import type { UiStrings } from "@/shared/types";

interface Props {
  paneContent: Record<string, React.ReactNode>;
  activeApp: string | null;
  onOpenApp: (id: string) => void;
  onGoHome: () => void;
  ui: UiStrings;
  locale: string;
}

export function MobileLayout({
  paneContent,
  activeApp,
  onOpenApp,
  onGoHome,
  ui,
  locale,
}: Props) {
  const activeConfig = activeApp
    ? WINDOW_CONFIGS.find((c) => c.id === activeApp)
    : null;

  return (
    <div className="fixed inset-0 flex flex-col" style={{ paddingBottom: 84 }}>
      <AnimatePresence mode="wait">
        {activeApp === null ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            <MobileHomeScreen onOpenApp={onOpenApp} ui={ui} locale={locale} />
          </motion.div>
        ) : (
          <motion.div
            key={activeApp}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 flex flex-col m-2 rounded-xl border border-border-medium bg-glass-light backdrop-blur-md shadow-lg shadow-wm-shadow-soft overflow-hidden min-h-0">
              <div className="flex items-center px-3 py-2 border-b border-wm-border bg-surface-faint shrink-0">
                <button
                  onClick={onGoHome}
                  className="text-primary-soft hover:text-primary active:text-primary transition-colors mr-3 font-mono text-2xl leading-none -mt-0.5 px-1"
                >
                  ‹
                </button>
                <span className="font-mono text-xs text-faded flex-1 text-center">
                  {activeConfig &&
                    (ui.localeTitles[activeConfig.id] ??
                      activeConfig.shortTitle)}
                </span>
                <span className="font-mono text-xs text-primary-subtle">
                  {USER_HOST}
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                {paneContent[activeApp]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
