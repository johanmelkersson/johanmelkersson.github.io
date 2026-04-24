import { TIMELINE_DATA, CATEGORY_LABELS, TYPE_LABELS, type ProjectCategory } from '../data/timeline';
import type { ProjectStatus } from '../data/projects';
import styles from './Timeline.module.css';

const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-development': 'In Development',
  'released':       'Released',
  'finished':       'Finished',
  'archived':       'Archived',
};

const CATEGORY_CLASS: Record<ProjectCategory, string> = {
  educational:  'educational',
  professional: 'professional',
  hobby:        'hobby',
};

function Timeline() {
  return (
    <div className={styles.container}>
      <div className={styles.legend}>
        {(Object.keys(CATEGORY_LABELS) as ProjectCategory[]).map(cat => (
          <div key={cat} className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles[CATEGORY_CLASS[cat]]}`} />
            <span>{CATEGORY_LABELS[cat]}</span>
          </div>
        ))}
      </div>

      <div className={styles.timeline}>
        <div className={styles.line} />

        {TIMELINE_DATA.map((entry, i) => {
          const side = i % 2 === 0 ? 'left' : 'right';
          const catClass = CATEGORY_CLASS[entry.category];
          return (
            <div key={`${entry.id}-${i}`} className={`${styles.row} ${styles[side]}`}>
              <div className={`${styles.card} ${entry.ongoing ? styles.ongoingCard : ''}`}>
                <div className={styles.cardHeader}>
                  <p className={styles.period}>{entry.period}</p>
                  <span className={`${styles.statusBadge} ${styles[`status-${entry.status}`]}`}>
                    {STATUS_LABEL[entry.status]}
                  </span>
                </div>
                <h3 className={styles.title}>{entry.title}</h3>
                <div className={styles.metaRow}>
                  {entry.engine && <span className={styles.engine}>{entry.engine}</span>}
                </div>
                <p className={styles.contribution}>{entry.contribution}</p>
                <div className={styles.badgeRow}>
                  <span className={`${styles.categoryBadge} ${styles[catClass]}`}>
                    {entry.categoryLabel ?? CATEGORY_LABELS[entry.category]}
                  </span>
                  <span className={styles.typeTag}>{TYPE_LABELS[entry.type]}</span>
                </div>
              </div>
              <div className={`${styles.dot} ${styles[catClass]} ${entry.ongoing ? styles.ongoingDot : ''}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Timeline;
