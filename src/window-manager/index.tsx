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
import { Shell } from "./components/shell";
import { ContentArea } from "./components/content-area";
import { TipBar } from "./components/tip-bar";
import { MobileLayout } from "./components/mobile-layout";
import { MobileDock } from "./components/mobile-dock";
import { TilingGrid } from "./components/tiling-grid";
import { Window } from "./components/window";
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
              state={view.maximizedState}
              isFocused
              onClose={() => wm.closeWindow(wm.maximizedId!)}
              onMaximize={() => wm.toggleMaximize(wm.maximizedId!)}
            >
              {view.paneContent[wm.maximizedId!]}
            </Window>
          </ContentArea>
          {view.statusBar(wm.maximizedId)}
          {view.appLauncher}
          {view.floatingDetail}
        </Shell>
      );

    case "tiling":
      return (
        <Shell background={bg.current}>
          {!view.tutorialIsFullscreen && (
            <ContentArea>
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
            </ContentArea>
          )}

          {!tutorial.isActive && <TipBar ui={ui} />}
          {!view.tutorialIsFullscreen && view.statusBar(focus.focusedId)}

          {view.appLauncher}
          {view.tutorialOverlay}
          {view.floatingDetail}
          {view.dragGhost}
        </Shell>
      );
  }
}
