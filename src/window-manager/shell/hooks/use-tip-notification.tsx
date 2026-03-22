"use client";

import { useEffect, useRef } from "react";
import { useNotification } from "@/shared/notification";
import { KEYS, read, write } from "@/lib/storage";
import type { UiStrings } from "@/i18n/types";

export function useTipNotification(tutorialActive: boolean, ui: UiStrings) {
  const notification = useNotification();
  const notifRef = useRef(notification);
  notifRef.current = notification;
  const firedRef = useRef(false);

  useEffect(() => {
    if (tutorialActive || firedRef.current) return;
    if (read(KEYS.tipDismissed, true)) return;
    firedRef.current = true;

    const timer = setTimeout(() => {
      notifRef.current.info(
        <span>
          <span className="text-primary-medium font-bold">Ctrl+K</span>{" "}
          {ui.tipLauncher}
          <span className="text-primary-hint mx-2">|</span>
          {ui.tipDrag}
          <span className="text-primary-hint mx-2">|</span>
          {ui.tipResize}
        </span>,
        { duration: 8000 },
      );
      write(KEYS.tipDismissed, "1", true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [tutorialActive, ui]);
}
