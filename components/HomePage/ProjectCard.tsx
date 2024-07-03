import { projectType } from "@/lib/types";

interface Props {
  project: projectType;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-900 max-w-lg p-4 border-solid border-4 border-gray-400 dark dark:border-gray-700">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
    </div>
  );
};

export default ProjectCard;
