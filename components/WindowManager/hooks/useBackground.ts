import { useState, useEffect, useCallback } from "react";
import { BACKGROUND_PRESETS } from "../constants";
import type { BackgroundConfig } from "../types";

const STORAGE_KEY = "wm-background";

export function useBackground() {
  const [current, setCurrent] = useState<BackgroundConfig>(
    BACKGROUND_PRESETS[0],
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BackgroundConfig;
        setCurrent(parsed);
      }
    } catch {}
  }, []);

  const setBackground = useCallback((config: BackgroundConfig) => {
    setCurrent(config);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, []);

  return { current, setBackground, pickerOpen, setPickerOpen };
}
