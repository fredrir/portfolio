"use client";

import { useMemo } from "react";
import { AboutPane } from "@/panes/about";
import { GitHubPane } from "@/panes/github";
import { SpotifyPane } from "@/panes/spotify";
import { JourneyPane } from "@/panes/journey";
import { ProjectsPane } from "@/panes/projects";
import { ContactPane } from "@/panes/contact";
import { SettingsPane } from "@/panes/settings";
import { TerminalPane } from "@/terminal";
import { ImagePane } from "@/panes/gallery";
import { WINDOW_CONFIGS } from "../constants";
import type { GitHubData, SpotifyData } from "@/shared/types";
import type { DictType, Locale } from "@/i18n/types";
import type { BackgroundConfig } from "../types";

interface PaneContentProps {
  dict: DictType;
  locale: Locale;
  githubData: GitHubData | null;
  spotifyData: SpotifyData;
  currentBackground: BackgroundConfig;
  onSelectBackground: (bg: BackgroundConfig) => void;
  onOpenPane: (id: string) => void;
  onClosePane: (id: string) => void;
  onOpenJourneyDetail: (j: import("@/shared/types").journeyType) => void;
  onOpenProjectDetail: (p: import("@/shared/types").projectType) => void;
}

export function usePaneContent({
  dict,
  locale,
  githubData,
  spotifyData,
  currentBackground,
  onSelectBackground,
  onOpenPane,
  onClosePane,
  onOpenJourneyDetail,
  onOpenProjectDetail,
}: PaneContentProps): Record<string, React.ReactNode> {
  const { ui, tutorial, landing, journey, project, contact, navbar } = dict;

  return useMemo(
    () => ({
      about: <AboutPane landing={landing} />,
      github: <GitHubPane initialData={githubData} ui={ui} />,
      spotify: (
        <SpotifyPane initialData={spotifyData} ui={ui} locale={locale} />
      ),
      journey: (
        <JourneyPane
          journey={journey}
          onOpenDetail={onOpenJourneyDetail}
          ui={ui}
        />
      ),
      projects: (
        <ProjectsPane
          title={project.title}
          projects={project.projects}
          onOpenDetail={onOpenProjectDetail}
          ui={ui}
        />
      ),
      contact: <ContactPane contact={contact} />,
      settings: (
        <SettingsPane
          navbar={navbar}
          currentLocale={locale}
          currentBackground={currentBackground}
          onSelectBackground={onSelectBackground}
          ui={ui}
          tutorial={tutorial}
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
          onOpenPane={onOpenPane}
          onClosePane={onClosePane}
        />
      ),
      gallery: <ImagePane ui={ui} />,
    }),
    [
      landing,
      githubData,
      ui,
      spotifyData,
      locale,
      journey,
      onOpenJourneyDetail,
      project,
      onOpenProjectDetail,
      contact,
      navbar,
      currentBackground,
      onSelectBackground,
      tutorial,
      onOpenPane,
      onClosePane,
    ],
  );
}
