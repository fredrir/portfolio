import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import { TutorialOverlay } from "@/tutorial";
import { AppLauncher } from "./launcher/components/app-launcher";
import { FloatingDetail } from "./overlays/components/floating-detail";
import { DragGhost } from "./overlays/components/drag-ghost";

const AboutPaneLazy = lazy(() =>
  import("@/panes/about").then((m) => ({ default: m.AboutPane })),
);

// Client-only: the about pane renders a three.js canvas that must not SSR.
function AboutPane(props: ComponentProps<typeof AboutPaneLazy>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <AboutPaneLazy {...props} />
    </Suspense>
  );
}
import { GitHubPane } from "@/panes/github";
import { SpotifyPane } from "@/panes/spotify";
import { JourneyPane } from "@/panes/journey";
import { ProjectsPane } from "@/panes/projects";
import { ContactPane } from "@/panes/contact";
import { SettingsPane } from "@/panes/settings";
import { TerminalPane } from "@/terminal";
import { ImagePane } from "@/panes/gallery";
import { EngineeringPane } from "@/panes/engineering";
import { DeploymentsPane } from "@/panes/deployments";
import { MediaLabPane } from "@/panes/medialab";
import { AnalyticsPane } from "@/panes/analytics";
import { PaneHost } from "@/shared/components/pane-host";
import { WINDOW_CONFIGS, configMap } from "./constants";
import type { WindowConfig } from "./types";
import type { useTutorial } from "@/tutorial/use-tutorial";
import type { useTiling } from "./tiling/hooks/use-tiling";
import type { useBackground } from "./background/hooks/use-background";
import type { useFocus } from "./shell/hooks/use-focus";
import type { useFloatingDetail } from "./overlays/hooks/use-floating-detail";
import type { GitHubData, SpotifyData } from "@/shared/types";
import type { DictType, Locale } from "@/i18n/types";
import { StatusBar } from "./status-bar";

interface ViewContext {
  dict: DictType;
  locale: Locale;
  isMobile: boolean | null;
  tutorial: ReturnType<typeof useTutorial>;
  wm: ReturnType<typeof useTiling>;
  bg: ReturnType<typeof useBackground>;
  focus: ReturnType<typeof useFocus>;
  floating: ReturnType<typeof useFloatingDetail>;
  githubData: GitHubData | null;
  spotifyData: SpotifyData | null;
}

const POST_PANE_STEPS = new Set(["launcher", "drag", "resize"]);

export type LayoutMode = "loading" | "mobile" | "maximized" | "desktop";

export function useWindowManagerView(ctx: ViewContext) {
  const {
    dict,
    locale,
    isMobile,
    tutorial,
    wm,
    bg,
    focus,
    floating,
    githubData,
    spotifyData,
  } = ctx;
  const { ui, tutorial: tutorialStrings, landing, journey, project, contact, navbar } = dict;

  const tutorialIsFloating =
    tutorial.isActive &&
    tutorial.step != null &&
    POST_PANE_STEPS.has(tutorial.step.id);
  const tutorialIsFullscreen = tutorial.isActive && !tutorialIsFloating;

  const layoutMode: LayoutMode = (() => {
    if (isMobile === null) return "loading";
    if (isMobile) return "mobile";
    const { maximizedId, states } = wm;
    if (maximizedId != null && states[maximizedId]?.isOpen) return "maximized";
    return "desktop";
  })();

  const maximizedConfig: WindowConfig = configMap[wm.maximizedId!];

  const paneContent = useMemo<Record<string, React.ReactNode>>(
    () => ({
      about: <AboutPane landing={landing} />,
      github: <GitHubPane initialData={githubData} ui={ui} />,
      spotify: <SpotifyPane initialData={spotifyData} ui={ui} locale={locale} />,
      journey: (
        <JourneyPane
          journey={journey}
          onOpenDetail={floating.openJourneyDetail}
          ui={ui}
        />
      ),
      projects: (
        <ProjectsPane
          title={project.title}
          projects={project.projects}
          onOpenDetail={floating.openProjectDetail}
          ui={ui}
        />
      ),
      contact: <ContactPane contact={contact} />,
      settings: (
        <SettingsPane
          navbar={navbar}
          currentLocale={locale}
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
          onOpenPane={focus.openPane}
          onClosePane={wm.closeWindow}
        />
      ),
      gallery: <ImagePane ui={ui} />,
      engineering: (
        <PaneHost>
          <EngineeringPane />
        </PaneHost>
      ),
      deployments: (
        <PaneHost>
          <DeploymentsPane />
        </PaneHost>
      ),
      medialab: (
        <PaneHost>
          <MediaLabPane />
        </PaneHost>
      ),
      analytics: (
        <PaneHost>
          <AnalyticsPane />
        </PaneHost>
      ),
    }),
    [
      dict,
      locale,
      githubData,
      spotifyData,
      bg.current,
      bg.setBackground,
      floating.openJourneyDetail,
      floating.openProjectDetail,
      focus.openPane,
      wm.closeWindow,
    ],
  );

  const statusBar = (
    <StatusBar
      locale={locale}
      ui={ui}
      onOpenLauncher={() => wm.setLauncherOpen(true)}
      onOpenSettings={focus.openSettings}
    />
  );

  const tutorialOverlay =
    tutorial.isActive && tutorial.step ? (
      <TutorialOverlay
        t={tutorialStrings}
        ui={ui}
        currentLocale={locale}
        tutorial={tutorial}
        floating={tutorialIsFloating}
        isMobile={isMobile === true}
        launcherOpen={wm.launcherOpen}
        background={bg}
      />
    ) : null;

  const floatingDetail = floating.detail ? (
    <FloatingDetail title={floating.detail.title} onClose={floating.close}>
      {floating.detail.content}
    </FloatingDetail>
  ) : null;

  const appLauncher = wm.launcherOpen ? (
    <AppLauncher
      states={wm.states}
      ui={ui}
      locale={locale}
      onOpen={focus.openPane}
      onStop={wm.closeWindow}
      onClose={() => wm.setLauncherOpen(false)}
    />
  ) : null;

  const { dragTarget, dragPos, dragSize } = wm.drag;
  const dragGhost =
    dragTarget && dragPos && dragSize && configMap[dragTarget] ? (
      <DragGhost config={configMap[dragTarget]} pos={dragPos} size={dragSize}>
        {paneContent[dragTarget]}
      </DragGhost>
    ) : null;

  return {
    paneContent,
    layoutMode,
    maximizedConfig,
    tutorialIsFloating,
    tutorialIsFullscreen,
    statusBar,
    tutorialOverlay,
    floatingDetail,
    appLauncher,
    dragGhost,
  };
}
