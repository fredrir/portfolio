import { useEffect } from "react";
import type { useWindowManager } from "./use-window-manager";
import type { useTutorial } from "@/tutorial/use-tutorial";

export function useTutorialSync(
  tutorial: ReturnType<typeof useTutorial>,
  wm: ReturnType<typeof useWindowManager>,
) {
  const openPanesKey = tutorial.choices.openPanes.join(",");

  useEffect(() => {
    if (!tutorial.isActive || !tutorial.step) return;
    if (tutorial.step.id === "pane-selection") {
      wm.setOpenPanes(tutorial.choices.openPanes);
    }
  }, [tutorial.isActive, tutorial.step?.id, openPanesKey]);

  useEffect(() => {
    if (!tutorial.isActive || !tutorial.step) return;
    if (tutorial.step.id === "drag") {
      wm.onSwapRef.current = tutorial.next;
      return () => {
        wm.onSwapRef.current = null;
      };
    }
    if (tutorial.step.id === "resize") {
      wm.onResizeRef.current = tutorial.next;
      return () => {
        wm.onResizeRef.current = null;
      };
    }
  }, [tutorial.isActive, tutorial.step, tutorial.next, wm]);
}
