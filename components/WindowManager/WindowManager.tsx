"use client";

import { useState, useEffect } from "react";
import { useWindowManager } from "./hooks/useWindowManager";
import { useBackground } from "./hooks/useBackground";
import { Window } from "./Window";
import { StatusBar } from "./StatusBar";
import { AppLauncher } from "./AppLauncher";
import { BackgroundPicker } from "./BackgroundPicker";
import { Background } from "./Background";
import { WINDOW_CONFIGS } from "./constants";

import { NeofetchPane } from "./panes/NeofetchPane";
import { JourneyPane } from "./panes/JourneyPane";
import { ProjectsPane } from "./panes/ProjectsPane";
import { ContactPane } from "./panes/ContactPane";
import { SpotifyPaneWrapper } from "./panes/SpotifyPaneWrapper";
import { GitHubPaneWrapper } from "./panes/GitHubPaneWrapper";
import { TerminalPaneWrapper } from "./panes/TerminalPaneWrapper";

import type { GitHubData, SpotifyData } from "@/components/HomePage/Contact/types";
import type { Journey, NavbarType } from "@/lib/locale/languageTypes";
import type { projectType } from "@/lib/types/types";

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
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9998] font-mono text-2xs bg-background/90 border border-primary/20 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg shadow-primary/5">
      <span className="text-primary">tip</span>
      <span className="text-muted-foreground/60">
        Press <span className="text-primary/70 font-bold">Ctrl+K</span> to open
        the app launcher. Drag title bars to move windows.
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

function MobileLayout({
  paneContent,
}: {
  paneContent: Record<string, React.ReactNode>;
}) {
  const paneOrder = ["neofetch", "github", "spotify", "journey", "projects", "contact"];

  return (
    <div className="flex flex-col gap-3 p-3 pb-12">
      {paneOrder.map((id) => {
        const config = WINDOW_CONFIGS.find((c) => c.id === id);
        if (!config) return null;
        return (
          <div
            key={id}
            className="rounded-lg border border-primary/20 bg-background/90 backdrop-blur-md shadow-lg shadow-primary/5 overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-1 border-b border-primary/15 bg-primary/[0.03]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive/60" />
                <div className="w-2 h-2 rounded-full bg-accent-yellow/60" />
                <div className="w-2 h-2 rounded-full bg-primary/60" />
              </div>
              <span className="font-mono text-2xs text-muted-foreground/50">
                {config.title}
              </span>
              <span className="font-mono text-3xs text-primary/30">
                fredrir@arch
              </span>
            </div>
            <div className="min-h-48 max-h-96 overflow-auto">
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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const paneContent: Record<string, React.ReactNode> = {
    neofetch: <NeofetchPane locale={locale} landing={landing} />,
    github: <GitHubPaneWrapper initialData={githubData} />,
    spotify: <SpotifyPaneWrapper initialData={spotifyData} />,
    journey: <JourneyPane journey={journey} />,
    projects: (
      <ProjectsPane
        title={project.title}
        projects={project.projects}
        viewCode={project.viewCode}
      />
    ),
    contact: <ContactPane contact={contact} />,
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
          locale={locale}
          navbar={navbar}
          currentLocale={currentLocale}
          onOpenLauncher={() => wm.setLauncherOpen(true)}
          onOpenBgPicker={() => bg.setPickerOpen(true)}
          onFocusWindow={wm.focusWindow}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <Background config={bg.current} />

      <div className="relative w-full h-full">
        {WINDOW_CONFIGS.filter((c) => wm.states[c.id]?.isOpen).map(
          (config) => (
            <Window
              key={config.id}
              config={config}
              state={wm.states[config.id]}
              onClose={() => wm.closeWindow(config.id)}
              onMaximize={() => wm.toggleMaximize(config.id)}
              onTile={() => wm.tileWindow(config.id)}
              onFocus={() => wm.focusWindow(config.id)}
              onDragStart={wm.startDrag}
              onResizeStart={wm.startResize}
            >
              {paneContent[config.id]}
            </Window>
          ),
        )}
      </div>

      <TipBar />

      <StatusBar
        states={wm.states}
        locale={locale}
        navbar={navbar}
        currentLocale={currentLocale}
        onOpenLauncher={() => wm.setLauncherOpen(true)}
        onOpenBgPicker={() => bg.setPickerOpen(true)}
        onFocusWindow={wm.focusWindow}
      />

      {wm.launcherOpen && (
        <AppLauncher
          states={wm.states}
          onOpen={wm.openWindow}
          onClose={() => wm.setLauncherOpen(false)}
        />
      )}

      {bg.pickerOpen && (
        <BackgroundPicker
          current={bg.current}
          onSelect={bg.setBackground}
          onClose={() => bg.setPickerOpen(false)}
        />
      )}
    </div>
  );
}
