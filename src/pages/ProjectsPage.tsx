import { useSearchParams } from "react-router-dom";
import GameProjectCard from "../components/GameProjectCard";
import SystemProjectCard from "../components/SystemProjectCard";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import Timeline from "../components/Timeline";
import { PROJECTS_DATA, SYSTEM_PROJECTS_DATA, FEATURED_PROJECT } from "../data/projects";
import styles from "./ProjectsPage.module.css";

type Tab = 'games' | 'system' | 'timeline';

function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('tab');
  const activeTab: Tab = raw === 'system' ? 'system' : raw === 'timeline' ? 'timeline' : 'games';

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
          Game Development
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'system' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System Development
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'timeline' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </div>

      {activeTab === 'games' && (
        <section>
          <nav className={styles.projectNav}>
            <a href={`#game-${FEATURED_PROJECT.id}`} className={styles.projectNavLink}>
              {FEATURED_PROJECT.title}
            </a>
            {PROJECTS_DATA.map(p => (
              <a key={p.id} href={`#game-${p.id}`} className={styles.projectNavLink}>
                {p.title}
              </a>
            ))}
          </nav>
          <div className={styles.projectsGrid}>
            <div id={`game-${FEATURED_PROJECT.id}`}>
              <FeaturedProjectCard {...FEATURED_PROJECT} />
            </div>
            {PROJECTS_DATA.map((project) => (
              <div key={project.id} id={`game-${project.id}`}>
                <GameProjectCard {...project} />
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'system' && (
        <section>
          <nav className={styles.projectNav}>
            {SYSTEM_PROJECTS_DATA.map(p => (
              <a key={p.id} href={`#system-${p.id}`} className={styles.projectNavLink}>
                {p.title}
              </a>
            ))}
          </nav>
          <div className={styles.projectsGrid}>
            {SYSTEM_PROJECTS_DATA.map((project) => (
              <div key={project.id} id={`system-${project.id}`}>
                <SystemProjectCard {...project} />
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'timeline' && (
        <section>
          <Timeline />
        </section>
      )}
    </div>
  );
}

export default ProjectsPage;
