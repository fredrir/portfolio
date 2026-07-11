"use client";

import type { Notification } from "../types";
import { NotificationItem } from "./notification-item";

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationContainer({ notifications, onDismiss }: Props) {
  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-3 right-3 z-[9999] flex flex-col gap-2">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
