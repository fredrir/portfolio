"use client";

import { useState, useCallback } from "react";
import { useWindowManager } from "./hooks/use-window-manager";
import { useBackground } from "./hooks/use-background";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import { useTutorial } from "@/tutorial/use-tutorial";
import { useTutorialSync } from "./hooks/use-tutorial-sync";
import { useFloatingDetail } from "./hooks/use-floating-detail";
import { useMobileApp } from "./hooks/use-mobile-app";
import { usePaneContent } from "./hooks/use-pane-content";
import { TutorialOverlay } from "@/tutorial";
import { StatusBar } from "./components/status-bar";
import { AppLauncher } from "./components/app-launcher";
import { Background } from "./components/background";
import { TipBar } from "./components/tip-bar";
import { FloatingDetail } from "./components/floating-detail";
import { MobileLayout } from "./components/mobile-layout";
import { MobileDock } from "./components/mobile-dock";
import { DragGhost } from "./components/drag-ghost";
import { TilingGrid } from "./components/tiling-grid";
import { Window } from "./components/window";
import { WINDOW_CONFIGS, GAP, STATUS_BAR_HEIGHT, configMap } from "./constants";
import type { GitHubData, SpotifyData } from "@/shared/types";
import type { DictType, Locale } from "@/i18n/types";

interface Props {
  currentLocale: Locale;
  dict: DictType;
  githubData: GitHubData | null;
  spotifyData: SpotifyData;
}

