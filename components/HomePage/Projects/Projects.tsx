"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import type { projectType } from "@/lib/types/types";
import ProjectDescriptions from "../../../lib/descriptions/ProjectDescription";
import HeaderText from "@/components/HeaderText";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/lib/hooks/UseTheme";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  return (
    <div className="relative min-h-screen w-full py-20" id="projects">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <HeaderText title="Projects" href="#projects" className="mb-4" />
        </div>

        <div className="space-y-40">
          {ProjectDescriptions.map((project, index) => (
            <ProjectSection key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProjectSectionProps {
  project: projectType;
  index: number;
}

function ProjectSection({ project, index }: ProjectSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const theme = useTheme();
  const githubSrc = theme === "dark" ? "/github-dark.svg" : "/github.svg";

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
      className="relative"
    >
      <div
        className={`flex flex-col ${
          isEven ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-8 items-center`}
      >
        <div className="w-full lg:w-2/5 relative">
          <div className="relative aspect-video overflow-hidden rounded-xl border-2 dark:border-gray-800 border-gray-200 shadow-2xl">
            <Image
              src={project.imageUri || "/placeholder.svg"}
              alt={project.title}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-xl bg-gradient-to-br from-gray-400/20 to-gray-400/5 dark:from-gray-600/10 dark:to-gray-600/5"></div>
          {!isEven && (
            <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 rounded-full bg-gray-400/10 dark:bg-gray-600/10 blur-2xl"></div>
          )}
          {isEven && (
            <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 rounded-full bg-gray-400/10 dark:bg-gray-600/10 blur-3xl"></div>
          )}
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
                View Code
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
