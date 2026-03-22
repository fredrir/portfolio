import { useState, useCallback } from "react";

export function useMobileApp() {
  const [activeApp, _setActiveApp] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("mobileActiveApp");
    }
    return null;
  });

  const setActiveApp = useCallback((app: string | null) => {
    _setActiveApp(app);
    if (app) {
      sessionStorage.setItem("mobileActiveApp", app);
    } else {
      sessionStorage.removeItem("mobileActiveApp");
    }
  }, []);

  const goHome = useCallback(() => setActiveApp(null), [setActiveApp]);

  return { activeApp, setActiveApp, goHome };
}
