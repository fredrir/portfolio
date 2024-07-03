import React from "react";
import ProjectCard from "./ProjectCard";
import ProjectDescriptions from "../../lib/ProjectDescription";

const Projects = () => {
  return (
    <div>
      <div className="flex justify-center items-center py-32">
        <div className="bg-white dark:bg-gray-900 dark:text-white rounded-3xl px-4 py-2 mt-4 w-fit text-center">
          <h1 className="text-2xl font-bold">Projects</h1>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-4 px-12">
        {ProjectDescriptions.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
