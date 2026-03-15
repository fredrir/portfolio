"use client";

import Image from "next/image";
import Link from "next/link";
import type { projectType, UiStrings } from "@/shared/types";

interface Props {
  project: projectType;
  viewCode: string;
  ui: UiStrings;
}

export function ProjectDetailPane({ project, viewCode, ui }: Props) {
  const thumb =
    project.desktopImage || (project.mobileImages && project.mobileImages[0]);
  const slug = project.title.toLowerCase().replace(/\s+/g, "-");
  const langs = project.languages.split(",").map((l) => l.trim());

  return (
    <div className="font-mono text-xs h-full flex flex-col overflow-auto">
      <div className="px-4 py-2 border-b border-primary/10 bg-primary/[0.02] text-muted-foreground/40 shrink-0">
        <span className="text-primary">$</span> man {slug}
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div>
          <div className="text-muted-foreground/40 text-2xs tracking-widest uppercase mb-1">
            {slug}(1)
          </div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            {project.title}
          </h2>
        </div>

        {thumb && (
          <div className="rounded-lg overflow-hidden border border-primary/15 bg-black/10">
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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              {ui.about}
            </span>
            <div className="flex-1 h-px bg-primary/10" />
          </div>
          <p className="text-muted-foreground leading-relaxed text-xs">
            {project.description}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary font-bold text-xs uppercase tracking-wider">
              {ui.techStack}
            </span>
            <div className="flex-1 h-px bg-primary/10" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {langs.map((lang, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-2xs border border-primary/20 bg-primary/[0.06] text-primary/90 font-medium"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {(project.websiteLink || project.githubLink) && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary font-bold text-xs uppercase tracking-wider">
                {ui.links}
              </span>
              <div className="flex-1 h-px bg-primary/10" />
            </div>
            <div className="space-y-1.5">
              {project.websiteLink && (
                <Link
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-primary/15 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <span className="text-primary/50 group-hover:text-primary">
                    →
                  </span>
                  <span className="text-foreground group-hover:text-primary transition-colors text-xs">
                    {project.websiteAlias ||
                      project.websiteLink
                        .replace(/https?:\/\//, "")
                        .replace(/\/$/, "")}
                  </span>
                </Link>
              )}
              {project.githubLink && (
                <Link
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-primary/15 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <span className="text-primary/50 group-hover:text-primary">
                    →
                  </span>
                  <span className="text-muted-foreground/70 group-hover:text-primary transition-colors text-xs">
                    {viewCode}
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-primary/10 bg-primary/[0.02] text-muted-foreground/30 text-2xs shrink-0 flex justify-between">
        <span>{slug}(1)</span>
        <span>fredrir@hansteen</span>
      </div>
    </div>
  );
}
