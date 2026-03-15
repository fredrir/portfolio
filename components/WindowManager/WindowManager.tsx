"use client";

import { useState, useEffect, useCallback } from "react";
import { useWindowManager } from "./hooks/useWindowManager";
import { useBackground } from "./hooks/useBackground";
import { Window } from "./Window";
import { StatusBar } from "./StatusBar";
import { AppLauncher } from "./AppLauncher";
import { Background } from "./Background";
import { WINDOW_CONFIGS, GAP, STATUS_BAR_HEIGHT } from "./constants";
import { STACK_HEIGHTS } from "./layout";
import type { CellDef } from "./layout";
import { MobileHomeScreen } from "./MobileHomeScreen";
import { MobileDock } from "./MobileDock";
import { AnimatePresence, motion } from "framer-motion";

import { AboutPane } from "./panes/AboutPane";
import { JourneyPane } from "./panes/JourneyPane";
import { JourneyDetailPane } from "./panes/JourneyDetailPane";
import { ProjectsPane } from "./panes/ProjectsPane";
import { ProjectDetailPane } from "./panes/ProjectDetailPane";
import { ContactPane } from "./panes/ContactPane";
import { SettingsPane } from "./panes/SettingsPane";
import { SpotifyPaneWrapper } from "./panes/SpotifyPaneWrapper";
import { GitHubPaneWrapper } from "./panes/GitHubPaneWrapper";
import { TerminalPaneWrapper } from "./panes/TerminalPaneWrapper";
import { ImagePane } from "./panes/ImagePane";

import type {
  GitHubData,
  SpotifyData,
} from "@/components/HomePage/Contact/types";
import type { Journey, NavbarType } from "@/lib/locale/languageTypes";
import type { projectType, journeyType } from "@/lib/types/types";

export interface UiStrings {
  theme: string;
  language: string;
  wallpaper: string;
  customImage: string;
  nowPlaying: string;
  lastPlayed: string;
  track: string;
  artist: string;
  album: string;
  playInBrowser: string;
  hidePlayer: string;
  about: string;
  techStack: string;
  links: string;
  visitors: string;
  uptime: string;
  searchApps: string;
  noMatching: string;
  navigate: string;
  open: string;
  close: string;
  apps: string;
  tipLauncher: string;
  tipDrag: string;
  tipResize: string;
  entries: string;
  projects: string;
  images: string;
  clickToOpen: string;
  active: string;
  running: string;
  stopped: string;
  lastYear: string;
}

interface Props {
  locale: string;
  currentLocale: "en" | "nb" | "nn" | "fr";
  navbar: NavbarType;
  landing: { title: string; terminal: { mainText: string } };
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
  };
  ui: UiStrings;
  githubData: GitHubData | null;
  spotifyData: SpotifyData;
}

function TipBar({ ui }: { ui: UiStrings }) {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("wm-tip-dismissed")) {
      setVisible(false);
      setDismissed(true);
    }
  }, []);
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, [dismissed]);
  if (!visible || dismissed) return null;
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9998] font-mono text-2xs bg-background/90 border border-primary/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-primary/5">
      <span className="text-primary">tip</span>
      <span className="text-muted-foreground/60">
        <span className="text-primary/70 font-bold">Ctrl+K</span> {ui.tipLauncher}
        <span className="text-primary/20 mx-2">|</span>
        {ui.tipDrag}
        <span className="text-primary/20 mx-2">|</span>
        {ui.tipResize}
      </span>
      <button
        onClick={() => {
          setVisible(false);
          setDismissed(true);
          sessionStorage.setItem("wm-tip-dismissed", "1");
        }}
        className="text-muted-foreground/30 hover:text-foreground transition-colors ml-2"
      >
        ×
      </button>
    </div>
  );
}

