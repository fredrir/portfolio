import { useState, useEffect, useCallback } from "react";
import { BACKGROUND_PRESETS, STORAGE_KEYS } from "../../constants";
import type { BackgroundConfig } from "../types";

export function useBackground() {
  const [current, setCurrent] = useState<BackgroundConfig>(
    BACKGROUND_PRESETS[0],
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.background);
      if (stored) {
        const parsed = JSON.parse(stored) as BackgroundConfig;
        if (parsed.type === "custom-image") {
          const img = localStorage.getItem(STORAGE_KEYS.backgroundImage);
          if (img) {
            parsed.value = img;
          }
        }
        setCurrent(parsed);
      }
    } catch {}
  }, []);

  const setBackground = useCallback((config: BackgroundConfig) => {
    setCurrent(config);
    try {
      if (config.type === "custom-image" && config.value) {
        localStorage.setItem(STORAGE_KEYS.backgroundImage, config.value);
        const meta = { ...config, value: undefined };
        localStorage.setItem(STORAGE_KEYS.background, JSON.stringify(meta));
      } else {
        localStorage.removeItem(STORAGE_KEYS.backgroundImage);
        localStorage.setItem(STORAGE_KEYS.background, JSON.stringify(config));
      }
    } catch {}
  }, []);

  return { current, setBackground, pickerOpen, setPickerOpen };
}
