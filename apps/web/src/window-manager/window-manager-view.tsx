import {
  type ComponentProps,
  lazy,
  type ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DictType, Locale } from "@/i18n/types";
import { PaneHost } from "@/shared/components/pane-host";
import type { GitHubData, SpotifyData, WeatherData } from "@/shared/types";
import type { useTutorial } from "@/tutorial/use-tutorial";
import type { useBackground } from "./background/hooks/use-background";
import { configMap, PANE_IDS } from "./constants";
import { AppLauncher } from "./launcher/components/app-launcher";
import { DesktopPaneLauncher } from "./launcher/components/desktop-pane-launcher";
import { DragGhost } from "./overlays/components/drag-ghost";
import { FloatingDetail } from "./overlays/components/floating-detail";
import type { useFloatingDetail } from "./overlays/hooks/use-floating-detail";
import type { useFocus } from "./shell/hooks/use-focus";
import { StatusBar } from "./status-bar";
import type { useTiling } from "./tiling/hooks/use-tiling";
import type { WindowConfig } from "./types";

const AboutPaneLazy = lazy(() => import("@/panes/about").then((m) => ({ default: m.AboutPane })));
const AnalyticsPaneLazy = lazy(() =>
  import("@/panes/analytics").then((m) => ({ default: m.AnalyticsPane })),
);
const ContactPaneLazy = lazy(() =>
  import("@/panes/contact").then((m) => ({ default: m.ContactPane })),
);
const EngineeringPaneLazy = lazy(() =>
  import("@/panes/engineering").then((m) => ({ default: m.EngineeringPane })),
);
const GitHubPaneLazy = lazy(() =>
  import("@/panes/github").then((m) => ({ default: m.GitHubPane })),
);
const ImagePaneLazy = lazy(() => import("@/panes/gallery").then((m) => ({ default: m.ImagePane })));
const JourneyPaneLazy = lazy(() =>
  import("@/panes/journey").then((m) => ({ default: m.JourneyPane })),
);
const ProjectsPaneLazy = lazy(() =>
  import("@/panes/projects").then((m) => ({ default: m.ProjectsPane })),
);
const SettingsPaneLazy = lazy(() =>
  import("@/panes/settings").then((m) => ({ default: m.SettingsPane })),
);
const SpotifyPaneLazy = lazy(() =>
  import("@/panes/listening").then((m) => ({ default: m.SpotifyPane })),
);
const TerminalPaneLazy = lazy(() =>
  import("@/terminal").then((m) => ({ default: m.TerminalPane })),
);
const TutorialOverlayLazy = lazy(() =>
  import("@/tutorial").then((m) => ({ default: m.TutorialOverlay })),
);

function SuspendedPane({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

// Client-only: the about pane renders a three.js canvas that must not SSR.
function AboutPane(props: ComponentProps<typeof AboutPaneLazy>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <SuspendedPane>
      <AboutPaneLazy {...props} />
    </SuspendedPane>
  );
}

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
  weatherData: WeatherData | null;
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
    weatherData,
  } = ctx;
  const { ui, tutorial: tutorialStrings, landing, journey, project, contact, navbar } = dict;

  const tutorialIsFloating =
    tutorial.isActive && tutorial.step != null && POST_PANE_STEPS.has(tutorial.step.id);
  const tutorialIsFullscreen = tutorial.isActive && !tutorialIsFloating;

  const layoutMode: LayoutMode = (() => {
    if (isMobile === null) return "loading";
    if (isMobile) return "mobile";
    const { maximizedId, states } = wm;
    if (maximizedId != null && states[maximizedId]?.isOpen) return "maximized";
    return "desktop";
  })();

  const maximizedConfig: WindowConfig = configMap[wm.maximizedId!];
  const hasOpenPanes = Object.values(wm.states).some((state) => state.isOpen);

  const paneContent = useMemo<Record<string, ReactNode>>(
    () => ({
      about: <AboutPane landing={landing} />,
      github: (
        <SuspendedPane>
          <GitHubPaneLazy initialData={githubData} ui={ui} />
        </SuspendedPane>
      ),
      spotify: (
        <SuspendedPane>
          <SpotifyPaneLazy initialData={spotifyData} ui={ui} locale={locale} />
        </SuspendedPane>
      ),
      journey: (
        <SuspendedPane>
          <JourneyPaneLazy journey={journey} onOpenDetail={floating.openJourneyDetail} ui={ui} />
        </SuspendedPane>
      ),
      projects: (
        <SuspendedPane>
          <ProjectsPaneLazy
            title={project.title}
            projects={project.projects}
            onOpenDetail={floating.openProjectDetail}
            ui={ui}
          />
        </SuspendedPane>
      ),
      contact: (
        <SuspendedPane>
          <ContactPaneLazy contact={contact} />
        </SuspendedPane>
      ),
      settings: (
        <SuspendedPane>
          <SettingsPaneLazy
            navbar={navbar}
            currentLocale={locale}
            currentBackground={bg.current}
            onSelectBackground={bg.setBackground}
            ui={ui}
            tutorial={tutorialStrings}
          />
        </SuspendedPane>
      ),
      terminal: (
        <SuspendedPane>
          <TerminalPaneLazy
            locale={locale}
            paneIds={PANE_IDS}
            projects={project.projects.map((p) => ({ title: p.title }))}
            careers={journey.journeys.map((j) => ({
              jobTitle: j.jobTitle,
              company: j.company,
            }))}
            onOpenPane={focus.openPane}
            onClosePane={wm.closeWindow}
          />
        </SuspendedPane>
      ),
      gallery: (
        <SuspendedPane>
          <ImagePaneLazy ui={ui} />
        </SuspendedPane>
      ),
      engineering: (
        <PaneHost>
          <SuspendedPane>
            <EngineeringPaneLazy ui={ui} />
          </SuspendedPane>
        </PaneHost>
      ),
      analytics: (
        <PaneHost>
          <SuspendedPane>
            <AnalyticsPaneLazy ui={ui} />
          </SuspendedPane>
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
      weather={weatherData}
      onOpenLauncher={() => wm.setLauncherOpen(true)}
      onOpenSettings={focus.openSettings}
    />
  );

  const tutorialOverlay =
    tutorial.isActive && tutorial.step ? (
      <SuspendedPane>
        <TutorialOverlayLazy
          t={tutorialStrings}
          ui={ui}
          currentLocale={locale}
          tutorial={tutorial}
          floating={tutorialIsFloating}
          isMobile={isMobile === true}
          launcherOpen={wm.launcherOpen}
          background={bg}
        />
      </SuspendedPane>
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

  const desktopPaneLauncher = (
    <DesktopPaneLauncher states={wm.states} ui={ui} onOpen={focus.openPane} />
  );

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
    hasOpenPanes,
    tutorialIsFloating,
    tutorialIsFullscreen,
    statusBar,
    tutorialOverlay,
    floatingDetail,
    appLauncher,
    desktopPaneLauncher,
    dragGhost,
  };
}
