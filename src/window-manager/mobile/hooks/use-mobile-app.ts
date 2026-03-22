import { useState, useCallback } from "react";
import { KEYS, read, write, remove } from "@/lib/storage";
import type { MobileState } from "../types";

export function useMobileApp(): MobileState {
  const [activeApp, _setActiveApp] = useState<string | null>(
    () => read(KEYS.mobileActiveApp, true),
  );

  const setActiveApp = useCallback((app: string | null) => {
    _setActiveApp(app);
    if (app) {
      write(KEYS.mobileActiveApp, app, true);
    } else {
      remove(KEYS.mobileActiveApp, true);
    }
  }, []);

  const goHome = useCallback(() => setActiveApp(null), [setActiveApp]);

  return { activeApp, setActiveApp, goHome };
}
