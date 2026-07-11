"use client";

import { EnvelopeSimple, GearSix, House, Terminal, UserIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { UiStrings } from "@/i18n/types";
import { configMap } from "../../constants";
import type { MobileState } from "../types";
import { DockIcon } from "./dock-icon";

interface Props {
  mobile: MobileState;
  ui: UiStrings;
}

const DOCK_IDS = ["about", "contact", "home", "terminal", "settings"] as const;

const DOCK_ICONS: Record<string, React.ReactNode> = {
  about: <UserIcon size={20} weight="bold" />,
  contact: <EnvelopeSimple size={20} weight="bold" />,
  home: <House size={22} weight="bold" />,
  terminal: <Terminal size={20} weight="bold" />,
  settings: <GearSix size={20} weight="bold" />,
};

const DOCK_CENTERS: Record<string, number> = {
  about: 10,
  contact: 30,
  home: 50,
  terminal: 70,
  settings: 90,
};

function bulgePoints(center: number) {
  const cl = (v: number) => Math.max(4.4, Math.min(95.6, v));
  return {
    left: cl(center - 15),
    lcp1: cl(center - 8),
    lcp2: cl(center - 4),
    rcp1: cl(center + 4),
    rcp2: cl(center + 8),
    right: cl(center + 15),
  };
}

function makePath(center: number, flat: boolean): string {
  const b = bulgePoints(center);
  const y = flat ? 22 : 0;
  return `M 4.4,100 Q 0,100 0,78 L 0,44 Q 0,22 4.4,22 L ${b.left},22 C ${b.lcp1},22 ${b.lcp2},${y} ${center},${y} C ${b.rcp1},${y} ${b.rcp2},22 ${b.right},22 L 95.6,22 Q 100,22 100,44 L 100,78 Q 100,100 95.6,100 Z`;
}

function makeClipPath(center: number, flat: boolean): string {
  const b = bulgePoints(center);
  const n = (v: number) => (v / 100).toFixed(3);
  const y = flat ? "0.22" : "0";
  return `M 0.044,1 Q 0,1 0,0.78 L 0,0.44 Q 0,0.22 0.044,0.22 L ${n(b.left)},0.22 C ${n(b.lcp1)},0.22 ${n(b.lcp2)},${y} ${n(center)},${y} C ${n(b.rcp1)},${y} ${n(b.rcp2)},0.22 ${n(b.right)},0.22 L 0.956,0.22 Q 1,0.22 1,0.44 L 1,0.78 Q 1,1 0.956,1 Z`;
}

export function MobileDock({ mobile, ui }: Props) {
  const { activeApp } = mobile;
  const activeId = activeApp ?? "home";
  const hasDockActive = activeApp === null || (DOCK_IDS as readonly string[]).includes(activeApp);
  const bulgeCenter = DOCK_CENTERS[activeId] ?? 50;
  const svgPath = makePath(bulgeCenter, !hasDockActive);
  const clipPath = makeClipPath(bulgeCenter, !hasDockActive);

  return (
    <div className="fixed right-0 bottom-0 left-0 z-[9999] font-mono">
      <div
        className="relative mx-3 mb-3 h-[4.5rem]"
        style={{
          filter: "drop-shadow(0 4px 12px var(--color-wm-shadow-soft, rgba(0,0,0,0.1)))",
        }}
      >
        <svg className="absolute h-0 w-0" aria-hidden>
          <defs>
            <clipPath id="dock-clip" clipPathUnits="objectBoundingBox">
              <motion.path
                animate={{ d: clipPath }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </clipPath>
          </defs>
        </svg>

        <div
          className="absolute inset-0 bg-glass-faint backdrop-blur-xl"
          style={{ clipPath: "url(#dock-clip)" }}
        />

        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.path
            animate={{ d: svgPath }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            fill="none"
            className="stroke-wm-border"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative z-20 flex h-full items-end justify-around pb-2">
          {DOCK_IDS.map((id) => {
            const isActive = id === "home" ? activeApp === null : activeApp === id;
            const label = ui.localeTitles[id] ?? configMap[id].title;

            return (
              <DockIcon
                key={id}
                icon={DOCK_ICONS[id]}
                label={label}
                isActive={isActive}
                onTap={id === "home" ? mobile.goHome : () => mobile.setActiveApp(id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
