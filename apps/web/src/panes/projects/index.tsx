"use client";

import type { projectType } from "@/shared/types";
import type { UiStrings } from "@/i18n/types";
import ListView from "@/shared/components/list-view";
import ListItem from "@/shared/components/list-item";

interface Props {
  title: string;
  projects: projectType[];
  onOpenDetail: (project: projectType) => void;
  ui: UiStrings;
}

function formatLanguages(languages: string) {
  const langs = languages.split(",").slice(0, 3);
  return (
    <div className="flex flex-wrap gap-1">
      {langs.map((lang, i) => (
        <span key={i} className="text-3xs @sm:text-2xs text-faded">
          {lang.trim()}
          {i < langs.length - 1 && (
            <span className="text-primary-hint ml-1">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function ProjectsPane({ projects, onOpenDetail, ui }: Props) {
  return (
    <ListView
      numberOfItems={projects.length}
      uiEntries={ui.projects}
      uiClickToOpen={ui.clickToOpen}
    >
      {projects.map((project) => {
        const thumb =
          project.desktopImage ||
          (project.mobileImages && project.mobileImages[0]);

        return (
          <ListItem
            key={project.id}
            visual={{ imageSrc: thumb || undefined }}
            title={project.title}
            subtitle={formatLanguages(project.languages)}
            onClick={() => onOpenDetail(project)}
          />
        );
      })}
    </ListView>
  );
}
