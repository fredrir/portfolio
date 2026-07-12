"use client";

import type { DictType, Locale } from "@/i18n/types";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import type { GitHubData, SpotifyData, WeatherData } from "@/shared/types";
import { useTutorial } from "@/tutorial/use-tutorial";
import { useBackground } from "./background/hooks/use-background";
import { MobileDock, MobileLayout } from "./mobile";
import { useMobileApp } from "./mobile/hooks/use-mobile-app";
import { useFloatingDetail } from "./overlays/hooks/use-floating-detail";
import { useTutorialSync } from "./overlays/hooks/use-tutorial-sync";
import { ContentArea, Shell, Window } from "./shell";
import { useFocus } from "./shell/hooks/use-focus";
import { useTipNotification } from "./shell/hooks/use-tip-notification";
import { TilingGrid, TilingProvider, useTiling } from "./tiling";
import { useWindowManagerView } from "./window-manager-view";

interface Props {
  currentLocale: Locale;
  dict: DictType;
  githubData: GitHubData | null;
  spotifyData: SpotifyData | null;
  weatherData: WeatherData | null;
}

export function WindowManager({
  currentLocale,
  dict,
  githubData,
  spotifyData,
  weatherData,
}: Props) {
  const { ui } = dict;

  const isMobile = useIsMobile();
  const tutorial = useTutorial(currentLocale);
  const wm = useTiling(tutorial.isActive);
  const bg = useBackground();
  const mobile = useMobileApp();
  const floating = useFloatingDetail(dict);
  const focus = useFocus(wm);

  useTutorialSync(tutorial, wm);
  useTipNotification(tutorial.isActive, ui, isMobile);

  const view = useWindowManagerView({
    dict,
    locale: currentLocale,
    isMobile,
    tutorial,
    wm,
    bg,
    focus,
    floating,
    githubData,
    spotifyData,
    weatherData,
  });

  switch (view.layoutMode) {
    case "loading":
      return <Shell background={bg.current} />;

    case "mobile":
      return (
        <Shell background={bg.current}>
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
        </Shell>
      );

    case "maximized":
      return (
        <Shell background={bg.current}>
          <ContentArea>
            <Window
              config={view.maximizedConfig}
              isFocused
              onClose={() => wm.closeWindow(wm.maximizedId!)}
              onMaximize={() => wm.toggleMaximize(wm.maximizedId!)}
            >
              {view.paneContent[wm.maximizedId!]}
            </Window>
          </ContentArea>
          {view.statusBar}
          {view.appLauncher}
          {view.floatingDetail}
        </Shell>
      );

    case "desktop":
      return (
        <Shell background={bg.current}>
          {!view.tutorialIsFullscreen && (
            <ContentArea>
              {view.hasOpenPanes ? (
                <TilingProvider
                  value={{
                    states: wm.states,
                    focusedId: focus.focusedId,
                    paneContent: view.paneContent,
                    drag: wm.drag,
                    resize: wm.resize,
                    onClose: wm.closeWindow,
                    onMaximize: wm.toggleMaximize,
                    onFocus: focus.focus,
                  }}
                >
                  <TilingGrid
                    visibleLayout={wm.visibleLayout}
                    rowHeights={wm.rowHeights}
                    colWidths={wm.colWidths}
                  />
                </TilingProvider>
              ) : (
                view.desktopPaneLauncher
              )}
            </ContentArea>
          )}

          {!view.tutorialIsFullscreen && view.statusBar}

          {view.appLauncher}
          {view.tutorialOverlay}
          {view.floatingDetail}
          {view.dragGhost}
        </Shell>
      );
  }
}
