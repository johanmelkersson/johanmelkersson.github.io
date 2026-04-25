import { useMemo, useRef, useState, useCallback } from "react";
import type { ProjectStatus } from "../data/projects";
import GameProjectCard from "../components/GameProjectCard";
import SystemProjectCard from "../components/SystemProjectCard";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import { PROJECTS_DATA, SYSTEM_PROJECTS_DATA, FEATURED_PROJECT } from "../data/projects";
import GitTimeline from "../components/GitTimeline";
import { TIMELINE_DATA } from "../data/timeline";
import { CATEGORY_LABELS, TYPE_LABELS } from "../data/timeline";
import type { TimelineEntry, ProjectType, ProjectCategory } from "../data/timeline";

type StatusGroup = 'active' | 'finished' | 'archived';

const STATUS_GROUP: Record<ProjectStatus, StatusGroup> = {
  'in-development': 'active',
  'released':       'finished',
  'finished':       'finished',
  'archived':       'archived',
};

const STATUS_GROUP_LABEL: Record<StatusGroup, string> = {
  active:   'In Progress',
  finished: 'Complete',
  archived: 'Archived',
};
import styles from "./ProjectsPage.module.css";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-development': 'In Development',
  'released':       'Released',
  'finished':       'Finished',
  'archived':       'Archived',
};


const gameByTitle   = new Map(PROJECTS_DATA.map(p => [p.title.toLowerCase(), p]));
const systemByTitle = new Map(SYSTEM_PROJECTS_DATA.map(p => [p.title.toLowerCase(), p]));

function dateToVal(yyyymm: string): number {
  const [y, m] = yyyymm.split('-').map(Number);
  return y + (m - 1) / 12;
}

const TYPE_LABEL: Record<ProjectType, string> = {
  game:   'Game Dev',
  engine: 'Engine Dev',
  system: 'System Dev',
};

const TYPE_COLOR: Record<ProjectType, string> = {
  game:   '#38bdf8',
  engine: '#f0c060',
  system: '#fb923c',
};

const TYPE_RGB: Record<ProjectType, string> = {
  game:   '56, 189, 248',
  engine: '240, 192, 96',
  system: '251, 146, 60',
};

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  professional: 'Professional',
  educational:  'Educational',
  hobby:        'InHouse',
};

const CATEGORY_COLOR: Record<ProjectCategory, string> = {
  professional: '#34d399',
  educational:  '#38bdf8',
  hobby:        '#f0c060',
};

function getContext(entry: TimelineEntry): string {
  return entry.categoryLabel ?? (entry.category === 'hobby' ? 'InHouse' : entry.category);
}

function renderCard(entry: TimelineEntry) {
  const key     = entry.title.toLowerCase();
  const context = getContext(entry);

  if (entry.title === FEATURED_PROJECT.title)
    return <FeaturedProjectCard {...FEATURED_PROJECT} context={context} />;

  const sys = systemByTitle.get(key);
  if (sys) return <SystemProjectCard {...sys} context={context} />;

  const game = gameByTitle.get(key);
  if (game) return <GameProjectCard {...game} context={context} />;

  return null;
}

