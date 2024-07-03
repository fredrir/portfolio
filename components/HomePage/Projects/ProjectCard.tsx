import { projectType } from "@/lib/types/types";
import Image from "next/image";
import Button from "../../Button";
import Link from "next/link";

interface Props {
  project: projectType;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-900 w-full border-solid rounded-2xl overflow-hidden">
      <div className="flex flex-col relative w-full h-52">
        <Image
          src={project.imageUri}
          alt={project.title}
          layout="fill"
          style={{ objectFit: "cover" }}
          className="rounded-t-2xl"
        />
      </div>
      <div className="p-4">
        <h1 className="text-xl font-bold">{project.title}</h1>
        <h2 className="text-sm text-gray-600 dark:text-gray-300">
          {project.languages}
        </h2>
        <p className="mt-2">{project.description}</p>
        <div className="pt-4 flex justify-center items-center">
          <Link href={project.githubLink}>
            <button
              type="button"
              className={
                "font-medium text-center py-3 px-2 transition-all rounded-lg shadow-sm focus:ring focus:ring-primary-200 inline-flex items-center gap-4 bg-portfolio-white text-online-darkBlue hover:text-portfolio-darkBlue border dark:bg-inherit dark:text-white dark:hover:text-gray-300 dark:hover:border-gray-300"
              }
            >
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
