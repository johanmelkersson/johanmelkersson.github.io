import ProjectCard from "../components/ProjectCard";
import { PROJECTS_DATA } from "../data/projects";
import styles from "./ProjectsPage.module.css"; // Importera modulen!

function ProjectsPage() {
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Mina Projekt</h2>
      <div className={styles.projectsGrid}>
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