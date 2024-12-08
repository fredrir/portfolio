import React from "react";
import ProjectCard from "./ProjectCard";
import ProjectDescriptions from "../../../lib/descriptions/ProjectDescription";

const Projects = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="pb-32">
        <div className="bg-white dark:bg-gray-800 dark:text-white rounded-3xl px-4 py-2 mt-4 w-fit text-center border-solid border-2 border-gray-900 dark:border-white">
          <h1 className="text-4xl font-bold">Projects</h1>
        </div>
      </div>
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-screen-xl">
        {ProjectDescriptions.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
