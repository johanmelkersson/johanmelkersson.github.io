import ProjectCard from "../components/ProjectCard";
import { PROJECTS_DATA } from "../data/projects";
import styles from "./ProjectsPage.module.css"; // Importera modulen!

function ProjectsPage() {
  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Projects</h2>

      <section>
        <h3 className={styles.sectionLabel}>Game Projects</h3>
        <div className={styles.projectsGrid}>
          {PROJECTS_DATA.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
            />
          ))}
        </div>
      </section>

      {/* System Development-projekt läggs till här när de finns */}
    </div>
  );
}

export default ProjectsPage;