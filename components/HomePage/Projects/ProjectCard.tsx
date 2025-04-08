"use client";
import Button from "@/components/Button";
import { projectType } from "@/lib/types/types";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: projectType;
}

const ProjectCard = ({ project }: Props) => {
  const { theme } = useTheme();
  const githubSrc = theme === "dark" ? "/github-dark.svg" : "/github.svg";

  return (
    <div className="w-full border-solid border-2 dark:border-gray-600 border-gray-400 rounded-2xl overflow-hidden ">
      <div className="flex flex-col relative w-full h-52">
        <Image
          src={project.imageUri}
          alt={project.title}
          fill
          style={{ objectFit: "cover" }}
          className="border-b-2 border-solid border-gray-400 dark:border-gray-600"
        />
      </div>
      <div className="p-4 ">
        <h1 className="text-xl font-bold">{project.title}</h1>
        <h2 className="text-sm text-gray-600 dark:text-gray-300">
          {project.languages}
        </h2>
        <p className="mt-2">{project.description}</p>
        <div className="pt-4 flex flex-row justify-around items-center">
          {project.websiteLink && (
            <Link href={project.websiteLink}>
              <Button
                title={
                  project.websiteAlias
                    ? project.websiteAlias
                    : project.websiteLink
                        .replace(/https?:\/\//, "")
                        .replace(/\/$/, "")
                }
                color={"white"}
              />
            </Link>
          )}
          {project.githubLink && (
            <Link href={project.githubLink}>
              <Image
                src={githubSrc}
                alt={"Logo og Github"}
                width={30}
                height={30}
                className="hover:scale-110 transition-transform duration-700 cursor-pointer"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
