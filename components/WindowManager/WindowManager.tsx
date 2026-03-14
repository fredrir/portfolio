"use client";

import { useState, useEffect, useCallback } from "react";
import { useWindowManager } from "./hooks/useWindowManager";
import { useBackground } from "./hooks/useBackground";
import { Window } from "./Window";
import { StatusBar } from "./StatusBar";
import { AppLauncher } from "./AppLauncher";
import { Background } from "./Background";
import { WINDOW_CONFIGS, GAP, STATUS_BAR_HEIGHT, STACKED_PANES } from "./constants";

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

import type { GitHubData, SpotifyData } from "@/components/HomePage/Contact/types";
import type { Journey, NavbarType } from "@/lib/locale/languageTypes";
import type { projectType, journeyType } from "@/lib/types/types";

interface Props {
  locale: string;
  currentLocale: "en" | "nb" | "nn" | "fr";
  navbar: NavbarType;
  landing: { title: string; terminal: { mainText: string } };
  journey: Journey;
  project: { title: string; viewCode: string; projects: projectType[] };
  contact: {
    title: string; name: string; email: string; phone: string;
    message: string; submit: string; submitSuccess: string;
    submitError: string; submitLoading: string; recaptchaError: string;
  };
  githubData: GitHubData | null;
  spotifyData: SpotifyData;
}

function TipBar() {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("wm-tip-dismissed")) { setVisible(false); setDismissed(true); }
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
        <span className="text-primary/70 font-bold">Ctrl+K</span> app launcher
        <span className="text-primary/20 mx-2">|</span>
        Drag titles to swap
        <span className="text-primary/20 mx-2">|</span>
        Drag row borders to resize
      </span>
      <button onClick={() => { setVisible(false); setDismissed(true); sessionStorage.setItem("wm-tip-dismissed", "1"); }} className="text-muted-foreground/30 hover:text-foreground transition-colors ml-2">×</button>
    </div>
  );
}

function RowDivider({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div className="h-[10px] -my-[3px] relative z-10 cursor-row-resize group flex items-center shrink-0" onMouseDown={onMouseDown}>
      <div className="w-full h-[2px] rounded-full bg-primary/5 group-hover:bg-primary/30 group-active:bg-primary/50 transition-colors" />
    </div>
  );
}

