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
} from "@phosphor-icons/react";
import { WINDOW_CONFIGS } from "../constants";
import type { UiStrings } from "@/shared/types";

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
};

interface Props {
  onOpenApp: (id: string) => void;
  ui: UiStrings;
}

export function MobileHomeScreen({ onOpenApp, ui }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div className="font-mono text-2xs text-muted-foreground/40 mb-8 tracking-widest uppercase">
        fredrir@hansteen: ~
      </div>

      <div className="grid grid-cols-4 gap-x-4 gap-y-6 w-full max-w-sm">
        {WINDOW_CONFIGS.map((config, i) => (
          <motion.button
            key={config.id}
            onClick={() => onOpenApp(config.id)}
            whileTap={{ scale: 0.85 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/[0.08] border border-primary/20 backdrop-blur-md flex items-center justify-center text-primary/80 shadow-md shadow-primary/5 active:bg-primary/[0.15] transition-colors">
              {GRID_ICONS[config.id]}
            </div>
            <span className="font-mono text-3xs text-muted-foreground/60 truncate max-w-[4rem]">
              {ui.shortTitles[config.id] ?? config.shortTitle}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
