"use client";

import { useState } from "react";
import type { projectType } from "@/lib/types/types";
import Link from "next/link";

interface Props {
  title: string;
  projects: projectType[];
  viewCode: string;
}

export function ProjectsPane({ projects, viewCode }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = projects.find((p) => p.id === selectedId);

  return (
    <div className="p-3 font-mono text-xs h-full flex flex-col">
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> ls -la ~/projects/
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="text-muted-foreground/40 text-2xs mb-1">
          total {projects.length}
        </div>

        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() =>
              setSelectedId(selectedId === project.id ? null : project.id)
            }
            className={`w-full text-left py-1 px-1 rounded transition-colors flex items-baseline gap-2 ${
              selectedId === project.id
                ? "bg-primary/10"
                : "hover:bg-primary/5"
            }`}
          >
            <span className="text-accent-blue/60 shrink-0">drwxr-xr-x</span>
            <span className="text-accent-yellow/50 shrink-0 w-14">fredrir</span>
            <span className="text-primary font-semibold truncate">
              {project.title}
            </span>
          </button>
        ))}

        {selected && (
          <div className="mt-2 pt-2 border-t border-primary/10 space-y-2">
            <div className="text-muted-foreground/50 text-2xs">
              <span className="text-primary">$</span> cat
              ~/projects/{selected.title}/README.md
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {selected.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {selected.languages.split(",").map((lang, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-2xs bg-primary/10 text-primary/70"
                >
                  {lang.trim()}
                </span>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              {selected.websiteLink && (
                <Link
                  href={selected.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/60 hover:text-primary transition-colors text-2xs"
                >
                  {selected.websiteAlias ||
                    selected.websiteLink
                      .replace(/https?:\/\//, "")
                      .replace(/\/$/, "")}
                </Link>
              )}
              {selected.githubLink && (
                <Link
                  href={selected.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/50 hover:text-primary transition-colors text-2xs"
                >
                  {viewCode}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-1 border-t border-primary/10 text-muted-foreground/30 text-2xs mt-1">
        {projects.length} projects
      </div>
    </div>
  );
}
