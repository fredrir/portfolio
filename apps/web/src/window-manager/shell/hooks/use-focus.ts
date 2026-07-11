import { useCallback, useEffect, useState } from "react";
import type { useTiling } from "../../tiling/hooks/use-tiling";

export function useFocus(wm: ReturnType<typeof useTiling>) {
  const [focusedId, setFocusedId] = useState<string | null>("about");

  const focus = useCallback(
    (id: string) => {
      if (!wm.states[id]) return;
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
      if (!wm.states[id]) return;
      wm.openWindow(id);
      setFocusedId(id);
      wm.focusWindow(id);
    },
    [wm],
  );

  const openSettings = useCallback(() => {
    openPane("settings");
  }, [openPane]);

  useEffect(() => {
    if (focusedId && wm.states[focusedId]?.isOpen) return;

    const nextFocused =
      Object.entries(wm.states)
        .filter(([, state]) => state.isOpen)
        .sort(([, a], [, b]) => b.zIndex - a.zIndex)[0]?.[0] ?? null;

    if (focusedId !== nextFocused) {
      setFocusedId(nextFocused);
    }
  }, [focusedId, wm.states]);

  return { focusedId, focus, openPane, openSettings };
}
