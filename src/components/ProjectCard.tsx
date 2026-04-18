import type { Project } from '../data/projects';
import styles from './ProjectCard.module.css';

// src/components/ProjectCard.tsx

const platformBadges: Record<string, string> = {
  itch: '/assets/badges/itch-badge.png',
  googleplay: '/assets/badges/google-play-badge.png',
  steam: '/assets/badges/steam-badge.png'
};

function ProjectCard(project: Project) {
  return (
    <div className={styles.card}>
      {/* 1. Bakgrunds-effekt (Subtil overlay av key art) */}
      <div className={styles.cardBg} style={{ backgroundImage: `url(${project.imageUrl})` }} />

      <div className={styles.cardContent}>
        {/* 2. Header: Titel och Tagline */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h2>{project.title}</h2>
            <span className={styles.engineTag}>{project.engine}</span>
          </div>
          {project.tagline && <p className={styles.tagline}>{project.tagline}</p>}
        </div>

        {/* 3. Main Grid: Media & Technical Specs */}
        <div className={styles.mainGrid}>
          <div className={styles.mediaContainer}>
            {project.youtubeId ? (
              <div className={styles.videoWrapper}> {/* Behåll denna för aspect-ratio */}
                <iframe src={`https://www.youtube.com/embed/${project.youtubeId}`} /*...*/ />
              </div>
            ) : (
              /* Ge bilden en specifik klass */
              <img src={project.imageUrl} alt={project.title} className={styles.keyArtFallback} />
            )}
          </div>

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

            <div className={styles.descriptionArea}>
              <p>{project.description}</p>
              <div className={styles.roleBox}>
                <strong>DEV_LOG:</strong> {project.roleDescription}
              </div>
            </div>

            {project.awards && (
              <div className={styles.awardsContainer}>
                {project.awards.map((award, index) => (
                  <div key={index} className={styles.awardItem} title={award.name}>
                    <img 
                      src={award.imageUrl} 
                      alt={award.name} 
                      className={styles.awardImage} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

       {/* 4. Footer: Tech Stack & Actions */}
        <div className={styles.footer}>
          <div className={styles.techStack}>
            {project.technologies.map(tech => (
              <span key={tech} className={styles.techTag}>{tech}</span>
            ))}
          </div>
          <div className={styles.links}>
            <div className={styles.buttonGroup}>
              {project.platformLinks?.map((link) => (
                <a 
                  key={link.type} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img 
                    src={platformBadges[link.type]} 
                    alt={`Download on ${link.type}`} 
                    className={styles.badgeImage}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;