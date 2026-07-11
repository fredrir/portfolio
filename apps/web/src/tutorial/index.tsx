"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { TutorialStrings, UiStrings } from "@/i18n/types";
import type { BackgroundConfig } from "@/window-manager/types";
import { ProgressDots } from "./components/progress-dots";
import { SpeechBubble } from "./components/speech-bubble";
import { StepDone } from "./components/step-done";
import { StepDrag } from "./components/step-drag";
import { StepLauncher } from "./components/step-launcher";
import { StepPaneSelection } from "./components/step-pane-selection";
import { StepResize } from "./components/step-resize";
import { StepTheme } from "./components/step-theme";
import { StepWallpaper } from "./components/step-wallpaper";
import { StepWelcome } from "./components/step-welcome";
import { TutorialFredVatar } from "./components/tutorial-fredvatar";
import type { useTutorial } from "./use-tutorial";

interface Props {
  t: TutorialStrings;
  ui: UiStrings;
  currentLocale: string;
  tutorial: ReturnType<typeof useTutorial>;
  floating: boolean;
  isMobile: boolean;
  launcherOpen: boolean;
  background: {
    current: BackgroundConfig;
    setBackground: (config: BackgroundConfig) => void;
  };
}

const interactiveSteps = new Set(["launcher", "drag", "resize", "done"]);

function getReaction(stepId: string): string {
  switch (stepId) {
    case "welcome":
      return "wave";
    case "done":
      return "thumbsup";
    default:
      return "idle";
  }
}

