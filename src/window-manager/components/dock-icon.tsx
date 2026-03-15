"use client";

import { motion } from "framer-motion";

interface Props {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onTap: () => void;
}

export function DockIcon({ icon, label, isActive, onTap }: Props) {
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
