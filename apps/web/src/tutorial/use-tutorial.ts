"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KEYS, read, readJson, remove, write, writeJson } from "@/lib/storage";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import { TUTORIAL_STEPS } from "./constants";
import type { TutorialChoices, TutorialStep } from "./types";

interface SavedState {
  stepIndex: number;
  choices: TutorialChoices;
}

function peekSavedState(): SavedState | null {
  return readJson<SavedState>(KEYS.tutorialState, true);
}

function shouldShowTutorial(): boolean {
  return !read(KEYS.tutorialCompleted);
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
    remove(KEYS.tutorialState, true);
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
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
    write(KEYS.tutorialCompleted, "1");
    writeJson(KEYS.openPanes, choices.openPanes);
  }, [choices.openPanes]);

  const skip = useCallback(() => {
    setIsActive(false);
    write(KEYS.tutorialCompleted, "1");
  }, []);

  const restart = useCallback(() => {
    remove(KEYS.tutorialCompleted);
    remove(KEYS.openPanes);
    window.location.reload();
  }, []);

  const saveStateForNavigation = useCallback(
    (nextStepIndex: number) => {
      writeJson(KEYS.tutorialState, { stepIndex: nextStepIndex, choices }, true);
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
