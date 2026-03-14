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

  return (
    <div className="p-4 font-mono text-xs h-full flex flex-col overflow-auto">
      <div className="text-muted-foreground/50 mb-3">
        <span className="text-primary">$</span> cat ~/projects/{project.title.toLowerCase().replace(/\s+/g, "-")}/README.md
      </div>

      {thumb && (
        <div className="rounded-lg overflow-hidden border border-primary/15 aspect-video mb-4 max-h-48">
          <Image
            src={thumb}
            alt={project.title}
            width={600}
            height={340}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <h2 className="text-sm font-bold text-primary mb-1">{project.title}</h2>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.languages.split(",").map((lang, i) => (
          <span
            key={i}
            className="px-1.5 py-0.5 rounded text-2xs bg-primary/10 text-primary/70"
          >
            {lang.trim()}
          </span>
        ))}
      </div>

      <p className="text-muted-foreground leading-relaxed text-xs mb-3">
        {project.description}
      </p>

      <div className="flex gap-4 pt-2 border-t border-primary/10">
        {project.websiteLink && (
          <Link
            href={project.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors text-xs font-semibold"
          >
            {project.websiteAlias ||
              project.websiteLink
                .replace(/https?:\/\//, "")
                .replace(/\/$/, "")}{" "}
            ↗
          </Link>
        )}
        {project.githubLink && (
          <Link
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {viewCode} ↗
          </Link>
        )}
      </div>
    </div>
  );
}
