"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { TUTORIAL_STEPS, LS_TUTORIAL_COMPLETED, LS_OPEN_PANES, SS_TUTORIAL_STATE } from "./constants";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import type { TutorialStep, TutorialChoices } from "./types";

interface SavedState {
  stepIndex: number;
  choices: TutorialChoices;
}

function peekSavedState(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SS_TUTORIAL_STATE);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function shouldShowTutorial(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem(LS_TUTORIAL_COMPLETED);
}

function getDefaultChoices(locale: string): TutorialChoices {
  return {
    locale,
    theme: "fredrir",
    wallpaper: "starfield",
    openPanes: [],
  };
}

export function useTutorial(locale: string) {
  const isMobile = useIsMobile() === true;
  const [isActive, setIsActive] = useState(() => {
    const saved = peekSavedState();
    if (saved) return true;
    return shouldShowTutorial();
  });

  const [stepIndex, setStepIndex] = useState(() => {
    return peekSavedState()?.stepIndex ?? 0;
  });

  const [choices, setChoices] = useState<TutorialChoices>(() => {
    return peekSavedState()?.choices ?? getDefaultChoices(locale);
  });

  useEffect(() => {
    sessionStorage.removeItem(SS_TUTORIAL_STATE);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setIsActive(true);
        setStepIndex(0);
        setChoices(getDefaultChoices(locale));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [locale]);

  const steps = useMemo(
    () => (isMobile ? TUTORIAL_STEPS.filter((s) => !s.desktopOnly) : TUTORIAL_STEPS),
    [isMobile],
  );

  const step: TutorialStep | undefined = steps[stepIndex];

  const setChoice = useCallback(
    <K extends keyof TutorialChoices>(key: K, value: TutorialChoices[K]) => {
      setChoices((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const back = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const complete = useCallback(() => {
    setIsActive(false);
    try {
      localStorage.setItem(LS_TUTORIAL_COMPLETED, "1");
      localStorage.setItem(LS_OPEN_PANES, JSON.stringify(choices.openPanes));
    } catch {}
  }, [choices.openPanes]);

  const skip = useCallback(() => {
    setIsActive(false);
    try {
      localStorage.setItem(LS_TUTORIAL_COMPLETED, "1");
    } catch {}
  }, []);

  const restart = useCallback(() => {
    try {
      localStorage.removeItem(LS_TUTORIAL_COMPLETED);
      localStorage.removeItem(LS_OPEN_PANES);
    } catch {}
    window.location.reload();
  }, []);

  const saveStateForNavigation = useCallback(
    (nextStepIndex: number) => {
      try {
        sessionStorage.setItem(
          SS_TUTORIAL_STATE,
          JSON.stringify({ stepIndex: nextStepIndex, choices }),
        );
      } catch {}
    },
    [choices],
  );

  return {
    isActive,
    step,
    stepIndex,
    totalSteps: steps.length,
    choices,
    next,
    back,
    skip,
    complete,
    restart,
    setChoice,
    saveStateForNavigation,
  };
}
