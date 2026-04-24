import { useSearchParams } from "react-router-dom";
import GameProjectCard from "../components/GameProjectCard";
import SystemProjectCard from "../components/SystemProjectCard";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import { PROJECTS_DATA, SYSTEM_PROJECTS_DATA, FEATURED_PROJECT } from "../data/projects";
import styles from "./ProjectsPage.module.css";

type Tab = 'games' | 'system';

function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: Tab = searchParams.get('tab') === 'system' ? 'system' : 'games';

  function setActiveTab(tab: Tab) {
    setSearchParams(tab === 'games' ? {} : { tab });
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Projects</h2>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tabButton} ${activeTab === 'games' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('games')}
        >
          Game Projects
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'system' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System Development
        </button>
      </div>

      {activeTab === 'games' && (
        <section>
          <div className={styles.projectsGrid}>
            <FeaturedProjectCard {...FEATURED_PROJECT} />
            {PROJECTS_DATA.map((project) => (
              <GameProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>
      )}

      {activeTab === 'system' && (
        <section>
          <div className={styles.projectsGrid}>
            {SYSTEM_PROJECTS_DATA.map((project) => (
              <SystemProjectCard key={project.id} {...project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProjectsPage;
