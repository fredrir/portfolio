import { useState, useCallback } from "react";
import type { useTiling } from "../../tiling/hooks/use-tiling";

export function useFocus(wm: ReturnType<typeof useTiling>) {
  const [focusedId, setFocusedId] = useState<string | null>("about");

  const focus = useCallback(
    (id: string) => {
      if (!wm.states[id]?.isOpen) {
        wm.openWindow(id);
      }
      setFocusedId(id);
      wm.focusWindow(id);
    },
    [wm],
  );

  const openPane = useCallback(
    (id: string) => {
      wm.openWindow(id);
      setFocusedId(id);
    },
    [wm],
  );

  const openSettings = useCallback(() => {
    openPane("settings");
  }, [openPane]);

  return { focusedId, focus, openPane, openSettings };
}
