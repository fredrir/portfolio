"use client";

import { useEffect, useRef } from "react";
import { useNotification } from "@/shared/notification";
import { STORAGE_KEYS } from "../../constants";
import type { UiStrings } from "@/i18n/types";

export function useTipNotification(tutorialActive: boolean, ui: UiStrings) {
  const notification = useNotification();
  const firedRef = useRef(false);

  useEffect(() => {
    if (tutorialActive || firedRef.current) return;
    if (sessionStorage.getItem(STORAGE_KEYS.tipDismissed)) return;
    firedRef.current = true;

    notification.info(
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

    sessionStorage.setItem(STORAGE_KEYS.tipDismissed, "1");
  }, [tutorialActive, notification, ui]);
}
