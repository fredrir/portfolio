"use client";
import { useTheme } from "@/lib/hooks/UseTheme";
import { projectType } from "@/lib/types/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: projectType;
}

const ProjectCard = ({ project }: Props) => {
  const theme = useTheme();
  const githubSrc = theme === "dark" ? "/github-dark.svg" : "/github.svg";

  return (
    <div className="w-full border-solid border-2 dark:border-white dark:bg-gray-800 bg-white border-gray-700 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-700">
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
        <h2 className="text-sm text-gray-600 dark:text-gray-300">
          {project.languages}
        </h2>
        <p className="mt-2">{project.description}</p>
        <div className="pt-4 flex justify-center items-center">
          <Link href={project.githubLink}>
            {/* <Button title={"Read more"} color={"white"} /> */}
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
