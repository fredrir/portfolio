"use client";

import Image from "next/image";
import type { projectType, UiStrings } from "@/shared/types";
import ListView from "@/shared/components/list-view";

interface Props {
  title: string;
  projects: projectType[];
  onOpenDetail: (project: projectType) => void;
  ui: UiStrings;
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
          <div
            key={project.id}
            className="flex items-center gap-2 @sm:gap-3 py-1 @sm:py-1.5 px-1.5 @sm:px-2 rounded-md hover:bg-control-hover transition-colors group"
          >
            {thumb && (
              <button
                onClick={() => onOpenDetail(project)}
                className="shrink-0 w-10 h-7 @sm:w-12 @sm:h-8 @lg:w-16 @lg:h-11 rounded-md overflow-hidden border border-control-border bg-background transition-all"
              >
                <Image
                  src={thumb}
                  alt={project.title}
                  width={96}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            )}

            <button
              onClick={() => onOpenDetail(project)}
              className="min-w-0 flex-1 text-left"
            >
              <span className="text-primary font-semibold truncate block group-hover:underline text-2xs @sm:text-xs">
                {project.title}
              </span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {project.languages
                  .split(",")
                  .slice(0, 3)
                  .map((lang, i) => (
                    <span key={i} className="text-3xs @sm:text-2xs text-faded">
                      {lang.trim()}
                      {i <
                        Math.min(
                          2,
                          project.languages.split(",").length - 1,
                        ) && <span className="text-primary-hint ml-1">·</span>}
                    </span>
                  ))}
              </div>
            </button>

            <div className="flex items-center gap-2 shrink-0">
              <p className="text-primary-dim hover:text-primary transition-colors text-2xs">
                ↗
              </p>
            </div>
          </div>
        );
      })}
    </ListView>
  );
}
