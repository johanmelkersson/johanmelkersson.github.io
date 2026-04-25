import type { SystemProject, ProjectStatus } from '../data/projects';
import styles from './SystemProjectCard.module.css';

const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-development': 'In Development',
  'released':       'Released',
  'finished':       'Finished',
  'archived':       'Archived',
};

function SystemProjectCard(project: SystemProject & { context?: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardBg} style={{ backgroundImage: `url(${project.imageUrl})` }} />

      <div className={styles.cardContent}>
        {/* 1. Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.titleArea}>
              <h2>{project.title}</h2>
              <span className={styles.typeTag}>{project.type}</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={`${styles.statusBadge} ${styles[`status-${project.status}`]}`}>
                <span>{STATUS_LABEL[project.status]}</span>
                {project.releaseDate && <span className={styles.statusDate}>{project.releaseDate}</span>}
              </span>
              {project.context && <span className={styles.contextTag}>{project.context}</span>}
            </div>
          </div>
        </div>

        {/* 2. Main Grid */}
        <div className={styles.mainGrid}>
          {/* MEDIA SEKTION */}
          <div className={styles.mediaContainer}>
            <img src={project.imageUrl} alt={project.title} className={styles.screenshot} />
          </div>

          {/* TEXT SEKTION */}
          <div className={styles.detailsSide}>
            <div className={styles.specBox}>
              <div className={styles.specItem}>
                <span>TYPE</span>
                <p>{project.type}</p>
              </div>
              <div className={styles.specItem}>
                <span>CONTRIBUTION</span>
                <p>{project.mainContribution}</p>
              </div>
            </div>

            <p>{project.description}</p>

            <div className={styles.featureList}>
              {project.features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <span className={styles.featureDot} />
                  {feature}
                </div>
              ))}
            </div>

            <div className={styles.roleBox}>
              <strong>DEV_LOG:</strong> {project.roleDescription}
            </div>
          </div>

          {/* 3. Footer */}
          <div className={styles.footer}>
            <div className={styles.techStack}>
              {project.technologies.map(tech => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
            <div className={styles.linkGroup}>
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`${styles.linkButton} ${styles.linkButtonOutline}`}>
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemProjectCard;