function FloatingDetail({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] rounded-xl border border-primary/30 bg-background/95 backdrop-blur-md shadow-2xl shadow-primary/10 overflow-hidden flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-primary/15 bg-primary/[0.03] shrink-0">
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} className="group">
              <div className="w-3.5 h-3.5 rounded-full bg-destructive/60 group-hover:bg-destructive transition-colors" />
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow/60" />
            <div className="w-3.5 h-3.5 rounded-full bg-primary/60" />
          </div>
          <span className="text-2xs text-muted-foreground/50 truncate mx-2">
            {title}
          </span>
          <span className="text-3xs text-primary/30">fredrir@arch</span>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function MobileLayout({
  paneContent,
  activeApp,
  onOpenApp,
  onGoHome,
}: {
  paneContent: Record<string, React.ReactNode>;
  activeApp: string | null;
  onOpenApp: (id: string) => void;
  onGoHome: () => void;
}) {
  const activeConfig = activeApp
    ? WINDOW_CONFIGS.find((c) => c.id === activeApp)
    : null;

  return (
    <div className="fixed inset-0 flex flex-col" style={{ paddingBottom: 76 }}>
      <AnimatePresence mode="wait">
        {activeApp === null ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            <MobileHomeScreen onOpenApp={onOpenApp} />
          </motion.div>
        ) : (
          <motion.div
            key={activeApp}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 flex flex-col m-2 rounded-xl border border-primary/20 bg-background/80 backdrop-blur-md shadow-lg shadow-primary/5 overflow-hidden min-h-0">
              <div className="flex items-center px-3 py-2 border-b border-primary/15 bg-primary/[0.03] shrink-0">
                <button
                  onClick={onGoHome}
                  className="text-primary/60 hover:text-primary transition-colors mr-3 font-mono text-sm"
                >
                  ‹
                </button>
                <span className="font-mono text-2xs text-muted-foreground/50 flex-1 text-center">
                  {activeConfig?.icon && (
                    <span className="text-primary/60 mr-1">
                      {activeConfig.icon}
                    </span>
                  )}
                  {activeConfig?.shortTitle}
                </span>
                <span className="font-mono text-3xs text-primary/30">
                  fredrir@arch
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                {paneContent[activeApp]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
  githubData,
  spotifyData,
}: Props) {
  const wm = useWindowManager();
  const bg = useBackground();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveApp, setMobileActiveApp] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>("about");
  const [floatingDetail, setFloatingDetail] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
        content: <ProjectDetailPane project={p} viewCode={project.viewCode} ui={ui} />,
      });
    },
    [project.viewCode, ui],
  );

  const paneContent: Record<string, React.ReactNode> = {
    about: <AboutPane locale={locale} landing={landing} />,
    github: <GitHubPaneWrapper initialData={githubData} />,
    spotify: <SpotifyPaneWrapper initialData={spotifyData} ui={ui} />,
    journey: (
      <JourneyPane journey={journey} onOpenDetail={handleOpenJourneyDetail} ui={ui} />
    ),
    projects: (
      <ProjectsPane
        title={project.title}
        projects={project.projects}
        viewCode={project.viewCode}
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
      />
    ),
    terminal: <TerminalPaneWrapper locale={locale} />,
    gallery: <ImagePane />,
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
        showResizeGrip={isFocused && rowIndex !== undefined && colIndex !== undefined}
        onClose={() => wm.closeWindow(paneId)}
        onMaximize={() => wm.toggleMaximize(paneId)}
        onFocus={() => handleFocus(paneId)}
        onTitleMouseDown={wm.startTitleDrag}
        onCornerResize={rowIndex !== undefined && colIndex !== undefined
          ? (e) => wm.startCornerResize(rowIndex, colIndex, e)
          : undefined}
      >
        {paneContent[paneId]}
      </Window>
    );
  };

  const renderCell = (cell: CellDef, rowIndex: number, colIndex: number) => {
    if (Array.isArray(cell)) {
      const visible = cell.filter((id) => wm.states[id]?.isOpen);
      if (visible.length === 0) return null;
      if (visible.length === 1) return renderPane(visible[0], rowIndex, colIndex);
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

  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <Background config={bg.current} />
        <div className="relative z-10 h-full">
          <MobileLayout
            paneContent={paneContent}
            activeApp={mobileActiveApp}
            onOpenApp={setMobileActiveApp}
            onGoHome={() => setMobileActiveApp(null)}
          />
        </div>
        <MobileDock
          activeApp={mobileActiveApp}
          onOpenApp={setMobileActiveApp}
          onGoHome={() => setMobileActiveApp(null)}
        />
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
            onOpen={(id) => {
              wm.openWindow(id);
              setFocusedId(id);
            }}
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
                          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full opacity-0 group-hover:opacity-100 bg-primary/30 transition-opacity" />
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
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full opacity-0 group-hover:opacity-100 bg-primary/30 transition-opacity" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TipBar ui={ui} />

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

      {wm.launcherOpen && (
        <AppLauncher
          states={wm.states}
          ui={ui}
          onOpen={(id) => {
            wm.openWindow(id);
            setFocusedId(id);
          }}
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

      {wm.dragTarget &&
        wm.dragPos &&
        wm.dragSize &&
        (() => {
          const dragConfig = configMap[wm.dragTarget];
          if (!dragConfig) return null;
          return (
            <div
              className="fixed z-[9990] pointer-events-none rounded-xl border border-primary/40 bg-background/70 backdrop-blur-md shadow-2xl shadow-primary/20 overflow-hidden flex flex-col"
              style={{
                left: wm.dragPos.x,
                top: wm.dragPos.y,
                width: wm.dragSize.w,
                height: wm.dragSize.h,
                opacity: 0.85,
              }}
            >
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-primary/15 bg-primary/[0.05] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-destructive/60" />
                  <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow/60" />
                  <div className="w-3.5 h-3.5 rounded-full bg-primary/60" />
                </div>
                <span className="font-mono text-2xs text-muted-foreground/50 truncate mx-2">
                  {dragConfig.icon && (
                    <span className="text-primary/60 mr-1">
                      {dragConfig.icon}
                    </span>
                  )}
                  {dragConfig.title}
                </span>
                <span className="font-mono text-3xs text-primary/30">
                  fredrir@arch
                </span>
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
