import { useState, useRef } from 'react';
import { TIMELINE_DATA, CATEGORY_LABELS, TYPE_LABELS } from '../data/timeline';
import type { ProjectCategory, ProjectType, TimelineEntry } from '../data/timeline';
import type { ProjectStatus } from '../data/projects';
import styles from './MiniTimeline.module.css';

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

const TYPE_CLASS: Record<ProjectType, string> = {
  game:   'typeGame',
  engine: 'typeEngine',
  system: 'typeSystem',
};

interface HoverState {
  entry: TimelineEntry;
  x: number;   // centre of dot relative to wrapper
}

function MiniTimeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoverState | null>(null);

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>, entry: TimelineEntry) {
    const dotRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const wrapperRect = wrapperRef.current!.getBoundingClientRect();
    const x = dotRect.left + dotRect.width / 2 - wrapperRect.left;
    setHovered({ entry, x });
  }

  const tooltipWidth = 220;

  function tooltipLeft(x: number): number {
    if (!wrapperRef.current) return x - tooltipWidth / 2;
    const wrapperWidth = wrapperRef.current.getBoundingClientRect().width;
    const raw = x - tooltipWidth / 2;
    const min = 8;
    const max = wrapperWidth - tooltipWidth - 8;
    return Math.min(Math.max(raw, min), max);
  }

  function arrowLeft(x: number): number {
    const left = tooltipLeft(x);
    return Math.min(Math.max(x - left - 5, 10), tooltipWidth - 20);
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {/* Tooltip rendered outside scroll container to avoid overflow clipping */}
      {hovered && (
        <div
          className={styles.tooltip}
          style={{ left: tooltipLeft(hovered.x) }}
        >
          <div
            className={styles.tooltipArrow}
            style={{ left: arrowLeft(hovered.x) }}
          />
          <div className={styles.tooltipTitle}>{hovered.entry.title}</div>
          <div className={styles.tooltipMeta}>
            <span className={`${styles.statusBadge} ${styles[`status-${hovered.entry.status}`]}`}>
              {STATUS_LABEL[hovered.entry.status]}
            </span>
            <span className={styles.typeBadge}>{TYPE_LABELS[hovered.entry.type]}</span>
          </div>
          <div className={styles.tooltipPeriod}>{hovered.entry.period}</div>
          {hovered.entry.engine && (
            <div className={styles.tooltipEngine}>{hovered.entry.engine}</div>
          )}
          <div className={styles.tooltipContribution}>{hovered.entry.contribution}</div>
          <div className={`${styles.tooltipCategory} ${styles[CATEGORY_CLASS[hovered.entry.category]]}`}>
            {hovered.entry.categoryLabel ?? CATEGORY_LABELS[hovered.entry.category]}
          </div>
        </div>
      )}

      {/* Scrollable track */}
      <div className={styles.scrollContainer}>
        <div className={styles.track}>
          <div className={styles.line} />
          {TIMELINE_DATA.map((entry) => (
            <div
              key={entry.id}
              className={styles.item}
              onMouseEnter={(e) => handleMouseEnter(e, entry)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`${styles.dot} ${styles[TYPE_CLASS[entry.type]]} ${entry.ongoing ? styles.ongoingDot : ''}`} />
              <span className={styles.year}>{entry.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MiniTimeline;
