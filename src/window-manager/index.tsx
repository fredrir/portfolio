"use client";

import { useWindowManager } from "./hooks/use-window-manager";
import { useBackground } from "./hooks/use-background";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import { useTutorial } from "@/tutorial/use-tutorial";
import { useTutorialSync } from "./hooks/use-tutorial-sync";
import { useFloatingDetail } from "./hooks/use-floating-detail";
import { useMobileApp } from "./hooks/use-mobile-app";
import { usePaneContent } from "./hooks/use-pane-content";
import { useFocus } from "./hooks/use-focus";
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
  const { focusedId, focus, openPane, openSettings } = useFocus(wm);

  useTutorialSync(tutorial, wm);

  const paneContent = usePaneContent({
    dict,
    locale: currentLocale,
    githubData,
    spotifyData,
    currentBackground: bg.current,
    onSelectBackground: bg.setBackground,
    onOpenPane: openPane,
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
      tutorial={tutorial}
      floating={tutorialIsFloating}
      isMobile={isMobile === true}
      launcherOpen={wm.launcherOpen}
      background={bg}
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
      onOpen={openPane}
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
              mobile={mobile}
              ui={ui}
              locale={currentLocale}
            />
          </div>
        )}
        {!tutorial.isActive && (
          <MobileDock mobile={mobile} ui={ui} />
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
          onOpenSettings={openSettings}
          onFocusWindow={focus}
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
            drag={wm.drag}
            resize={wm.resize}
            onClose={wm.closeWindow}
            onMaximize={wm.toggleMaximize}
            onFocus={focus}
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
          onOpenSettings={openSettings}
          onFocusWindow={focus}
        />
      )}

      {appLauncher}
      {tutorialOverlay}
      {floatingDetailOverlay}
      {dragGhost}
    </div>
  );
}
