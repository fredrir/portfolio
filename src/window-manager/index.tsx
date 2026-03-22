"use client";

import { useWindowManager } from "./hooks/use-window-manager";
import { useBackground } from "./hooks/use-background";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import { useTutorial } from "@/tutorial/use-tutorial";
import { useTutorialSync } from "./hooks/use-tutorial-sync";
import { useFloatingDetail } from "./hooks/use-floating-detail";
import { useMobileApp } from "./hooks/use-mobile-app";
import { useFocus } from "./hooks/use-focus";
import { WindowManagerView } from "./window-manager-view";
import { StatusBar } from "./components/status-bar";
import { Background } from "./components/background";
import { TipBar } from "./components/tip-bar";
import { MobileLayout } from "./components/mobile-layout";
import { MobileDock } from "./components/mobile-dock";
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
  const { ui } = dict;

  const isMobile = useIsMobile();
  const tutorial = useTutorial(currentLocale);
  const wm = useWindowManager(tutorial.isActive);
  const bg = useBackground();
  const mobile = useMobileApp();
  const floating = useFloatingDetail(dict);
  const focus = useFocus(wm);

  useTutorialSync(tutorial, wm);

  const view = new WindowManagerView({
    dict, locale: currentLocale, isMobile,
    tutorial, wm, bg, focus, floating,
    githubData, spotifyData,
  });

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
        {!view.tutorialIsFullscreen && (
          <div className="relative z-10 h-full">
            <MobileLayout
              paneContent={view.paneContent}
              mobile={mobile}
              ui={ui}
              locale={currentLocale}
            />
          </div>
        )}
        {!tutorial.isActive && <MobileDock mobile={mobile} ui={ui} />}
        {view.tutorialOverlay}
        {view.floatingDetail}
      </div>
    );
  }

  if (wm.maximizedId && wm.states[wm.maximizedId]?.isOpen) {
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
            config={configMap[wm.maximizedId]}
            state={wm.states[wm.maximizedId]}
            isFocused
            onClose={() => wm.closeWindow(wm.maximizedId!)}
            onMaximize={() => wm.toggleMaximize(wm.maximizedId!)}
            onFocus={() => {}}
            onTitleMouseDown={() => {}}
          >
            {view.paneContent[wm.maximizedId]}
          </Window>
        </div>
        <StatusBar
          states={wm.states}
          allConfigs={WINDOW_CONFIGS}
          locale={currentLocale}
          ui={ui}
          focusedWindowId={wm.maximizedId}
          onOpenLauncher={() => wm.setLauncherOpen(true)}
          onOpenSettings={focus.openSettings}
          onFocusWindow={focus.focus}
        />
        {view.appLauncher}
        {view.floatingDetail}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Background config={bg.current} />

      {!view.tutorialIsFullscreen && (
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
            focusedId={focus.focusedId}
            paneContent={view.paneContent}
            drag={wm.drag}
            resize={wm.resize}
            onClose={wm.closeWindow}
            onMaximize={wm.toggleMaximize}
            onFocus={focus.focus}
          />
        </div>
      )}

      {!tutorial.isActive && <TipBar ui={ui} />}

      {!view.tutorialIsFullscreen && (
        <StatusBar
          states={wm.states}
          allConfigs={WINDOW_CONFIGS}
          locale={currentLocale}
          ui={ui}
          focusedWindowId={focus.focusedId}
          onOpenLauncher={() => wm.setLauncherOpen(true)}
          onOpenSettings={focus.openSettings}
          onFocusWindow={focus.focus}
        />
      )}

      {view.appLauncher}
      {view.tutorialOverlay}
      {view.floatingDetail}
      {view.dragGhost}
    </div>
  );
}
