import { useState, useEffect, useCallback } from "react";
import { BACKGROUND_PRESETS } from "../constants";
import type { BackgroundConfig } from "../types";

const STORAGE_KEY = "wm-background";
const IMAGE_STORAGE_KEY = "wm-background-image";

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
        if (parsed.type === "custom-image") {
          const img = localStorage.getItem(IMAGE_STORAGE_KEY);
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
        localStorage.setItem(IMAGE_STORAGE_KEY, config.value);
        const meta = { ...config, value: undefined };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
      } else {
        localStorage.removeItem(IMAGE_STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      }
    } catch {}
  }, []);

  return { current, setBackground, pickerOpen, setPickerOpen };
}
