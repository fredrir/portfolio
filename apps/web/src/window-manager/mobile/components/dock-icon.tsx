"use client";

import { motion } from "framer-motion";

interface Props {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onTap: () => void;
}

const BLOB_KEYFRAMES = [
  "60% 40% 55% 45% / 45% 60% 40% 55%",
  "40% 60% 45% 55% / 55% 40% 60% 40%",
  "55% 45% 60% 40% / 40% 55% 45% 60%",
  "60% 40% 55% 45% / 45% 60% 40% 55%",
];

export function DockIcon({ icon, label, isActive, onTap }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onTap}
      className="flex w-14 flex-col items-center gap-0.5 overflow-hidden"
      animate={{ marginBottom: isActive ? 16 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <motion.div
        animate={{
          borderRadius: isActive ? BLOB_KEYFRAMES : "50%",
          scale: isActive ? 1.15 : 0.85,
        }}
        transition={{
          borderRadius: isActive
            ? { duration: 8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.4, ease: "easeOut" },
          scale: { duration: 0.4, ease: "easeInOut" },
        }}
        className={`flex items-center justify-center transition-colors duration-300 ${
          isActive ? "text-primary" : "text-faded"
        }`}
      >
        {icon}
      </motion.div>
      <span
        className={`w-full truncate text-center text-xs transition-colors ${
          isActive ? "text-primary-bold" : "text-ghost"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}
