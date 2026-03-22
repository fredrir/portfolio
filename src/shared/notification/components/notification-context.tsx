"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  type ReactNode,
} from "react";
import type {
  Notification,
  NotificationApi,
  NotificationOptions,
  NotificationType,
} from "../types";
import { NotificationContainer } from "./notification-container";

const DISMISS_MS = 300;
const DEFAULT_DURATION: Record<NotificationType, number> = {
  success: 4000,
  error: 6000,
  info: 8000,
};

const NotificationContext = createContext<NotificationApi | null>(null);

export function useNotification(): NotificationApi {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be inside NotificationProvider");
  return ctx;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, dismissing: true } : n)),
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, DISMISS_MS);
  }, []);

  const push = useCallback(
    (type: NotificationType, message: ReactNode, options?: NotificationOptions) => {
      const id = `notif-${++counterRef.current}`;
      const duration = options?.duration ?? DEFAULT_DURATION[type];
      const notification: Notification = {
        id,
        type,
        message,
        duration,
        createdAt: Date.now(),
        dismissing: false,
      };
      setNotifications((prev) => [...prev, notification]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const api: NotificationApi = {
    success: (msg, opts) => push("success", msg, opts),
    error: (msg, opts) => push("error", msg, opts),
    info: (msg, opts) => push("info", msg, opts),
    dismiss,
  };

  return (
    <NotificationContext.Provider value={api}>
      {children}
      <NotificationContainer notifications={notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}
