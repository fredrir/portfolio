import { projectType } from "@/lib/types";
import Image from "next/image";
import Button from "../Button";

interface Props {
  project: projectType;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-900 max-w-lg border-solid rounded-2xl overflow-hidden">
      <div className="relative w-full h-52">
        <Image
          src={project.imageUri}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
        />
      </div>
      <div className="p-4">
        <h1 className="text-xl font-bold">{project.title}</h1>
        <h2 className="text-sm text-gray-600 dark:text-gray-300">
          {project.languages}
        </h2>
        <p className="mt-2">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
