"use client";

import { useState, useEffect, useCallback } from "react";
import { useWindowManager } from "./hooks/useWindowManager";
import { useBackground } from "./hooks/useBackground";
import { Window } from "./Window";
import { StatusBar } from "./StatusBar";
import { AppLauncher } from "./AppLauncher";
import { Background } from "./Background";
import { WINDOW_CONFIGS } from "./constants";

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

import type {
  GitHubData,
  SpotifyData,
} from "@/components/HomePage/Contact/types";
import type { Journey, NavbarType } from "@/lib/locale/languageTypes";
import type { projectType, journeyType } from "@/lib/types/types";

interface Props {
  locale: string;
  currentLocale: "en" | "nb" | "nn" | "fr";
  navbar: NavbarType;
  landing: {
    title: string;
    terminal: { mainText: string };
  };
  journey: Journey;
  project: {
    title: string;
    viewCode: string;
    projects: projectType[];
  };
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
  githubData: GitHubData | null;
  spotifyData: SpotifyData;
}

function TipBar() {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("wm-tip-dismissed");
    if (wasDismissed) {
      setVisible(false);
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9998] font-mono text-2xs bg-background/90 border border-primary/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-primary/5">
      <span className="text-primary">tip</span>
      <span className="text-muted-foreground/60">
        Press{" "}
        <span className="text-primary/70 font-bold">Ctrl+K</span> to
        open the app launcher. Drag title bars to swap windows.
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
}: {
  paneContent: Record<string, React.ReactNode>;
}) {
  const paneOrder = [
    "about",
    "github",
    "spotify",
    "journey",
    "projects",
    "contact",
  ];

  return (
    <div className="flex flex-col gap-3 p-3 pb-12">
      {paneOrder.map((id) => {
        const config = WINDOW_CONFIGS.find((c) => c.id === id);
        if (!config) return null;
        return (
          <div
            key={id}
            className="rounded-xl border border-primary/20 bg-background/80 backdrop-blur-md shadow-lg shadow-primary/5 overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-primary/15 bg-primary/[0.03]">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-destructive/60" />
                <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow/60" />
                <div className="w-3.5 h-3.5 rounded-full bg-primary/60" />
              </div>
              <span className="font-mono text-2xs text-muted-foreground/50">
                {config.title}
              </span>
              <span className="font-mono text-3xs text-primary/30">
                fredrir@arch
              </span>
            </div>
            <div className="min-h-48 max-h-[500px] overflow-auto">
              {paneContent[id]}
            </div>
          </div>
        );
      })}
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
  githubData,
  spotifyData,
}: Props) {
  const wm = useWindowManager();
  const bg = useBackground();
  const [isMobile, setIsMobile] = useState(false);
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
        content: (
          <ProjectDetailPane project={p} viewCode={project.viewCode} />
        ),
      });
    },
    [project.viewCode],
  );

  const paneContent: Record<string, React.ReactNode> = {
    about: <AboutPane locale={locale} landing={landing} />,
    github: <GitHubPaneWrapper initialData={githubData} />,
    spotify: <SpotifyPaneWrapper initialData={spotifyData} />,
    journey: (
      <JourneyPane
        journey={journey}
        onOpenDetail={handleOpenJourneyDetail}
      />
    ),
    projects: (
      <ProjectsPane
        title={project.title}
        projects={project.projects}
        viewCode={project.viewCode}
        onOpenDetail={handleOpenProjectDetail}
      />
    ),
    contact: <ContactPane contact={contact} />,
    settings: (
      <SettingsPane
        navbar={navbar}
        currentLocale={currentLocale}
        currentBackground={bg.current}
        onSelectBackground={bg.setBackground}
      />
    ),
    terminal: (
      <TerminalPaneWrapper
        mainText={landing.terminal.mainText}
        locale={locale}
      />
    ),
  };

  if (isMobile) {
    return (
      <div className="min-h-screen">
        <Background config={bg.current} />
        <div className="relative z-10">
          <MobileLayout paneContent={paneContent} />
        </div>
        <StatusBar
          states={wm.states}
          allConfigs={wm.allConfigs}
          locale={locale}
          focusedWindowId={null}
          onOpenLauncher={() => wm.setLauncherOpen(true)}
          onOpenSettings={handleOpenSettings}
          onFocusWindow={handleFocus}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Background config={bg.current} />

      <div className="relative w-full h-full">
        {wm.allConfigs
          .filter((c) => wm.states[c.id]?.isOpen)
          .map((config) => (
            <Window
              key={config.id}
              config={config}
              state={wm.states[config.id]}
              isFocused={focusedId === config.id}
              isSwapTarget={wm.swapTarget === config.id}
              onClose={() => wm.closeWindow(config.id)}
              onMaximize={() => wm.toggleMaximize(config.id)}
              onFocus={() => handleFocus(config.id)}
              onDragStart={wm.startDrag}
              onResizeStart={wm.startResize}
            >
              {paneContent[config.id]}
            </Window>
          ))}
      </div>

      <TipBar />

      <StatusBar
        states={wm.states}
        allConfigs={wm.allConfigs}
        locale={locale}
        focusedWindowId={focusedId}
        onOpenLauncher={() => wm.setLauncherOpen(true)}
        onOpenSettings={handleOpenSettings}
        onFocusWindow={handleFocus}
      />

      {wm.launcherOpen && (
        <AppLauncher
          states={wm.states}
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
