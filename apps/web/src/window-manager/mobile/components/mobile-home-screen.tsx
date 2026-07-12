"use client";

import {
  ChartLine,
  EnvelopeSimple,
  FileText,
  FolderSimple,
  GearSix,
  GithubLogo,
  Images,
  Path,
  SpotifyLogo,
  Terminal,
  UserCircle,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { UiStrings } from "@/i18n/types";
import { DockerIcon } from "@/shared/components/docker-icon";
import { openExternalWindow, WINDOW_CONFIGS } from "../../constants";

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
  docker: <DockerIcon size={28} />,
  analytics: <ChartLine size={28} weight="duotone" />,
};

interface Props {
  onOpenApp: (id: string) => void;
  ui: UiStrings;
  locale: string;
}

export function MobileHomeScreen({ onOpenApp, ui, locale }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
      <div className="mb-8 font-mono text-readable text-sm uppercase tracking-widest">
        fredrik@hansteen
      </div>

      <div className="grid w-full max-w-sm grid-cols-4 gap-x-4 gap-y-6">
        {WINDOW_CONFIGS.map((config, i) => (
          <motion.button
            key={config.id}
            onClick={() => {
              if (config.isExternal && config.href) {
                openExternalWindow(config, locale);
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-medium bg-surface-soft text-primary-bold shadow-md shadow-wm-shadow-soft backdrop-blur-md transition-colors active:bg-surface-elevated">
              {GRID_ICONS[config.id]}
            </div>
            <span className="max-w-[4rem] truncate font-mono text-readable text-xs capitalize">
              {ui.localeTitles[config.id] ?? config.id}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
