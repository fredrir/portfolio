import React from "react";
import ProjectCard from "./ProjectCard";
import ProjectDescriptions from "../../../lib/descriptions/ProjectDescription";

const Projects = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="pb-32">
        <div className="bg-white dark:bg-gray-900 dark:text-white rounded-3xl px-4 py-2 mt-4 w-fit text-center">
          <h1 className="text-4xl font-bold">Projects</h1>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-4 py-5 px-12 gap-20 items-center max-w-lg border-solid rounded-2xl overflow-hidden">
        {ProjectDescriptions.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
