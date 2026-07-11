"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { AvatarModel } from "@/shared/fredvatar/components/avatar-model";
import type { Notification, NotificationType } from "../types";

const ACCENT: Record<NotificationType, string> = {
  success: "border-l-green-500",
  error: "border-l-red-500",
  info: "border-l-primary",
};

const PROGRESS_COLOR: Record<NotificationType, string> = {
  success: "bg-green-500/60",
  error: "bg-red-500/60",
  info: "bg-primary-soft",
};

const REACTION: Record<NotificationType, string> = {
  success: "bounce",
  error: "wiggle",
  info: "idle",
};

interface Props {
  notification: Notification;
  onDismiss: (id: string) => void;
}

export function NotificationItem({ notification, onDismiss }: Props) {
  const { id, type, message, duration, dismissing } = notification;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
  }, []);

  const show = entered && !dismissing;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 overflow-hidden rounded-lg border border-border-medium border-l-[3px] bg-glass-medium font-mono text-xs shadow-lg shadow-wm-shadow-soft backdrop-blur-md ${ACCENT[type]}transition-all duration-300 ease-out ${show ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}max-w-80 min-w-64`}
    >
      <div className="ml-2 h-10 w-10 shrink-0">
        <Canvas
          camera={{ position: [0, 0, 4.8], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 5]} intensity={0.7} />
          <AvatarModel reaction={REACTION[type]} hovered={false} exprIdx={-1} />
        </Canvas>
      </div>

      <div className="min-w-0 flex-1 py-2 pr-2">
        <div className="break-words text-readable leading-relaxed">{message}</div>
      </div>

      <button
        onClick={() => onDismiss(id)}
        className="self-start py-2 pr-3 text-ghost transition-colors hover:text-foreground"
      >
        x
      </button>

      {duration > 0 && (
        <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-progress-track">
          <div
            className={`h-full ${PROGRESS_COLOR[type]} rounded-full`}
            style={{
              animation: `notif-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}
