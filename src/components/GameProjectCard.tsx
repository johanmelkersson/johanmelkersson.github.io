import type { GameProject, ProjectStatus } from '../data/projects';
import styles from './GameProjectCard.module.css';

const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-development': 'In Development',
  'released':       'Released',
  'finished':       'Finished',
  'archived':       'Archived',
};

const platformBadges: Record<string, string> = {
  itch: '/assets/badges/itch-badge.png',
  googleplay: '/assets/badges/google-play-badge.png',
  steam: '/assets/badges/steam-badge.png'
};

function GameProjectCard(project: GameProject) {
  return (
    <div className={styles.card}>
      <div className={styles.cardBg} style={{ backgroundImage: `url(${project.imageUrl})` }} />

      <div className={styles.cardContent}>
        {/* 1. Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.titleArea}>
              <h2>{project.title}</h2>
              <span className={styles.engineTag}>{project.engine}</span>
            </div>
            <span className={`${styles.statusBadge} ${styles[`status-${project.status}`]}`}>
              <span>{STATUS_LABEL[project.status]}</span>
              {project.releaseDate && <span className={styles.statusDate}>{project.releaseDate}</span>}
            </span>
          </div>
          {project.tagline && <p className={styles.tagline}>{project.tagline}</p>}
        </div>

        {/* 2. Main Grid */}
        <div className={styles.mainGrid}>
          {/* MEDIA SEKTION */}
          <div className={styles.mediaContainer}>
            {project.youtubeId ? (
              <div className={styles.videoWrapper}>
                <iframe src={`https://www.youtube.com/embed/${project.youtubeId}`} frameBorder="0" allowFullScreen title={project.title} />
              </div>
            ) : (
              <img src={project.imageUrl} alt={project.title} className={styles.keyArtFallback} />
            )}
          </div>

          {/* TEXT SEKTION */}
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
            </div>

            <div>
              <p>{project.description}</p>
              <div className={styles.roleBox}>
                <strong>DEV_LOG:</strong> {project.roleDescription}
              </div>
            </div>

            {project.awards && (
              <div className={styles.awardsContainer}>
                {project.awards.map((award, index) => (
                  <div key={index} className={styles.awardItem} title={award.name}>
                    <img src={award.imageUrl} alt={award.name} className={styles.awardImage} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Footer */}
          <div className={styles.footer}>
            <div className={styles.techStack}>
              {project.technologies.map(tech => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
            <div>
              <div className={styles.buttonGroup}>
                {project.platformLinks?.map((link) => (
                  <a key={link.type} href={link.url} target="_blank" rel="noopener noreferrer">
                    <img src={platformBadges[link.type]} alt={link.type} className={styles.badgeImage} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameProjectCard;
