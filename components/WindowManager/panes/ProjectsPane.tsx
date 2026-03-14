"use client";

import Image from "next/image";
import type { projectType } from "@/lib/types/types";

interface Props {
  title: string;
  projects: projectType[];
  viewCode: string;
  onOpenDetail: (project: projectType) => void;
}

export function ProjectsPane({ projects, onOpenDetail }: Props) {
  return (
    <div className="p-3 font-mono text-xs h-full flex flex-col">
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> ls ~/projects/
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid gap-1">
          {projects.map((project) => {
            const thumb =
              project.desktopImage ||
              (project.mobileImages && project.mobileImages[0]);

            return (
              <button
                key={project.id}
                onClick={() => onOpenDetail(project)}
                className="w-full text-left flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-primary/5 transition-colors group"
              >
                {thumb && (
                  <div className="shrink-0 w-10 h-7 rounded overflow-hidden border border-primary/10 bg-background">
                    <Image
                      src={thumb}
                      alt={project.title}
                      width={80}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-accent-blue/70 shrink-0 text-2xs">

                    </span>
                    <span className="text-primary font-semibold truncate group-hover:underline">
                      {project.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {project.languages
                      .split(",")
                      .slice(0, 3)
                      .map((lang, i) => (
                        <span
                          key={i}
                          className="text-2xs text-muted-foreground/50"
                        >
                          {lang.trim()}
                          {i <
                            Math.min(
                              2,
                              project.languages.split(",").length - 1,
                            ) && (
                            <span className="text-primary/20 ml-1">·</span>
                          )}
                        </span>
                      ))}
                  </div>
                </div>

                <span className="text-primary/20 group-hover:text-primary/50 transition-colors shrink-0">
                  ↗
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-1 border-t border-primary/10 text-muted-foreground/30 text-2xs mt-1 flex justify-between">
        <span>{projects.length} projects</span>
        <span className="text-primary/30">click to open</span>
      </div>
    </div>
  );
}
