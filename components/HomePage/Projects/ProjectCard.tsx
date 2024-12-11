"use client";
import Button from "@/components/Button";
import { useTheme } from "@/lib/hooks/UseTheme";
import { projectType } from "@/lib/types/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: projectType;
}

const ProjectCard = ({ project }: Props) => {
  const { theme, background, text } = useTheme();
  const githubSrc = theme === "light" ? "/github.svg" : "/github-dark.svg";

  return (
    <div
      className={`w-full border-solid border-2 dark:border-white ${background} ${text} border-gray-700 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-700`}
    >
      <div className="flex flex-col relative w-full h-52">
        <Image
          src={project.imageUri}
          alt={project.title}
          fill
          style={{ objectFit: "cover" }}
          className=""
        />
      </div>
      <div className="p-4 ">
        <h1 className="text-xl font-bold">{project.title}</h1>
        <h2 className={`text-sm`}>{project.languages}</h2>
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
          <Link href={project.githubLink}>
            <Image
              src={githubSrc}
              alt={"Logo og Github"}
              width={30}
              height={30}
              className="hover:scale-110 transition-transform duration-700 cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
