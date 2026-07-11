"use client";

import { GithubLogoIcon, LinkIcon } from "@phosphor-icons/react/dist/ssr";
import type { UiStrings } from "@/i18n/types";
import Image from "@/shared/components/image";
import type { projectType } from "@/shared/types";

interface Props {
  project: projectType;
  viewCode: string;
  ui: UiStrings;
}

function MobileScreensShowcase({ images }: { images: string[] }) {
  return (
    <div className="flex items-end justify-center gap-3 px-2 py-3">
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
            <div className="w-[100px] overflow-hidden rounded-xl border-2 border-border-medium bg-black shadow-lg">
              <div className="flex h-1.5 w-full items-center justify-center bg-black">
                <div className="h-0.5 w-6 rounded-full bg-border-medium" />
              </div>
              <Image src={src} alt="" width={200} height={400} className="h-auto w-full" />
              <div className="h-1 w-full bg-black" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LaptopShowcase({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex justify-center px-2 py-3">
      <div className="w-full max-w-[340px]">
        <div className="overflow-hidden rounded-t-lg border border-border-medium border-b-0 bg-black shadow-lg">
          <div className="flex items-center gap-1.5 border-border-medium border-b bg-surface-dim px-2.5 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-terminal-close" />
            <div className="h-1.5 w-1.5 rounded-full bg-terminal-minimize" />
            <div className="h-1.5 w-1.5 rounded-full bg-terminal-maximize" />
          </div>
          <Image src={src} alt={alt} width={600} height={340} className="h-auto w-full" />
        </div>
        <div
          className="mx-auto h-2.5 rounded-b-sm bg-border-medium"
          style={{ width: "108%", marginLeft: "-4%" }}
        />
        <div className="mx-auto h-1 rounded-b-md bg-border-medium/60" style={{ width: "40%" }} />
      </div>
    </div>
  );
}

export function ProjectDetailPane({ project, viewCode, ui }: Props) {
  const isMobileApp = project.mobileImages && project.mobileImages.length > 0;
  const thumb = !isMobileApp ? project.desktopImage : null;
  const langs = project.languages.split(",").map((l) => l.trim());

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="flex-1 space-y-4 p-4">
        <div>
          <h2 className="font-bold text-foreground text-lg tracking-tight">{project.title}</h2>
        </div>

        {isMobileApp && <MobileScreensShowcase images={project.mobileImages!} />}

        {thumb && <LaptopShowcase src={thumb} alt={project.title} />}

        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="font-bold text-base text-primary uppercase tracking-wider lg:text-lg">
              {ui.about}
            </span>
            <div className="h-px flex-1 bg-border-faint" />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-bold text-base text-primary uppercase tracking-wider lg:text-lg">
              {ui.techStack}
            </span>
            <div className="h-px flex-1 bg-border-faint" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {langs.map((lang, i) => (
              <span
                key={i}
                className="rounded-md border border-border-medium bg-surface-dim px-2.5 py-1 font-medium text-primary text-xs"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {(project.websiteLink || project.githubLink) && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-bold text-primary text-xs uppercase tracking-wider">
                {ui.links}
              </span>
              <div className="h-px flex-1 bg-border-faint" />
            </div>
            <div className="space-y-1.5">
              {project.websiteLink && (
                <a
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-md border border-wm-border px-3 py-2 transition-all hover:border-control-border-hover hover:bg-control-hover"
                >
                  <span className="text-primary-muted group-hover:text-primary">
                    <LinkIcon className="h-4 w-4 fill-primary group-hover:fill-primary" />
                  </span>
                  <span className="text-foreground text-xs transition-colors group-hover:text-primary">
                    {project.websiteAlias ||
                      project.websiteLink.replace(/https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-md border border-wm-border px-3 py-2 transition-all hover:border-control-border-hover hover:bg-control-hover"
                >
                  <span>
                    <GithubLogoIcon className="h-4 w-4 fill-primary group-hover:fill-primary" />
                  </span>
                  <span className="text-muted-hover text-xs transition-colors group-hover:text-primary">
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
