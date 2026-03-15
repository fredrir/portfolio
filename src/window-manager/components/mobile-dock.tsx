"use client";

import { motion } from "framer-motion";
import {
  UserCircle,
  EnvelopeSimple,
  Terminal,
  GearSix,
  House,
} from "@phosphor-icons/react";
import { WINDOW_CONFIGS } from "../constants";
import { DockIcon } from "./dock-icon";
import type { UiStrings } from "@/shared/types";

interface Props {
  activeApp: string | null;
  onOpenApp: (id: string) => void;
  onGoHome: () => void;
  ui: UiStrings;
}

const DOCK_IDS = ["about", "contact", "terminal", "settings"] as const;

const DOCK_ICONS: Record<string, React.ReactNode> = {
  about: <UserCircle size={20} weight="bold" />,
  contact: <EnvelopeSimple size={20} weight="bold" />,
  terminal: <Terminal size={20} weight="bold" />,
  settings: <GearSix size={20} weight="bold" />,
};

const configMap = Object.fromEntries(WINDOW_CONFIGS.map((c) => [c.id, c]));

const BLOB_KEYFRAMES = [
  "60% 40% 55% 45% / 45% 60% 40% 55%",
  "40% 60% 45% 55% / 55% 40% 60% 40%",
  "55% 45% 60% 40% / 40% 55% 45% 60%",
  "60% 40% 55% 45% / 45% 60% 40% 55%",
];

const BULGE_OUT =
  "M 4.4,100 Q 0,100 0,78 L 0,44 Q 0,22 4.4,22 L 35,22 C 42,22 46,0 50,0 C 54,0 58,22 65,22 L 95.6,22 Q 100,22 100,44 L 100,78 Q 100,100 95.6,100 Z";

const BULGE_IN =
  "M 4.4,100 Q 0,100 0,78 L 0,44 Q 0,22 4.4,22 L 35,22 C 42,22 46,34 50,34 C 54,34 58,22 65,22 L 95.6,22 Q 100,22 100,44 L 100,78 Q 100,100 95.6,100 Z";

const CLIP_BULGE_OUT =
  "M 0.044,1 Q 0,1 0,0.78 L 0,0.44 Q 0,0.22 0.044,0.22 L 0.35,0.22 C 0.42,0.22 0.46,0 0.5,0 C 0.54,0 0.58,0.22 0.65,0.22 L 0.956,0.22 Q 1,0.22 1,0.44 L 1,0.78 Q 1,1 0.956,1 Z";

const CLIP_BULGE_IN =
  "M 0.044,1 Q 0,1 0,0.78 L 0,0.44 Q 0,0.22 0.044,0.22 L 0.35,0.22 C 0.42,0.22 0.46,0.34 0.5,0.34 C 0.54,0.34 0.58,0.22 0.65,0.22 L 0.956,0.22 Q 1,0.22 1,0.44 L 1,0.78 Q 1,1 0.956,1 Z";

export function MobileDock({ activeApp, onOpenApp, onGoHome, ui }: Props) {
  const isHome = activeApp === null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] font-mono">
      <div
        className="relative mx-3 mb-3 h-[4.5rem]"
        style={{
          filter:
            "drop-shadow(0 4px 12px var(--color-wm-shadow-soft, rgba(0,0,0,0.1)))",
        }}
      >
        <svg className="absolute w-0 h-0" aria-hidden>
          <defs>
            <clipPath id="dock-bulge-out" clipPathUnits="objectBoundingBox">
              <path d={CLIP_BULGE_OUT} />
            </clipPath>
            <clipPath id="dock-bulge-in" clipPathUnits="objectBoundingBox">
              <path d={CLIP_BULGE_IN} />
            </clipPath>
          </defs>
        </svg>

        <motion.div
          className="absolute inset-0 bg-glass-faint backdrop-blur-xl"
          animate={{
            clipPath: isHome ? `url(#dock-bulge-out)` : `url(#dock-bulge-in)`,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.path
            animate={{ d: isHome ? BULGE_OUT : BULGE_IN }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            fill="none"
            className="stroke-wm-border"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative z-20 flex items-end justify-around h-full px-2 pb-2">
          {DOCK_IDS.slice(0, 2).map((id) => (
            <DockIcon
              key={id}
              icon={DOCK_ICONS[id]}
              label={ui.localeTitles[id] ?? configMap[id].shortTitle}
              isActive={activeApp === id}
              onTap={() => onOpenApp(id)}
            />
          ))}

          <motion.button
            onClick={onGoHome}
            whileTap={{ scale: 0.85 }}
            className="flex flex-col items-center gap-0.5"
            animate={{ marginBottom: isHome ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
              animate={{
                borderRadius: isHome ? BLOB_KEYFRAMES : "50%",
                scale: isHome ? 1.15 : 0.85,
              }}
              transition={{
                borderRadius: isHome
                  ? { duration: 8, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.4, ease: "easeOut" },
                scale: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className={`flex items-center justify-center transition-colors duration-300 ${
                isHome ? "text-primary" : "text-ghost opacity-70"
              }`}
            >
              <House size={22} weight="bold" />
            </motion.div>
            <span
              className={`text-xs truncate w-full text-center transition-colors ${
                isHome ? "text-primary-bold" : "text-ghost"
              }`}
            >
              {ui.localeTitles["home"] ?? "Home"}
            </span>
          </motion.button>

          {DOCK_IDS.slice(2).map((id) => (
            <DockIcon
              key={id}
              icon={DOCK_ICONS[id]}
              label={ui.localeTitles[id] ?? configMap[id].shortTitle}
              isActive={activeApp === id}
              onTap={() => onOpenApp(id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