export function WindowManager({
  currentLocale,
  dict,
  githubData,
  spotifyData,
}: Props) {
  const { ui, tutorial: dictTutorial } = dict;

  const isMobile = useIsMobile();
  const tutorial = useTutorial(currentLocale);
  const wm = useWindowManager(tutorial.isActive);
  const bg = useBackground();
  const mobile = useMobileApp();
  const floating = useFloatingDetail(dict);
  const [focusedId, setFocusedId] = useState<string | null>("about");

  useTutorialSync(tutorial, wm);

  const handleFocus = useCallback(
    (id: string) => {
      if (!wm.states[id]?.isOpen) {
        wm.openWindow(id);
      }
      setFocusedId(id);
      wm.focusWindow(id);
    },
    [wm],
  );

  const handleOpenPane = useCallback(
    (id: string) => {
      wm.openWindow(id);
      setFocusedId(id);
    },
    [wm],
  );

  const handleOpenSettings = useCallback(() => {
    handleOpenPane("settings");
  }, [handleOpenPane]);

  const paneContent = usePaneContent({
    dict,
    locale: currentLocale,
    githubData,
    spotifyData,
    currentBackground: bg.current,
    onSelectBackground: bg.setBackground,
    onOpenPane: handleOpenPane,
    onClosePane: wm.closeWindow,
    onOpenJourneyDetail: floating.openJourneyDetail,
    onOpenProjectDetail: floating.openProjectDetail,
  });

  const postPaneSteps = new Set(["launcher", "drag", "resize"]);
  const tutorialIsFloating =
    tutorial.isActive &&
    tutorial.step != null &&
    postPaneSteps.has(tutorial.step.id);
  const tutorialIsFullscreen = tutorial.isActive && !tutorialIsFloating;

  const tutorialOverlay = tutorial.isActive && tutorial.step && (
    <TutorialOverlay
      t={dictTutorial}
      ui={ui}
      currentLocale={currentLocale}
      stepId={tutorial.step.id}
      stepIndex={tutorial.stepIndex}
      totalSteps={tutorial.totalSteps}
      choices={tutorial.choices}
      floating={tutorialIsFloating}
      isMobile={isMobile === true}
      launcherOpen={wm.launcherOpen}
      currentBackground={bg.current}
      onSelectBackground={bg.setBackground}
      onNext={tutorial.next}
      onBack={tutorial.back}
      onSkip={tutorial.skip}
      onComplete={tutorial.complete}
      onSetChoice={tutorial.setChoice}
      onSaveStateForNav={tutorial.saveStateForNavigation}
    />
  );

  const floatingDetailOverlay = floating.detail && (
    <FloatingDetail title={floating.detail.title} onClose={floating.close}>
      {floating.detail.content}
    </FloatingDetail>
  );

  const appLauncher = wm.launcherOpen && (
    <AppLauncher
      states={wm.states}
      ui={ui}
      locale={currentLocale}
      onOpen={handleOpenPane}
      onStop={wm.closeWindow}
      onClose={() => wm.setLauncherOpen(false)}
    />
  );

  const dragGhost = wm.drag.dragTarget &&
    wm.drag.dragPos &&
    wm.drag.dragSize &&
    configMap[wm.drag.dragTarget] && (
      <DragGhost
        config={configMap[wm.drag.dragTarget]}
        pos={wm.drag.dragPos}
        size={wm.drag.dragSize}
      >
        {paneContent[wm.drag.dragTarget]}
      </DragGhost>
    );

  if (isMobile === null) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <Background config={bg.current} />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <Background config={bg.current} />
        {!tutorialIsFullscreen && (
          <div className="relative z-10 h-full">
            <MobileLayout
              paneContent={paneContent}
              activeApp={mobile.activeApp}
              onOpenApp={mobile.setActiveApp}
              onGoHome={mobile.goHome}
              ui={ui}
              locale={currentLocale}
            />
          </div>
        )}
        {!tutorial.isActive && (
          <MobileDock
            activeApp={mobile.activeApp}
            onOpenApp={mobile.setActiveApp}
            onGoHome={mobile.goHome}
            ui={ui}
          />
        )}
        {tutorialOverlay}
        {floatingDetailOverlay}
      </div>
    );
  }

  if (wm.maximizedId && wm.states[wm.maximizedId]?.isOpen) {
    const config = configMap[wm.maximizedId];
    return (
      <div className="fixed inset-0 overflow-hidden">
        <Background config={bg.current} />
        <div
          className="relative flex flex-col w-full"
          style={{
            height: `calc(100vh - ${STATUS_BAR_HEIGHT}px)`,
            padding: GAP,
          }}
        >
          <Window
            config={config}
            state={wm.states[wm.maximizedId]}
            isFocused
            onClose={() => wm.closeWindow(wm.maximizedId!)}
            onMaximize={() => wm.toggleMaximize(wm.maximizedId!)}
            onFocus={() => {}}
            onTitleMouseDown={() => {}}
          >
            {paneContent[wm.maximizedId]}
          </Window>
        </div>
        <StatusBar
          states={wm.states}
          allConfigs={WINDOW_CONFIGS}
          locale={currentLocale}
          ui={ui}
          focusedWindowId={wm.maximizedId}
          onOpenLauncher={() => wm.setLauncherOpen(true)}
          onOpenSettings={handleOpenSettings}
          onFocusWindow={handleFocus}
        />
        {appLauncher}
        {floatingDetailOverlay}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Background config={bg.current} />

      {!tutorialIsFullscreen && (
        <div
          className="relative flex flex-col w-full"
          style={{
            height: `calc(100vh - ${STATUS_BAR_HEIGHT}px)`,
            padding: GAP,
            gap: 0,
          }}
        >
          <TilingGrid
            visibleLayout={wm.visibleLayout}
            rowHeights={wm.rowHeights}
            colWidths={wm.colWidths}
            states={wm.states}
            focusedId={focusedId}
            paneContent={paneContent}
            swapTarget={wm.drag.swapTarget}
            dragTarget={wm.drag.dragTarget}
            onTitleMouseDown={wm.drag.startTitleDrag}
            onCornerResize={wm.resize.startCornerResize}
            onColResize={wm.resize.startColResize}
            onRowResize={wm.resize.startRowResize}
            onClose={wm.closeWindow}
            onMaximize={wm.toggleMaximize}
            onFocus={handleFocus}
          />
        </div>
      )}

      {!tutorial.isActive && <TipBar ui={ui} />}

      {!tutorialIsFullscreen && (
        <StatusBar
          states={wm.states}
          allConfigs={WINDOW_CONFIGS}
          locale={currentLocale}
          ui={ui}
          focusedWindowId={focusedId}
          onOpenLauncher={() => wm.setLauncherOpen(true)}
          onOpenSettings={handleOpenSettings}
          onFocusWindow={handleFocus}
        />
      )}

      {appLauncher}
      {tutorialOverlay}
      {floatingDetailOverlay}
      {dragGhost}
    </div>
  );
}
