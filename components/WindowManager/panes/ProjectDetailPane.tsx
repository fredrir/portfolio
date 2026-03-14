"use client";

import Image from "next/image";
import Link from "next/link";
import type { projectType } from "@/lib/types/types";

interface Props {
  project: projectType;
  viewCode: string;
}

export function ProjectDetailPane({ project, viewCode }: Props) {
  const thumb =
    project.desktopImage ||
    (project.mobileImages && project.mobileImages[0]);
  const slug = project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="p-4 font-mono text-xs h-full flex flex-col overflow-auto gap-3">
      <div className="text-muted-foreground/50">
        <span className="text-primary">$</span> cat ~/projects/{slug}/README.md
      </div>

      <div className="border border-primary/15 rounded-lg overflow-hidden">
        <div className="px-3 py-1.5 bg-primary/[0.03] border-b border-primary/10 flex items-center gap-2">
          <span className="text-primary/40 text-2xs">README.md</span>
          <span className="text-muted-foreground/20 text-2xs">—</span>
          <span className="text-muted-foreground/30 text-2xs">{slug}</span>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-primary/40 text-lg">#</span>
            <h2 className="text-base font-bold text-foreground">
              {project.title}
            </h2>
          </div>

          {thumb && (
            <div className="rounded-lg overflow-hidden border border-primary/10 bg-background">
              <Image
                src={thumb}
                alt={project.title}
                width={600}
                height={340}
                className="w-full h-auto"
              />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary/40 text-sm">##</span>
              <span className="text-sm font-semibold text-foreground/80">
                About
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-5">
              {project.description}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary/40 text-sm">##</span>
              <span className="text-sm font-semibold text-foreground/80">
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pl-5">
              {project.languages.split(",").map((lang, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-md text-2xs border border-primary/15 bg-primary/5 text-primary/80"
                >
                  {lang.trim()}
                </span>
              ))}
            </div>
          </div>

          {(project.websiteLink || project.githubLink) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary/40 text-sm">##</span>
                <span className="text-sm font-semibold text-foreground/80">
                  Links
                </span>
              </div>
              <div className="space-y-1.5 pl-5">
                {project.websiteLink && (
                  <div className="flex items-center gap-2">
                    <span className="text-primary/30">→</span>
                    <Link
                      href={project.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {project.websiteAlias ||
                        project.websiteLink
                          .replace(/https?:\/\//, "")
                          .replace(/\/$/, "")}
                    </Link>
                  </div>
                )}
                {project.githubLink && (
                  <div className="flex items-center gap-2">
                    <span className="text-primary/30">→</span>
                    <Link
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground/60 hover:text-primary hover:underline transition-colors"
                    >
                      {viewCode}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
