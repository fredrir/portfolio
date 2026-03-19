"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TutorialFredVatar } from "./components/tutorial-fredvatar";
import { SpeechBubble } from "./components/speech-bubble";
import { ProgressDots } from "./components/progress-dots";
import { StepWelcome } from "./components/step-welcome";
import { StepTheme } from "./components/step-theme";
import { StepWallpaper } from "./components/step-wallpaper";
import { StepPaneSelection } from "./components/step-pane-selection";
import { StepLauncher } from "./components/step-launcher";
import { StepDrag } from "./components/step-drag";
import { StepResize } from "./components/step-resize";
import { StepDone } from "./components/step-done";
import type { TutorialStrings, UiStrings } from "@/shared/types";
import type { BackgroundConfig } from "@/window-manager/types";
import type { TutorialChoices } from "./types";

interface Props {
  t: TutorialStrings;
  ui: UiStrings;
  currentLocale: string;
  stepId: string;
  stepIndex: number;
  totalSteps: number;
  choices: TutorialChoices;
  floating: boolean;
  isMobile: boolean;
  launcherOpen: boolean;
  currentBackground: BackgroundConfig;
  onSelectBackground: (config: BackgroundConfig) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
  onSetChoice: <K extends keyof TutorialChoices>(
    key: K,
    value: TutorialChoices[K],
  ) => void;
  onSaveStateForNav: (nextStep: number) => void;
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
  stepId,
  stepIndex,
  totalSteps,
  choices,
  floating,
  isMobile,
  launcherOpen,
  currentBackground,
  onSelectBackground,
  onNext,
  onBack,
  onSkip,
  onComplete,
  onSetChoice,
  onSaveStateForNav,
}: Props) {
  const prevLauncherRef = useRef(launcherOpen);

  useEffect(() => {
    if (stepId === "launcher" && !prevLauncherRef.current && launcherOpen) {
      const timer = setTimeout(onNext, 600);
      return () => clearTimeout(timer);
    }
    prevLauncherRef.current = launcherOpen;
  }, [stepId, launcherOpen, onNext]);

  useEffect(() => {
    if (
      (stepId === "drag" || stepId === "resize") &&
      choices.openPanes.length < 2
    ) {
      onNext();
    }
  }, [stepId, choices.openPanes.length, onNext]);

  const showNav = !interactiveSteps.has(stepId);
  const canAdvance =
    stepId !== "pane-selection" || choices.openPanes.length > 0;

  const handleTogglePane = (id: string) => {
    const current = choices.openPanes;
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    onSetChoice("openPanes", next);
  };

  const renderStep = () => {
    switch (stepId) {
      case "welcome":
        return (
          <StepWelcome
            t={t}
            currentLocale={currentLocale}
            onSelectLocale={(loc) => onSetChoice("locale", loc)}
            onSaveState={onSaveStateForNav}
          />
        );
      case "theme":
        return (
          <StepTheme t={t} onSelectTheme={(id) => onSetChoice("theme", id)} />
        );
      case "wallpaper":
        return (
          <StepWallpaper
            t={t}
            ui={ui}
            currentBackground={currentBackground}
            onSelectBackground={onSelectBackground}
            onSelectWallpaper={(id) => onSetChoice("wallpaper", id)}
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
        return <StepDone t={t} onComplete={onComplete} />;
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
        className={`fixed ${posClass} z-9995 flex items-end gap-3 max-w-md`}
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
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-faint">
                <ProgressDots current={stepIndex} total={totalSteps} />
                <div className="flex gap-2">
                  {stepIndex > 0 && (
                    <button
                      onClick={onBack}
                      className="px-3 py-1 text-xs rounded-md border border-control-border text-muted-foreground hover:bg-control-hover transition-colors"
                    >
                      {t.back}
                    </button>
                  )}
                  <button
                    onClick={onNext}
                    disabled={!canAdvance}
                    className="px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t.next}
                  </button>
                </div>
              </div>
            )}
            {!showNav && stepId !== "done" && (
              <div className="flex p-4 md:p-6 items-center justify-between mt-3 pt-3 border-t border-border-faint">
                <ProgressDots current={stepIndex} total={totalSteps} />
                <div />
              </div>
            )}
          </SpeechBubble>
        </div>

        <TutorialFredVatar reaction={getReaction(stepId)} />
        <button
          onClick={onSkip}
          className="absolute -top-8 right-0 text-xs text-faded hover:text-foreground transition-colors"
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
          <TutorialFredVatar
            reaction="thumbsup"
            className="w-48 h-64 md:w-64 md:h-80"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            {t.doneTitle}
          </h2>
          <button
            onClick={onComplete}
            className="px-8 py-3 rounded-xl border border-primary-soft text-primary font-semibold text-base hover:text-primary hover:border-primary"
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
        <div className="absolute bottom-0 right-4 z-0">
          <TutorialFredVatar reaction={getReaction(stepId)} />
        </div>
      )}
      <div className="relative z-10 flex items-end gap-4 max-w-lg w-full mx-4 mb-28 md:mb-0">
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
              <div className="flex p-4 md:p-6 items-center justify-between mt-4 pt-3 border-t border-border-faint">
                <ProgressDots current={stepIndex} total={totalSteps} />
                <div className="flex gap-2">
                  {stepIndex > 0 && (
                    <button
                      onClick={onBack}
                      className="px-3 py-1.5 text-xs rounded-md border border-control-border text-muted-foreground hover:bg-control-hover transition-colors"
                    >
                      {t.back}
                    </button>
                  )}
                  <button
                    onClick={onNext}
                    disabled={!canAdvance}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
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
        onClick={onSkip}
        className="absolute top-4 right-4 text-sm text-faded hover:text-foreground transition-colors z-20"
      >
        {t.skip}
      </button>
    </div>
  );
}
