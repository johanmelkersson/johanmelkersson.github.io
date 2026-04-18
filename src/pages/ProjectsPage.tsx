import ProjectCard from "../components/ProjectCard";
import { PROJECTS_DATA } from "../data/projects";

function ProjectsPage() {
  return (
    <div className="page-container">
      <h2>Mina Projekt</h2>
      <div className="projects-grid">
        {PROJECTS_DATA.map((project) => (
          <ProjectCard 
            key={project.id} 
            {...project}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;