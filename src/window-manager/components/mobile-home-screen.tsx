"use client";

import { motion } from "framer-motion";
import {
  UserCircle,
  GithubLogo,
  SpotifyLogo,
  Path,
  FolderSimple,
  EnvelopeSimple,
  GearSix,
  Terminal,
  Images,
  FileText,
} from "@phosphor-icons/react";
import { WINDOW_CONFIGS } from "../constants";
import type { UiStrings } from "@/i18n/types";

const GRID_ICONS: Record<string, React.ReactNode> = {
  about: <UserCircle size={28} weight="duotone" />,
  github: <GithubLogo size={28} weight="duotone" />,
  spotify: <SpotifyLogo size={28} weight="duotone" />,
  journey: <Path size={28} weight="duotone" />,
  projects: <FolderSimple size={28} weight="duotone" />,
  contact: <EnvelopeSimple size={28} weight="duotone" />,
  settings: <GearSix size={28} weight="duotone" />,
  terminal: <Terminal size={28} weight="duotone" />,
  gallery: <Images size={28} weight="duotone" />,
  resume: <FileText size={28} weight="duotone" />,
};

interface Props {
  onOpenApp: (id: string) => void;
  ui: UiStrings;
  locale: string;
}

export function MobileHomeScreen({ onOpenApp, ui, locale }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div className="font-mono text-sm text-readable mb-8 tracking-widest uppercase">
        fredrik@hansteen
      </div>

      <div className="grid grid-cols-4 gap-x-4 gap-y-6 w-full max-w-sm">
        {WINDOW_CONFIGS.map((config, i) => (
          <motion.button
            key={config.id}
            onClick={() => {
              if (config.isExternal && config.href) {
                const url = typeof config.href === "string" ? config.href : (config.href[locale] ?? config.href.en);
                window.open(url, "_blank", "noopener,noreferrer");
              } else {
                onOpenApp(config.id);
              }
            }}
            whileTap={{ scale: 0.85 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-soft border border-border-medium backdrop-blur-md flex items-center justify-center text-primary-bold shadow-md shadow-wm-shadow-soft active:bg-surface-elevated transition-colors">
              {GRID_ICONS[config.id]}
            </div>
            <span className="font-mono text-xs text-readable truncate max-w-[4rem] capitalize">
              {ui.localeTitles[config.id] ?? config.shortTitle}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
