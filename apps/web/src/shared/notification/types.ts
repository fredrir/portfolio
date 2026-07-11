import type { ReactNode } from "react";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: ReactNode;
  duration: number;
  createdAt: number;
  dismissing: boolean;
}

export interface NotificationOptions {
  duration?: number;
}

export interface NotificationApi {
  success: (message: ReactNode, options?: NotificationOptions) => string;
  error: (message: ReactNode, options?: NotificationOptions) => string;
  info: (message: ReactNode, options?: NotificationOptions) => string;
  dismiss: (id: string) => void;
}
