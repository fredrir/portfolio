"use client";

import Image from "@/shared/components/image";
import type { projectType } from "@/shared/types";
import type { UiStrings } from "@/i18n/types";
import { GithubLogoIcon, LinkIcon } from "@phosphor-icons/react/dist/ssr";

interface Props {
  project: projectType;
  viewCode: string;
  ui: UiStrings;
}

function MobileScreensShowcase({ images }: { images: string[] }) {
  return (
    <div className="flex justify-center items-end gap-3 py-3 px-2">
      {images.map((src, i) => {
        const isCenter = i === Math.floor(images.length / 2);
        return (
          <div
            key={src}
            className={`relative transition-transform ${isCenter ? "z-10 scale-105" : "z-0 opacity-80"}`}
            style={{
              transform: isCenter
                ? "scale(1.05)"
                : i < Math.floor(images.length / 2)
                  ? "rotate(-3deg) translateY(4px)"
                  : "rotate(3deg) translateY(4px)",
            }}
          >
            <div className="w-[100px] rounded-xl border-2 border-border-medium bg-black overflow-hidden shadow-lg">
              <div className="w-full h-1.5 bg-black flex items-center justify-center">
                <div className="w-6 h-0.5 rounded-full bg-border-medium" />
              </div>
              <Image
                src={src}
                alt=""
                width={200}
                height={400}
                className="w-full h-auto"
              />
              <div className="w-full h-1 bg-black" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LaptopShowcase({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex justify-center py-3 px-2">
      <div className="w-full max-w-[340px]">
        <div className="rounded-t-lg border border-b-0 border-border-medium bg-black overflow-hidden shadow-lg">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-dim border-b border-border-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-close" />
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-minimize" />
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-maximize" />
          </div>
          <Image
            src={src}
            alt={alt}
            width={600}
            height={340}
            className="w-full h-auto"
          />
        </div>
        <div
          className="h-2.5 bg-border-medium rounded-b-sm mx-auto"
          style={{ width: "108%", marginLeft: "-4%" }}
        />
        <div
          className="h-1 bg-border-medium/60 rounded-b-md mx-auto"
          style={{ width: "40%" }}
        />
      </div>
    </div>
  );
}

export function ProjectDetailPane({ project, viewCode, ui }: Props) {
  const isMobileApp = project.mobileImages && project.mobileImages.length > 0;
  const thumb = !isMobileApp ? project.desktopImage : null;
  const langs = project.languages.split(",").map((l) => l.trim());

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="flex-1 p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            {project.title}
          </h2>
        </div>

        {isMobileApp && (
          <MobileScreensShowcase images={project.mobileImages!} />
        )}

        {thumb && <LaptopShowcase src={thumb} alt={project.title} />}

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-primary font-bold text-base lg:text-lg uppercase tracking-wider">
              {ui.about}
            </span>
            <div className="flex-1 h-px bg-border-faint" />
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {project.description}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary font-bold text-base lg:text-lg uppercase tracking-wider">
              {ui.techStack}
            </span>
            <div className="flex-1 h-px bg-border-faint" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {langs.map((lang, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs border border-border-medium bg-surface-dim text-primary font-medium"
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
              <div className="flex-1 h-px bg-border-faint" />
            </div>
            <div className="space-y-1.5">
              {project.websiteLink && (
                <a
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-wm-border hover:border-control-border-hover hover:bg-control-hover transition-all group"
                >
                  <span className="text-primary-muted group-hover:text-primary">
                    <LinkIcon className="group-hover:fill-primary h-4 w-4 fill-primary" />
                  </span>
                  <span className="text-foreground group-hover:text-primary transition-colors text-xs">
                    {project.websiteAlias ||
                      project.websiteLink
                        .replace(/https?:\/\//, "")
                        .replace(/\/$/, "")}
                  </span>
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-wm-border hover:border-control-border-hover hover:bg-control-hover transition-all group"
                >
                  <span>
                    <GithubLogoIcon className="group-hover:fill-primary w-4 h-4 fill-primary" />
                  </span>
                  <span className="text-muted-hover group-hover:text-primary transition-colors text-xs">
                    {viewCode}
                  </span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
