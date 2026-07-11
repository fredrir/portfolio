"use client";

import { ArrowLeft } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { UiStrings } from "@/i18n/types";
import { USER_HOST } from "@/lib/constants";
import { MobileBackContext, useMobileBackState } from "@/shared/hooks/use-mobile-back";
import { WINDOW_CONFIGS } from "../../constants";
import type { MobileState } from "../types";
import { MobileHomeScreen } from "./mobile-home-screen";

interface Props {
  paneContent: Record<string, React.ReactNode>;
  mobile: MobileState;
  ui: UiStrings;
  locale: string;
}

export function MobileLayout({ paneContent, mobile, ui, locale }: Props) {
  const { activeApp } = mobile;
  const activeConfig = activeApp ? WINDOW_CONFIGS.find((c) => c.id === activeApp) : null;

  const { hasBack, backLabel, subtitle, triggerBack, setBackAction, setSubtitle } =
    useMobileBackState();

  useEffect(() => {
    setBackAction(null);
    setSubtitle(null);
  }, [activeApp, setBackAction, setSubtitle]);

  return (
    <div className="fixed inset-0 flex flex-col" style={{ paddingBottom: 80 }}>
      <AnimatePresence mode="wait">
        {activeApp === null ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-1 flex-col"
          >
            <MobileHomeScreen onOpenApp={mobile.setActiveApp} ui={ui} locale={locale} />
          </motion.div>
        ) : (
          <motion.div
            key={activeApp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="m-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-medium bg-glass-light shadow-lg shadow-wm-shadow-soft backdrop-blur-md">
              <div className="flex shrink-0 items-center border-wm-border border-b bg-surface-faint px-3 py-2">
                {hasBack ? (
                  <button
                    onClick={triggerBack}
                    className="mr-1 inline-flex shrink-0 items-center gap-1 font-mono text-primary-soft text-xs transition-colors hover:text-primary active:text-primary"
                  >
                    <ArrowLeft size={18} weight="bold" />
                    {backLabel && <span className="text-2xs">{backLabel}</span>}
                  </button>
                ) : (
                  <div className="w-5 shrink-0" />
                )}
                <span className="flex-1 truncate text-center font-mono text-faded text-xs">
                  {subtitle ??
                    (activeConfig && (ui.localeTitles[activeConfig.id] ?? activeConfig.title))}
                </span>
                <span className="font-mono text-primary-subtle text-xs">{USER_HOST}</span>
              </div>
              <div className="@container flex-1 overflow-auto font-mono text-xs">
                <MobileBackContext.Provider value={{ setBackAction, setSubtitle }}>
                  {paneContent[activeApp]}
                </MobileBackContext.Provider>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
