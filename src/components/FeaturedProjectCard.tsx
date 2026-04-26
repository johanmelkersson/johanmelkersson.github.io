import { useState } from 'react';
import type { FeaturedProject, ProjectStatus } from '../data/projects';
import styles from './FeaturedProjectCard.module.css';

const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-development': 'In Development',
  'released':       'Released',
  'finished':       'Finished',
  'archived':       'Archived',
};

function FeaturedProjectCard(project: FeaturedProject & { context?: string; period?: string }) {
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
            <div className={styles.badgeGroup}>
              <span className={`${styles.statusBadge} ${styles[`status-${project.status}`]}`}>
                <span>{STATUS_LABEL[project.status]}</span>
                </span>
              {project.context && <span className={styles.contextTag}>{project.context}</span>}
              {project.period && <span className={styles.periodTag}>{project.period}</span>}
            </div>
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
                <span>TEAM</span>
                <p>{project.teamSize}</p>
              </div>
            </div>

            <p className={styles.description}>{project.description}</p>

            <div className={styles.roleBox}>
              <strong>DEV_LOG:</strong> {project.roleDescription}
            </div>

            {project.motivation && (
              <blockquote className={styles.motivationBox}>
                {project.motivation}
              </blockquote>
            )}
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