export function TutorialOverlay({
  t,
  ui,
  currentLocale,
  tutorial,
  floating,
  isMobile,
  launcherOpen,
  background,
}: Props) {
  const stepId = tutorial.step!.id;
  const { stepIndex, totalSteps, choices } = tutorial;

  const prevLauncherRef = useRef(launcherOpen);

  useEffect(() => {
    if (stepId === "launcher" && !prevLauncherRef.current && launcherOpen) {
      const timer = setTimeout(tutorial.next, 600);
      return () => clearTimeout(timer);
    }
    prevLauncherRef.current = launcherOpen;
  }, [stepId, launcherOpen, tutorial.next]);

  useEffect(() => {
    if ((stepId === "drag" || stepId === "resize") && choices.openPanes.length < 2) {
      tutorial.next();
    }
  }, [stepId, choices.openPanes.length, tutorial.next]);

  const showNav = !interactiveSteps.has(stepId);
  const canAdvance = stepId !== "pane-selection" || choices.openPanes.length > 0;

  const handleTogglePane = (id: string) => {
    const current = choices.openPanes;
    const next = current.includes(id) ? current.filter((p) => p !== id) : [...current, id];
    tutorial.setChoice("openPanes", next);
  };

  const renderStep = () => {
    switch (stepId) {
      case "welcome":
        return (
          <StepWelcome
            t={t}
            currentLocale={currentLocale}
            onSelectLocale={(loc) => tutorial.setChoice("locale", loc)}
            onSaveState={tutorial.saveStateForNavigation}
          />
        );
      case "theme":
        return <StepTheme t={t} onSelectTheme={(id) => tutorial.setChoice("theme", id)} />;
      case "wallpaper":
        return (
          <StepWallpaper
            t={t}
            ui={ui}
            currentBackground={background.current}
            onSelectBackground={background.setBackground}
            onSelectWallpaper={(id) => tutorial.setChoice("wallpaper", id)}
          />
        );
      case "pane-selection":
        return (
          <StepPaneSelection
            t={t}
            ui={ui}
            selectedPanes={choices.openPanes}
            onTogglePane={handleTogglePane}
          />
        );
      case "launcher":
        return <StepLauncher t={t} />;
      case "drag":
        return <StepDrag t={t} />;
      case "resize":
        return <StepResize t={t} />;
      case "done":
        return <StepDone t={t} onComplete={tutorial.complete} />;
      default:
        return null;
    }
  };

  const floatingPositions = [
    "top-8 right-4",
    "bottom-12 left-4",
    "top-8 left-4",
    "bottom-12 right-4",
  ];
  const posClass = floatingPositions[stepIndex % floatingPositions.length];

  if (floating) {
    return (
      <motion.div
        key={stepIndex}
        className={`fixed ${posClass} z-9995 flex max-w-md items-end gap-3`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="flex-1">
          <SpeechBubble isFloating>
            <AnimatePresence mode="wait">
              <motion.div
                key={stepId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
            {showNav && (
              <div className="mt-3 flex items-center justify-between border-border-faint border-t pt-3">
                <ProgressDots current={stepIndex} total={totalSteps} />
                <div className="flex gap-2">
                  {stepIndex > 0 && (
                    <button
                      onClick={tutorial.back}
                      className="rounded-md border border-control-border px-3 py-1 text-muted-foreground text-xs transition-colors hover:bg-control-hover"
                    >
                      {t.back}
                    </button>
                  )}
                  <button
                    onClick={tutorial.next}
                    disabled={!canAdvance}
                    className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-xs transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t.next}
                  </button>
                </div>
              </div>
            )}
            {!showNav && stepId !== "done" && (
              <div className="mt-3 flex items-center justify-between border-border-faint border-t p-4 pt-3 md:p-6">
                <ProgressDots current={stepIndex} total={totalSteps} />
                <div />
              </div>
            )}
          </SpeechBubble>
        </div>

        <TutorialFredVatar reaction={getReaction(stepId)} />
        <button
          onClick={tutorial.skip}
          className="absolute -top-8 right-0 text-faded text-xs transition-colors hover:text-foreground"
        >
          {t.skip}
        </button>
      </motion.div>
    );
  }

  if (stepId === "done") {
    return (
      <div className="fixed inset-0 z-9995 flex items-center justify-center">
        <div className="absolute inset-0 bg-overlay-medium" />
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TutorialFredVatar reaction="thumbsup" className="h-64 w-48 md:h-80 md:w-64" />
          <h2 className="font-bold text-2xl text-primary md:text-3xl">{t.doneTitle}</h2>
          <button
            onClick={tutorial.complete}
            className="rounded-xl border border-primary-soft px-8 py-3 font-semibold text-base text-primary hover:border-primary hover:text-primary"
          >
            {t.startExploring}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9995 flex items-center justify-center">
      <div className="absolute inset-0 bg-overlay-medium" />
      {isMobile && (
        <div className="absolute right-4 bottom-0 z-0">
          <TutorialFredVatar reaction={getReaction(stepId)} />
        </div>
      )}
      <div className="relative z-10 mx-4 mb-28 flex w-full max-w-lg items-end gap-4 md:mb-0">
        <div className="flex-1">
          <SpeechBubble>
            <AnimatePresence mode="wait">
              <motion.div
                key={stepId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
            {showNav && (
              <div className="mt-4 flex items-center justify-between border-border-faint border-t p-4 pt-3 md:p-6">
                <ProgressDots current={stepIndex} total={totalSteps} />
                <div className="flex gap-2">
                  {stepIndex > 0 && (
                    <button
                      onClick={tutorial.back}
                      className="rounded-md border border-control-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-control-hover"
                    >
                      {t.back}
                    </button>
                  )}
                  <button
                    onClick={tutorial.next}
                    disabled={!canAdvance}
                    className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground text-xs transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t.next}
                  </button>
                </div>
              </div>
            )}
          </SpeechBubble>
        </div>
        {!isMobile && <TutorialFredVatar reaction={getReaction(stepId)} />}
      </div>
      <button
        onClick={tutorial.skip}
        className="absolute top-4 right-4 z-20 text-faded text-sm transition-colors hover:text-foreground"
      >
        {t.skip}
      </button>
    </div>
  );
}
