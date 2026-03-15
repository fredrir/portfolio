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
      className="flex flex-col items-center justify-center gap-0.5 w-14 overflow-hidden"
    >
      <span
        className={`transition-colors ${isActive ? "text-primary" : "text-faded"}`}
      >
        {icon}
      </span>
      <span
        className={`text-xs truncate w-full text-center transition-colors ${isActive ? "text-primary-bold" : "text-ghost"}`}
      >
        {label}
      </span>
    </motion.button>
  );
}
