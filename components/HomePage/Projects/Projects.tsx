import React from "react";
import ProjectCard from "./ProjectCard";
import ProjectDescriptions from "../../../lib/descriptions/ProjectDescription";
import HeaderText from "@/components/HeaderText";

const Projects = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <HeaderText title="Projects" href="#projects" />
      <div
        className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-screen-xl"
        id="projects"
      >
        {ProjectDescriptions.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