function FloatingDetail({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[80vh] rounded-xl border border-primary/30 bg-background/95 backdrop-blur-md shadow-2xl shadow-primary/10 overflow-hidden flex flex-col font-mono" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-primary/15 bg-primary/[0.03] shrink-0">
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} className="group"><div className="w-3.5 h-3.5 rounded-full bg-destructive/60 group-hover:bg-destructive transition-colors" /></button>
            <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow/60" />
            <div className="w-3.5 h-3.5 rounded-full bg-primary/60" />
          </div>
          <span className="text-2xs text-muted-foreground/50 truncate mx-2">{title}</span>
          <span className="text-3xs text-primary/30">fredrir@arch</span>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function MobileLayout({ paneContent }: { paneContent: Record<string, React.ReactNode> }) {
  const order = ["about", "github", "spotify", "journey", "projects", "contact", "terminal"];
  return (
    <div className="flex flex-col gap-3 p-3 pb-12">
      {order.map((id) => {
        const config = WINDOW_CONFIGS.find((c) => c.id === id);
        if (!config) return null;
        return (
          <div key={id} className="rounded-xl border border-primary/20 bg-background/80 backdrop-blur-md shadow-lg shadow-primary/5 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-primary/15 bg-primary/[0.03]">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-destructive/60" />
                <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow/60" />
                <div className="w-3.5 h-3.5 rounded-full bg-primary/60" />
              </div>
              <span className="font-mono text-2xs text-muted-foreground/50">{config.title}</span>
              <span className="font-mono text-3xs text-primary/30">fredrir@arch</span>
            </div>
            <div className="min-h-48 max-h-[500px] overflow-auto">{paneContent[id]}</div>
          </div>
        );
      })}
    </div>
  );
}

export function WindowManager({
  locale, currentLocale, navbar, landing, journey, project,
  contact, githubData, spotifyData,
}: Props) {
  const wm = useWindowManager();
  const bg = useBackground();
  const [isMobile, setIsMobile] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>("about");
  const [floatingDetail, setFloatingDetail] = useState<{ title: string; content: React.ReactNode } | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleFocus = useCallback((id: string) => { setFocusedId(id); wm.focusWindow(id); }, [wm]);
  const handleOpenSettings = useCallback(() => { wm.openWindow("settings"); setFocusedId("settings"); }, [wm]);

  const handleOpenJourneyDetail = useCallback((j: journeyType) => {
    setFloatingDetail({ title: `${j.company} — ${j.jobTitle}`, content: <JourneyDetailPane journey={j} /> });
  }, []);

  const handleOpenProjectDetail = useCallback((p: projectType) => {
    setFloatingDetail({ title: `~/projects/${p.title}`, content: <ProjectDetailPane project={p} viewCode={project.viewCode} /> });
  }, [project.viewCode]);

  const paneContent: Record<string, React.ReactNode> = {
    about: <AboutPane locale={locale} landing={landing} />,
    github: <GitHubPaneWrapper initialData={githubData} />,
    spotify: <SpotifyPaneWrapper initialData={spotifyData} />,
    journey: <JourneyPane journey={journey} onOpenDetail={handleOpenJourneyDetail} />,
    projects: <ProjectsPane title={project.title} projects={project.projects} viewCode={project.viewCode} onOpenDetail={handleOpenProjectDetail} />,
    contact: <ContactPane contact={contact} />,
    settings: <SettingsPane navbar={navbar} currentLocale={currentLocale} currentBackground={bg.current} onSelectBackground={bg.setBackground} />,
    terminal: <TerminalPaneWrapper locale={locale} />,
  };

  const configMap = Object.fromEntries(WINDOW_CONFIGS.map((c) => [c.id, c]));

  const renderPane = (paneId: string) => {
    const config = configMap[paneId];
    if (!config || !wm.states[paneId]?.isOpen) return null;
    return (
      <Window
        key={paneId}
        config={config}
        state={wm.states[paneId]}
        isFocused={focusedId === paneId}
        isSwapTarget={wm.swapTarget === paneId}
        isDragging={wm.dragTarget === paneId}
        onClose={() => wm.closeWindow(paneId)}
        onMaximize={() => wm.toggleMaximize(paneId)}
        onFocus={() => handleFocus(paneId)}
        onTitleMouseDown={wm.startTitleDrag}
      >
        {paneContent[paneId]}
      </Window>
    );
  };

  const renderCell = (cellId: string) => {
    const stackedIds = STACKED_PANES[cellId];
    if (stackedIds) {
      const visiblePanes = stackedIds.filter((id) => wm.states[id]?.isOpen);
      if (visiblePanes.length === 0) return null;
      if (visiblePanes.length === 1) return renderPane(visiblePanes[0]);
      return (
        <div className="flex-1 min-w-0 flex flex-col" style={{ gap: GAP }}>
          {visiblePanes.map((id) => {
            const isSpotify = id === "spotify";
            return (
              <div key={id} className={`flex min-h-0 ${isSpotify ? "shrink-0" : "flex-1"}`}
                style={isSpotify ? { maxHeight: "35%", minHeight: "120px" } : undefined}>
                {renderPane(id)}
              </div>
            );
          })}
        </div>
      );
    }
    return renderPane(cellId);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen">
        <Background config={bg.current} />
        <div className="relative z-10"><MobileLayout paneContent={paneContent} /></div>
        <StatusBar states={wm.states} allConfigs={WINDOW_CONFIGS} locale={locale} focusedWindowId={null}
          onOpenLauncher={() => wm.setLauncherOpen(true)} onOpenSettings={handleOpenSettings} onFocusWindow={handleFocus} />
      </div>
    );
  }

  if (wm.maximizedId && wm.states[wm.maximizedId]?.isOpen) {
    const config = configMap[wm.maximizedId];
    return (
      <div className="fixed inset-0 overflow-hidden">
        <Background config={bg.current} />
        <div className="relative flex flex-col w-full" style={{ height: `calc(100vh - ${STATUS_BAR_HEIGHT}px)`, padding: GAP }}>
          <Window config={config} state={wm.states[wm.maximizedId]} isFocused
            onClose={() => wm.closeWindow(wm.maximizedId!)} onMaximize={() => wm.toggleMaximize(wm.maximizedId!)}
            onFocus={() => {}} onTitleMouseDown={() => {}}>
            {paneContent[wm.maximizedId]}
          </Window>
        </div>
        <StatusBar states={wm.states} allConfigs={WINDOW_CONFIGS} locale={locale} focusedWindowId={wm.maximizedId}
          onOpenLauncher={() => wm.setLauncherOpen(true)} onOpenSettings={handleOpenSettings} onFocusWindow={handleFocus} />
        {wm.launcherOpen && <AppLauncher states={wm.states} onOpen={(id) => { wm.openWindow(id); setFocusedId(id); }} onClose={() => wm.setLauncherOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Background config={bg.current} />

      <div className="relative flex flex-col w-full" style={{ height: `calc(100vh - ${STATUS_BAR_HEIGHT}px)`, padding: GAP, gap: 0 }}>
        {wm.visibleRows.map((row, ri) => {
          const h = wm.rowHeights[ri] ?? (100 / wm.visibleRows.length);
          return (
            <div key={ri} className="contents">
              <div className="flex shrink-0" style={{ flex: `${h} 0 0%`, gap: GAP, minHeight: 0 }}>
                {row.map((cellId) => (
                  <div key={cellId} className="flex-1 min-w-0 flex min-h-0">
                    {renderCell(cellId)}
                  </div>
                ))}
              </div>
              {ri < wm.visibleRows.length - 1 && <RowDivider onMouseDown={(e) => wm.startRowResize(ri, e)} />}
            </div>
          );
        })}
      </div>

      <TipBar />

      <StatusBar states={wm.states} allConfigs={WINDOW_CONFIGS} locale={locale} focusedWindowId={focusedId}
        onOpenLauncher={() => wm.setLauncherOpen(true)} onOpenSettings={handleOpenSettings} onFocusWindow={handleFocus} />

      {wm.launcherOpen && <AppLauncher states={wm.states} onOpen={(id) => { wm.openWindow(id); setFocusedId(id); }} onClose={() => wm.setLauncherOpen(false)} />}
      {floatingDetail && <FloatingDetail title={floatingDetail.title} onClose={() => setFloatingDetail(null)}>{floatingDetail.content}</FloatingDetail>}

      {wm.dragTarget && wm.dragPos && wm.dragSize && (() => {
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
                {dragConfig.icon && <span className="text-primary/60 mr-1">{dragConfig.icon}</span>}
                {dragConfig.title}
              </span>
              <span className="font-mono text-3xs text-primary/30">fredrir@arch</span>
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
