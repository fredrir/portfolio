import { useState, useEffect, useCallback } from "react";
import { BACKGROUND_PRESETS } from "../../constants";
import { KEYS, read, readJson, write, writeJson, remove } from "@/lib/storage";
import type { BackgroundConfig } from "../types";

export function useBackground() {
  const [current, setCurrent] = useState<BackgroundConfig>(
    BACKGROUND_PRESETS[0],
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const parsed = readJson<BackgroundConfig>(KEYS.background);
    if (parsed) {
      if (parsed.type === "custom-image") {
        const img = read(KEYS.backgroundImage);
        if (img) parsed.value = img;
      }
      setCurrent(parsed);
    }
  }, []);

  const setBackground = useCallback((config: BackgroundConfig) => {
    setCurrent(config);
    if (config.type === "custom-image" && config.value) {
      // A large data-URL can exceed the storage quota; only record it as the
      // persisted background if the image itself actually saved, otherwise a
      // reload would restore a custom-image config with no image.
      if (write(KEYS.backgroundImage, config.value)) {
        writeJson(KEYS.background, { ...config, value: undefined });
      } else {
        remove(KEYS.background);
      }
    } else {
      remove(KEYS.backgroundImage);
      writeJson(KEYS.background, config);
    }
  }, []);

  return { current, setBackground, pickerOpen, setPickerOpen };
}