function ProjectsPage() {
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const [navTooltip, setNavTooltip] = useState<{ entry: TimelineEntry; x: number; y: number } | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleNavEnter(e: React.PointerEvent<HTMLAnchorElement>, entry: TimelineEntry) {
    if (e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredProjectId(entry.id);
    navTimerRef.current = setTimeout(() => {
      const x = Math.min(Math.max(rect.left + rect.width / 2, 118), window.innerWidth - 118);
      setNavTooltip({ entry, x, y: rect.top });
    }, 500);
  }

  function handleNavLeave() {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setHoveredProjectId(null);
    setNavTooltip(null);
  }

  const handleTimelineHover = useCallback((id: number | null) => {
    setHoveredProjectId(id);
  }, []);

  const [activeTypes, setActiveTypes] = useState<Set<ProjectType>>(
    new Set(['game', 'engine', 'system'])
  );
  const [activeCategories, setActiveCategories] = useState<Set<ProjectCategory>>(
    new Set(['professional', 'educational', 'hobby'])
  );
  const [activeStatuses, setActiveStatuses] = useState<Set<StatusGroup>>(
    new Set(['active', 'finished', 'archived'])
  );

  function toggleType(type: ProjectType) {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type) && next.size > 1) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function toggleCategory(cat: ProjectCategory) {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat) && next.size > 1) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleStatus(s: StatusGroup) {
    setActiveStatuses(prev => {
      const next = new Set(prev);
      if (next.has(s) && next.size > 1) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const [newestFirst, setNewestFirst] = useState(true);

  const sorted = useMemo(() =>
    [...TIMELINE_DATA]
      .filter(e => activeTypes.has(e.type) && activeCategories.has(e.category) && activeStatuses.has(STATUS_GROUP[e.status]))
      .sort((a, b) => newestFirst
        ? dateToVal(b.startDate) - dateToVal(a.startDate)
        : dateToVal(a.startDate) - dateToVal(b.startDate)),
    [activeTypes, activeCategories, activeStatuses, newestFirst]
  );

  const activeIds = useMemo(() => new Set(sorted.map(e => e.id)), [sorted]);

  return (
    <div className={styles.pageContainer}>
      {navTooltip && (
        <div
          className={styles.navTooltip}
          style={{ left: navTooltip.x - 110, bottom: window.innerHeight - navTooltip.y + 10 }}
        >
          <div className={styles.tipTitle}>{navTooltip.entry.title}</div>
          <div className={styles.tipMeta}>
            <span className={`${styles.statusBadge} ${styles[`status-${navTooltip.entry.status}`]}`}>
              {STATUS_LABEL[navTooltip.entry.status]}
            </span>
            <span className={styles.typeBadge}>{TYPE_LABEL[navTooltip.entry.type]}</span>
          </div>
          <div className={styles.tipPeriod}>{navTooltip.entry.period}</div>
          {navTooltip.entry.engine && <div className={styles.tipEngine}>{navTooltip.entry.engine}</div>}
          <div className={styles.tipContribution}>{navTooltip.entry.contribution}</div>
          <div className={`${styles.tipCategory} ${styles[navTooltip.entry.category]}`}>
            {navTooltip.entry.categoryLabel ?? (navTooltip.entry.category === 'hobby' ? 'InHouse' : navTooltip.entry.category)}
          </div>
        </div>
      )}

      <h2 className={styles.pageTitle}>Projects</h2>

      <div className={styles.timelineSection}>
        <div className={styles.timelineRow}>
          <span className={styles.timelineLabel}>Professional</span>
          <GitTimeline category="professional" highlightId={hoveredProjectId ?? undefined} onHoverChange={handleTimelineHover} activeIds={activeIds} />
        </div>
        <div className={styles.timelineRow}>
          <span className={styles.timelineLabel}>Educational</span>
          <GitTimeline category="educational" highlightId={hoveredProjectId ?? undefined} onHoverChange={handleTimelineHover} activeIds={activeIds} />
        </div>
        <div className={styles.timelineRow}>
          <span className={styles.timelineLabel}>InHouse</span>
          <GitTimeline category="hobby" showAxis highlightId={hoveredProjectId ?? undefined} onHoverChange={handleTimelineHover} activeIds={activeIds} />
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <button
            className={styles.sortButton}
            onClick={() => setNewestFirst(p => !p)}
          >
            {newestFirst ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
        <div className={styles.filterRow}>
          {(['game', 'engine', 'system'] as ProjectType[]).map(type => (
            <button
              key={type}
              className={`${styles.typeFilter} ${activeTypes.has(type) ? styles.typeFilterActive : ''}`}
              style={{ '--type-color': TYPE_COLOR[type] } as React.CSSProperties}
              onClick={() => toggleType(type)}
            >
              {TYPE_LABEL[type]}
            </button>
          ))}
        </div>
        <div className={styles.filterRow}>
          {(['professional', 'educational', 'hobby'] as ProjectCategory[]).map(cat => (
            <button
              key={cat}
              className={`${styles.typeFilter} ${activeCategories.has(cat) ? styles.typeFilterNeutralActive : ''}`}
              onClick={() => toggleCategory(cat)}
            >
              {CATEGORY_LABEL[cat]}
            </button>
          ))}
        </div>
        <div className={styles.filterRow}>
          {(['active', 'finished', 'archived'] as StatusGroup[]).map(s => (
            <button
              key={s}
              className={`${styles.typeFilter} ${activeStatuses.has(s) ? styles.typeFilterNeutralActive : ''}`}
              onClick={() => toggleStatus(s)}
            >
              {STATUS_GROUP_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <nav className={styles.projectNav}>
        {sorted.map(entry => (
          <a
            key={entry.id}
            href={`#project-${entry.id}`}
            className={`${styles.projectNavLink} ${hoveredProjectId === entry.id ? styles.projectNavLinkActive : ''}`}
            style={{ '--type-color': TYPE_COLOR[entry.type] } as React.CSSProperties}
            onPointerEnter={e => handleNavEnter(e, entry)}
            onPointerLeave={handleNavLeave}
          >
            {entry.title}
          </a>
        ))}
      </nav>

      <div className={styles.projectFeed}>
        {sorted.map(entry => {
          const card = renderCard(entry);
          if (!card) return null;
          return (
            <div
              key={entry.id}
              id={`project-${entry.id}`}
              style={{ '--accent-color': TYPE_COLOR[entry.type], '--accent-rgb': TYPE_RGB[entry.type] } as React.CSSProperties}
            >
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectsPage;
