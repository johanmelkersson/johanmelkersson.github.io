import { useState } from 'react';
import type { FeaturedProject } from '../data/projects';
import styles from './FeaturedProjectCard.module.css';

function FeaturedProjectCard(project: FeaturedProject) {
  const [systemsExpanded, setSystemsExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.titleArea}>
              <h2>{project.title}</h2>
              <span className={styles.engineTag}>{project.engine}</span>
            </div>
            <span className={styles.inDevBadge}>IN DEVELOPMENT</span>
          </div>
          {project.tagline && <p className={styles.tagline}>"{project.tagline}"</p>}
        </div>

        {/* Main content */}
        <div className={styles.mainGrid}>
          <div className={styles.detailsSide}>
            <div className={styles.specBox}>
              <div className={styles.specItem}>
                <span>GENRE</span>
                <p>{project.genre}</p>
              </div>
              <div className={styles.specItem}>
                <span>CONTRIBUTION</span>
                <p>{project.mainContribution}</p>
              </div>
              <div className={styles.specItem}>
                <span>STARTED</span>
                <p>{project.startDate}</p>
              </div>
              <div className={styles.specItem}>
                <span>TEAM</span>
                <p>{project.teamSize}</p>
              </div>
            </div>

            <p className={styles.description}>{project.description}</p>

            <div className={styles.roleBox}>
              <strong>DEV_LOG:</strong> {project.roleDescription}
            </div>
          </div>
        </div>

        {/* Technical Systems (expandable) */}
        <div className={styles.systemsSection}>
          <button
            className={styles.systemsToggle}
            onClick={() => setSystemsExpanded(v => !v)}
            aria-expanded={systemsExpanded}
          >
            <span>TECHNICAL SYSTEMS</span>
            <span className={`${styles.chevron} ${systemsExpanded ? styles.chevronOpen : ''}`}>▼</span>
          </button>

          {systemsExpanded && (
            <div className={styles.systemsGrid}>
              {project.technicalSystems.map((sys) => (
                <div key={sys.name} className={styles.systemItem}>
                  <strong>{sys.name}</strong>
                  <p>{sys.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.techStack}>
            {project.technologies.map(tech => (
              <span key={tech} className={styles.techTag}>{tech}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FeaturedProjectCard;
