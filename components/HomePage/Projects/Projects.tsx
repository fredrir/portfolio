"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import type { projectType } from "@/lib/types/types";
import HeaderText from "@/components/HeaderText";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";

interface Props {
  title: string;
  viewCode: string;
  projects: projectType[];
}

const Projects = ({ title, projects, viewCode }: Props) => {
  return (
    <div className="relative min-h-screen w-full py-20" id="projects">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <HeaderText title={title} href="#projects" className="mb-4" />
        </div>

        <div className="space-y-40">
          {projects.map((project, index) => (
            <ProjectSection
              key={project.id}
              project={project}
              index={index}
              viewCode={viewCode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProjectSectionProps {
  viewCode: string;
  project: projectType;
  index: number;
}

function ProjectSection({ project, index, viewCode }: ProjectSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });
  const { theme } = useTheme();
  const githubSrc = theme === "dark" ? "/github-dark.svg" : "/github.svg";
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative transition-opacity duration-700 ease-out ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transitionDelay: "100ms",
        transitionProperty: "opacity, transform",
      }}
    >
      <div
        className={`flex flex-col ${
          isEven ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-8 items-center`}
      >
        <div className="w-full lg:w-2/5 relative">
          <div className="relative">
            {project.desktopImage && (
              <div className="relative aspect-video overflow-hidden rounded-xl border-2 dark:border-gray-800 border-gray-200 shadow-2xl">
                <Image
                  src={project.desktopImage || "/placeholder.svg"}
                  alt={`${project.title} desktop view`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority={index < 2}
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-700 hover:scale-105"
                />
              </div>
            )}

            {project.mobileImages && project.mobileImages.length > 0 && (
              <div className="flex justify-between ">
                {project.mobileImages.map((mobileImg, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`relative h-40 w-20  md:h-80 md:w-40 overflow-hidden rounded-xl border-2 dark:border-gray-800 border-gray-200 shadow-xl transform ${
                      imgIndex % 2 === 0 ? "translate-y-4" : ""
                    }`}
                    style={{
                      transform: `rotate(${
                        imgIndex % 2 === 0 ? "3" : "-3"
                      }deg)`,
                    }}
                  >
                    <Image
                      src={mobileImg || "/placeholder.svg"}
                      alt={`${project.title} mobile view ${imgIndex + 1}`}
                      fill
                      sizes="20vw"
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-3/5 space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {project.title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.languages.split(",").map((lang, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  {lang.trim()}
                </span>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center pt-4">
            {project.websiteLink && (
              <Link
                href={project.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                  {project.websiteAlias ||
                    project.websiteLink
                      .replace(/https?:\/\//, "")
                      .replace(/\/$/, "")}
                </button>
              </Link>
            )}
            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Image
                    src={githubSrc || "/placeholder.svg"}
                    alt="GitHub"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  {viewCode}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
