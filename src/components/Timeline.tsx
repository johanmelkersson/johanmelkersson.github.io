import { TIMELINE_DATA, CATEGORY_LABELS, type ProjectCategory } from '../data/timeline';
import styles from './Timeline.module.css';

const CATEGORY_CLASS: Record<ProjectCategory, string> = {
  university:   'university',
  school:       'school',
  professional: 'professional',
  hobby:        'hobby',
  system:       'system',
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
          return (
            <div key={`${entry.id}-${i}`} className={`${styles.row} ${styles[side]}`}>
              <div className={`${styles.card} ${entry.ongoing ? styles.ongoingCard : ''}`}>
                <p className={styles.period}>{entry.period}</p>
                <h3 className={styles.title}>{entry.title}</h3>
                {entry.engine && <span className={styles.engine}>{entry.engine}</span>}
                <p className={styles.contribution}>{entry.contribution}</p>
                <span className={`${styles.categoryBadge} ${styles[CATEGORY_CLASS[entry.category]]}`}>
                  {CATEGORY_LABELS[entry.category]}
                </span>
              </div>
              <div className={`${styles.dot} ${styles[CATEGORY_CLASS[entry.category]]} ${entry.ongoing ? styles.ongoingDot : ''}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Timeline;
