import { useState, useCallback } from "react";
import { STORAGE_KEYS } from "../../constants";
import type { MobileState } from "../types";

export function useMobileApp(): MobileState {
  const [activeApp, _setActiveApp] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(STORAGE_KEYS.mobileActiveApp);
    }
    return null;
  });

  const setActiveApp = useCallback((app: string | null) => {
    _setActiveApp(app);
    if (app) {
      sessionStorage.setItem(STORAGE_KEYS.mobileActiveApp, app);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.mobileActiveApp);
    }
  }, []);

  const goHome = useCallback(() => setActiveApp(null), [setActiveApp]);

  return { activeApp, setActiveApp, goHome };
}
