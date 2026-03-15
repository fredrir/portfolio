"use client";

import { motion } from "framer-motion";
import {
  UserCircle,
  EnvelopeSimple,
  Terminal,
  GearSix,
  House,
} from "@phosphor-icons/react";

interface Props {
  activeApp: string | null;
  onOpenApp: (id: string) => void;
  onGoHome: () => void;
}

const DOCK_ITEMS: { id: string; icon: React.ReactNode; label: string }[] = [
  { id: "about", icon: <UserCircle size={20} weight="bold" />, label: "whoami" },
  { id: "contact", icon: <EnvelopeSimple size={20} weight="bold" />, label: "mail" },
  { id: "terminal", icon: <Terminal size={20} weight="bold" />, label: "kitty" },
  { id: "settings", icon: <GearSix size={20} weight="bold" />, label: "settings" },
];

export function MobileDock({ activeApp, onOpenApp, onGoHome }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] font-mono">
      <div className="mx-3 mb-3 rounded-2xl bg-background/70 border border-primary/15 backdrop-blur-xl shadow-lg shadow-primary/5">
        <div className="flex items-center justify-around h-14 px-2">
          {DOCK_ITEMS.slice(0, 2).map((item) => (
            <DockIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeApp === item.id}
              onTap={() => onOpenApp(item.id)}
            />
          ))}

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onGoHome}
            className="flex flex-col items-center justify-center gap-0.5 -mt-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/[0.12] border border-primary/25 flex items-center justify-center text-primary/80 shadow-md shadow-primary/10">
              <House size={22} weight="bold" />
            </div>
          </motion.button>

          {DOCK_ITEMS.slice(2).map((item) => (
            <DockIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeApp === item.id}
              onTap={() => onOpenApp(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DockIcon({
  icon,
  label,
  isActive,
  onTap,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onTap: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onTap}
      className="flex flex-col items-center justify-center gap-0.5 w-14"
    >
      <span
        className={`transition-colors ${isActive ? "text-primary" : "text-muted-foreground/50"}`}
      >
        {icon}
      </span>
      <span
        className={`text-3xs transition-colors ${isActive ? "text-primary/80" : "text-muted-foreground/30"}`}
      >
        {label}
      </span>
    </motion.button>
  );
}
