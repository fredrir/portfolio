"use client";

import { useState, useCallback, useEffect } from "react";
import { useWindowManager } from "./hooks/use-window-manager";
import { useBackground } from "./hooks/use-background";
import { useIsMobile } from "@/shared/hooks/use-is-mobile";
import { useTutorial } from "@/tutorial/use-tutorial";
import { TutorialOverlay } from "@/tutorial";
import { Window } from "./components/window";
import { StatusBar } from "./components/status-bar";
import { AppLauncher } from "./components/app-launcher";
import { Background } from "./components/background";
import { TipBar } from "./components/tip-bar";
import { FloatingDetail } from "./components/floating-detail";
import { MobileLayout } from "./components/mobile-layout";
import { MobileDock } from "./components/mobile-dock";
import { WINDOW_CONFIGS, GAP, STATUS_BAR_HEIGHT } from "./constants";
import { STACK_HEIGHTS } from "./layout";
import type { CellDef } from "./layout";

import { AboutPane } from "@/panes/about";
import { GitHubPane } from "@/panes/github";
import { SpotifyPane } from "@/panes/spotify";
import { JourneyPane } from "@/panes/journey";
import { JourneyDetailPane } from "@/panes/journey/components/journey-detail-pane";
import { ProjectsPane } from "@/panes/projects";
import { ProjectDetailPane } from "@/panes/projects/components/project-detail-pane";
import { ContactPane } from "@/panes/contact";
import { SettingsPane } from "@/panes/settings";
import { TerminalPane } from "@/terminal";
import { ImagePane } from "@/panes/gallery";

import type {
  UiStrings,
  TutorialStrings,
  GitHubData,
  Landing,
  SpotifyData,
  projectType,
  journeyType,
} from "@/shared/types";
import type { Journey, NavbarType } from "@/i18n/language-types";

interface Props {
  locale: string;
  currentLocale: "en" | "nb" | "nn" | "fr";
  navbar: NavbarType;
  landing: Landing;
  journey: Journey;
  project: { title: string; viewCode: string; projects: projectType[] };
  contact: {
    title: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    submitSuccess: string;
    submitError: string;
    submitLoading: string;
    recaptchaError: string;
    optional: string;
    vimHintNormal: string;
    vimHintStatus: string;
  };
  ui: UiStrings;
  tutorial: TutorialStrings;
  githubData: GitHubData | null;
  spotifyData: SpotifyData;
}

