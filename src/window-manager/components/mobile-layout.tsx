"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WINDOW_CONFIGS } from "../constants";
import { MobileHomeScreen } from "./mobile-home-screen";
import type { UiStrings } from "@/shared/types";

interface Props {
  paneContent: Record<string, React.ReactNode>;
  activeApp: string | null;
  onOpenApp: (id: string) => void;
  onGoHome: () => void;
  ui: UiStrings;
}

export function MobileLayout({
  paneContent,
  activeApp,
  onOpenApp,
  onGoHome,
  ui,
}: Props) {
  const activeConfig = activeApp
    ? WINDOW_CONFIGS.find((c) => c.id === activeApp)
    : null;

  return (
    <div className="fixed inset-0 flex flex-col" style={{ paddingBottom: 76 }}>
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
            <MobileHomeScreen onOpenApp={onOpenApp} ui={ui} />
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
            <div className="flex-1 flex flex-col m-2 rounded-xl border border-primary/20 bg-background/80 backdrop-blur-md shadow-lg shadow-primary/5 overflow-hidden min-h-0">
              <div className="flex items-center px-3 py-2 border-b border-primary/15 bg-primary/[0.03] shrink-0">
                <button
                  onClick={onGoHome}
                  className="text-primary/60 hover:text-primary transition-colors mr-3 font-mono text-sm"
                >
                  ‹
                </button>
                <span className="font-mono text-2xs text-muted-foreground/50 flex-1 text-center">
                  {activeConfig && (ui.shortTitles[activeConfig.id] ?? activeConfig.shortTitle)}
                </span>
                <span className="font-mono text-3xs text-primary/30">
                  fredrir@hansteen
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
