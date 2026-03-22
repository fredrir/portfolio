import { TutorialOverlay } from "@/tutorial";
import { AppLauncher } from "./components/app-launcher";
import { FloatingDetail } from "./components/floating-detail";
import { DragGhost } from "./components/drag-ghost";
import { AboutPane } from "@/panes/about";
import { GitHubPane } from "@/panes/github";
import { SpotifyPane } from "@/panes/spotify";
import { JourneyPane } from "@/panes/journey";
import { ProjectsPane } from "@/panes/projects";
import { ContactPane } from "@/panes/contact";
import { SettingsPane } from "@/panes/settings";
import { TerminalPane } from "@/terminal";
import { ImagePane } from "@/panes/gallery";
import { WINDOW_CONFIGS, configMap } from "./constants";
import type { useTutorial } from "@/tutorial/use-tutorial";
import type { useWindowManager } from "./hooks/use-window-manager";
import type { useBackground } from "./hooks/use-background";
import type { useFocus } from "./hooks/use-focus";
import type { useFloatingDetail } from "./hooks/use-floating-detail";
import type { GitHubData, SpotifyData } from "@/shared/types";
import type { DictType, Locale } from "@/i18n/types";

interface ViewContext {
  dict: DictType;
  locale: Locale;
  isMobile: boolean | null;
  tutorial: ReturnType<typeof useTutorial>;
  wm: ReturnType<typeof useWindowManager>;
  bg: ReturnType<typeof useBackground>;
  focus: ReturnType<typeof useFocus>;
  floating: ReturnType<typeof useFloatingDetail>;
  githubData: GitHubData | null;
  spotifyData: SpotifyData;
}

const POST_PANE_STEPS = new Set(["launcher", "drag", "resize"]);

export class WindowManagerView {
  readonly paneContent: Record<string, React.ReactNode>;
  readonly tutorialIsFloating: boolean;
  readonly tutorialIsFullscreen: boolean;

  constructor(private ctx: ViewContext) {
    this.paneContent = this.buildPaneContent();

    this.tutorialIsFloating =
      ctx.tutorial.isActive &&
      ctx.tutorial.step != null &&
      POST_PANE_STEPS.has(ctx.tutorial.step.id);
    this.tutorialIsFullscreen =
      ctx.tutorial.isActive && !this.tutorialIsFloating;
  }

  private buildPaneContent(): Record<string, React.ReactNode> {
    const { dict, locale, githubData, spotifyData, bg, focus, wm, floating } =
      this.ctx;
    const { ui, tutorial, landing, journey, project, contact, navbar } = dict;

    return {
      about: <AboutPane landing={landing} />,
      github: <GitHubPane initialData={githubData} ui={ui} />,
      spotify: (
        <SpotifyPane initialData={spotifyData} ui={ui} locale={locale} />
      ),
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
          onOpenPane={focus.openPane}
          onClosePane={wm.closeWindow}
        />
      ),
      gallery: <ImagePane ui={ui} />,
    };
  }

  get tutorialOverlay(): React.ReactNode {
    const { tutorial, wm, bg, dict, locale, isMobile } = this.ctx;
    if (!tutorial.isActive || !tutorial.step) return null;
    return (
      <TutorialOverlay
        t={dict.tutorial}
        ui={dict.ui}
        currentLocale={locale}
        tutorial={tutorial}
        floating={this.tutorialIsFloating}
        isMobile={isMobile === true}
        launcherOpen={wm.launcherOpen}
        background={bg}
      />
    );
  }

  get floatingDetail(): React.ReactNode {
    const { floating } = this.ctx;
    if (!floating.detail) return null;
    return (
      <FloatingDetail title={floating.detail.title} onClose={floating.close}>
        {floating.detail.content}
      </FloatingDetail>
    );
  }

  get appLauncher(): React.ReactNode {
    const { wm, dict, locale, focus } = this.ctx;
    if (!wm.launcherOpen) return null;
    return (
      <AppLauncher
        states={wm.states}
        ui={dict.ui}
        locale={locale}
        onOpen={focus.openPane}
        onStop={wm.closeWindow}
        onClose={() => wm.setLauncherOpen(false)}
      />
    );
  }

  get dragGhost(): React.ReactNode {
    const { dragTarget, dragPos, dragSize } = this.ctx.wm.drag;
    if (!dragTarget || !dragPos || !dragSize || !configMap[dragTarget])
      return null;
    return (
      <DragGhost config={configMap[dragTarget]} pos={dragPos} size={dragSize}>
        {this.paneContent[dragTarget]}
      </DragGhost>
    );
  }
}
