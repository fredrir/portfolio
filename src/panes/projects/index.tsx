"use client";

import Image from "next/image";
import type { projectType, UiStrings } from "@/shared/types";

interface Props {
  title: string;
  projects: projectType[];
  viewCode: string;
  onOpenDetail: (project: projectType) => void;
  ui: UiStrings;
}

export function ProjectsPane({ projects, viewCode, onOpenDetail, ui }: Props) {
  return (
    <div className="p-2 @sm:p-3 font-mono text-xs h-full flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid gap-0.5 @md:gap-1">
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
                        <span
                          key={i}
                          className="text-3xs @sm:text-2xs text-faded"
                        >
                          {lang.trim()}
                          {i <
                            Math.min(
                              2,
                              project.languages.split(",").length - 1,
                            ) && (
                            <span className="text-primary-hint ml-1">·</span>
                          )}
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
        </div>
      </div>

      <div className="pt-1 border-t border-border-faint text-ghost text-2xs mt-1 flex justify-between">
        <span>{projects.length} {ui.projects}</span>
        <span className="text-primary-subtle">{ui.clickToOpen}</span>
      </div>
    </div>
  );
}