export function WindowManager({
  locale,
  currentLocale,
  navbar,
  landing,
  journey,
  project,
  contact,
  ui,
  tutorial: tutorialStrings,
  githubData,
  spotifyData,
}: Props) {
  const isMobile = useIsMobile();
  const tutorial = useTutorial(isMobile === true, locale);
  const wm = useWindowManager(tutorial.isActive);
  const bg = useBackground();
  const [mobileActiveApp, _setMobileActiveApp] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("mobileActiveApp");
    }
    return null;
  });
  const setMobileActiveApp = useCallback((app: string | null) => {
    _setMobileActiveApp(app);
    if (app) {
      sessionStorage.setItem("mobileActiveApp", app);
    } else {
      sessionStorage.removeItem("mobileActiveApp");
    }
  }, []);
  const [focusedId, setFocusedId] = useState<string | null>("about");
  const [floatingDetail, setFloatingDetail] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

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
  const handleOpenSettings = useCallback(() => {
    wm.openWindow("settings");
    setFocusedId("settings");
  }, [wm]);

  useEffect(() => {
    if (!tutorial.isActive || !tutorial.step) return;
    if (tutorial.step.id === "pane-selection") {
      wm.setOpenPanes(tutorial.choices.openPanes);
    }
  }, [tutorial.isActive, tutorial.step, tutorial.choices.openPanes, wm]);

  useEffect(() => {
    if (!tutorial.isActive || !tutorial.step) return;
    if (tutorial.step.id === "drag") {
      wm.onSwapRef.current = tutorial.next;
      return () => { wm.onSwapRef.current = null; };
    }
    if (tutorial.step.id === "resize") {
      wm.onResizeRef.current = tutorial.next;
      return () => { wm.onResizeRef.current = null; };
    }
  }, [tutorial.isActive, tutorial.step, tutorial.next, wm]);

  const handleOpenJourneyDetail = useCallback((j: journeyType) => {
    setFloatingDetail({
      title: `${j.company} — ${j.jobTitle}`,
      content: <JourneyDetailPane journey={j} />,
    });
  }, []);

  const handleOpenProjectDetail = useCallback(
    (p: projectType) => {
      setFloatingDetail({
        title: `~/projects/${p.title}`,
        content: (
          <ProjectDetailPane project={p} viewCode={project.viewCode} ui={ui} />
        ),
      });
    },
    [project.viewCode, ui],
  );

  const paneContent: Record<string, React.ReactNode> = {
    about: <AboutPane landing={landing} />,
    github: <GitHubPane initialData={githubData} ui={ui} />,
    spotify: <SpotifyPane initialData={spotifyData} ui={ui} locale={locale} />,
    journey: (
      <JourneyPane
        journey={journey}
        onOpenDetail={handleOpenJourneyDetail}
        ui={ui}
      />
    ),
    projects: (
      <ProjectsPane
        title={project.title}
        projects={project.projects}
        onOpenDetail={handleOpenProjectDetail}
        ui={ui}
      />
    ),
    contact: <ContactPane contact={contact} />,
    settings: (
      <SettingsPane
        navbar={navbar}
        currentLocale={currentLocale}
        currentBackground={bg.current}
        onSelectBackground={bg.setBackground}
        ui={ui}
        tutorial={tutorialStrings}
      />
    ),
    terminal: (
      <TerminalPane
        locale={locale}
        paneIds={WINDOW_CONFIGS.map((c) => c.id)}
        projects={project.projects.map((p) => ({ title: p.title }))}
        careers={journey.journeys.map((j) => ({
          jobTitle: j.jobTitle,
          company: j.company,
        }))}
        onOpenPane={(id) => {
          wm.openWindow(id);
          setFocusedId(id);
        }}
        onClosePane={(id) => wm.closeWindow(id)}
      />
    ),
    gallery: <ImagePane ui={ui} />,
  };

  const configMap = Object.fromEntries(WINDOW_CONFIGS.map((c) => [c.id, c]));

  const renderPane = (paneId: string, rowIndex?: number, colIndex?: number) => {
    const config = configMap[paneId];
    if (!config || !wm.states[paneId]?.isOpen) return null;
    const isFocused = focusedId === paneId;
    return (
      <Window
        key={paneId}
        config={config}
        state={wm.states[paneId]}
        isFocused={isFocused}
        isSwapTarget={wm.swapTarget === paneId}
        isDragging={wm.dragTarget === paneId}
        showResizeGrip={
          isFocused && rowIndex !== undefined && colIndex !== undefined
        }
        onClose={() => wm.closeWindow(paneId)}
        onMaximize={() => wm.toggleMaximize(paneId)}
        onFocus={() => handleFocus(paneId)}
        onTitleMouseDown={wm.startTitleDrag}
        onCornerResize={
          rowIndex !== undefined && colIndex !== undefined
            ? (e) => wm.startCornerResize(rowIndex, colIndex, e)
            : undefined
        }
      >
        {paneContent[paneId]}
      </Window>
    );
  };

  const renderCell = (cell: CellDef, rowIndex: number, colIndex: number) => {
    if (Array.isArray(cell)) {
      const visible = cell.filter((id) => wm.states[id]?.isOpen);
      if (visible.length === 0) return null;
      if (visible.length === 1)
        return renderPane(visible[0], rowIndex, colIndex);
      const heightKey = cell.join(",");
      const heights = STACK_HEIGHTS[heightKey];
      return (
        <div className="flex-1 min-w-0 flex flex-col" style={{ gap: GAP }}>
          {visible.map((id) => {
            const h = heights?.[cell.indexOf(id)];
            return (
              <div
                key={id}
                className="flex min-h-0"
                style={{ flex: `${h ?? 1} 0 0%` }}
              >
                {renderPane(id, rowIndex, colIndex)}
              </div>
            );
          })}
        </div>
      );
    }
    return renderPane(cell, rowIndex, colIndex);
  };

  const postPaneSteps = new Set(["launcher", "drag", "resize", "done"]);
  const tutorialIsFloating = tutorial.isActive && tutorial.step != null && postPaneSteps.has(tutorial.step.id);
  const tutorialIsFullscreen = tutorial.isActive && !tutorialIsFloating;

  const tutorialOverlay = tutorial.isActive && tutorial.step && (
    <TutorialOverlay
      t={tutorialStrings}
      ui={ui}
      currentLocale={currentLocale}
      stepId={tutorial.step.id}
      stepIndex={tutorial.stepIndex}
      totalSteps={tutorial.totalSteps}
      choices={tutorial.choices}
      floating={tutorialIsFloating}
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
              activeApp={mobileActiveApp}
              onOpenApp={setMobileActiveApp}
              onGoHome={() => setMobileActiveApp(null)}
              ui={ui}
              locale={locale}
            />
          </div>
        )}
        {!tutorial.isActive && (
          <MobileDock
            activeApp={mobileActiveApp}
            onOpenApp={setMobileActiveApp}
            onGoHome={() => setMobileActiveApp(null)}
            ui={ui}
          />
        )}
        {tutorialOverlay}
        {floatingDetail && (
          <FloatingDetail
            title={floatingDetail.title}
            onClose={() => setFloatingDetail(null)}
          >
            {floatingDetail.content}
          </FloatingDetail>
        )}
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
          locale={locale}
          ui={ui}
          focusedWindowId={wm.maximizedId}
          onOpenLauncher={() => wm.setLauncherOpen(true)}
          onOpenSettings={handleOpenSettings}
          onFocusWindow={handleFocus}
        />
        {wm.launcherOpen && (
          <AppLauncher
            states={wm.states}
            ui={ui}
            locale={locale}
            onOpen={(id) => {
              wm.openWindow(id);
              setFocusedId(id);
            }}
            onStop={(id) => wm.closeWindow(id)}
            onClose={() => wm.setLauncherOpen(false)}
          />
        )}
        {floatingDetail && (
          <FloatingDetail
            title={floatingDetail.title}
            onClose={() => setFloatingDetail(null)}
          >
            {floatingDetail.content}
          </FloatingDetail>
        )}
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
          {wm.visibleLayout.map((row, ri) => {
            const h = wm.rowHeights[ri] ?? 100 / wm.visibleLayout.length;
            return (
              <div key={ri} className="contents">
                <div
                  className="flex shrink-0"
                  style={{ flex: `${h} 0 0%`, gap: 0, minHeight: 0 }}
                >
                  {row.map((cell, ci) => {
                    const colWeights = wm.colWidths[ri];
                    const w = colWeights?.[ci] ?? 1;
                    const key = Array.isArray(cell) ? cell.join(",") : cell;
                    return (
                      <div key={key} className="contents">
                        <div
                          className="min-w-0 flex min-h-0"
                          style={{ flex: `${w} 0 0%` }}
                        >
                          {renderCell(cell, ri, ci)}
                        </div>
                        {ci < row.length - 1 && (
                          <div
                            className="w-[10px] shrink-0 cursor-col-resize relative z-10 group"
                            onMouseDown={(e) => wm.startColResize(ri, ci, e)}
                          >
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full opacity-0 group-hover:opacity-100 bg-control-border-hover transition-opacity" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {ri < wm.visibleLayout.length - 1 && (
                  <div
                    className="h-[10px] shrink-0 cursor-row-resize relative z-10 group"
                    onMouseDown={(e) => wm.startRowResize(ri, e)}
                  >
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full opacity-0 group-hover:opacity-100 bg-control-border-hover transition-opacity" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!tutorial.isActive && <TipBar ui={ui} />}

      {!tutorialIsFullscreen && (
        <StatusBar
          states={wm.states}
          allConfigs={WINDOW_CONFIGS}
          locale={locale}
          ui={ui}
          focusedWindowId={focusedId}
          onOpenLauncher={() => wm.setLauncherOpen(true)}
          onOpenSettings={handleOpenSettings}
          onFocusWindow={handleFocus}
        />
      )}

      {wm.launcherOpen && (
        <AppLauncher
          states={wm.states}
          ui={ui}
          locale={locale}
          onOpen={(id) => {
            wm.openWindow(id);
            setFocusedId(id);
          }}
          onStop={(id) => wm.closeWindow(id)}
          onClose={() => wm.setLauncherOpen(false)}
        />
      )}

      {tutorialOverlay}

      {floatingDetail && (
        <FloatingDetail
          title={floatingDetail.title}
          onClose={() => setFloatingDetail(null)}
        >
          {floatingDetail.content}
        </FloatingDetail>
      )}

      {wm.dragTarget &&
        wm.dragPos &&
        wm.dragSize &&
        (() => {
          const dragConfig = configMap[wm.dragTarget];
          if (!dragConfig) return null;
          return (
            <div
              className="fixed z-[9990] pointer-events-none rounded-xl border border-chart-fill bg-glass-faint backdrop-blur-md shadow-2xl shadow-surface-selected overflow-hidden flex flex-col"
              style={{
                left: wm.dragPos.x,
                top: wm.dragPos.y,
                width: wm.dragSize.w,
                height: wm.dragSize.h,
                opacity: 0.85,
              }}
            >
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-wm-border bg-surface-dim shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-wm-close" />
                  <div className="w-3.5 h-3.5 rounded-full bg-wm-minimize" />
                  <div className="w-3.5 h-3.5 rounded-full bg-wm-maximize" />
                </div>
                <span className="font-mono text-xs text-faded truncate mx-2">
                  {dragConfig.title}
                </span>
                <span className="font-mono text-xs text-primary-subtle"></span>
              </div>
              <div className="flex-1 overflow-hidden opacity-40">
                {paneContent[wm.dragTarget]}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
