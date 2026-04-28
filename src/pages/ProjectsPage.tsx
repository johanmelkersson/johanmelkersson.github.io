import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import type { ProjectStatus } from "../data/projects";
import GameProjectCard from "../components/GameProjectCard";
import SystemProjectCard from "../components/SystemProjectCard";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import { PROJECTS_DATA, SYSTEM_PROJECTS_DATA, FEATURED_PROJECT } from "../data/projects";
import GitTimeline from "../components/GitTimeline";
import { TIMELINE_DATA } from "../data/timeline";
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

function buildTypeColor(c: { typeGame: string; typeEngine: string; typeSystem: string }): Record<ProjectType, string> {
  return { game: c.typeGame, engine: c.typeEngine, system: c.typeSystem };
}
function buildTypeRgb(c: { typeGameRgb: string; typeEngineRgb: string; typeSystemRgb: string }): Record<ProjectType, string> {
  return { game: c.typeGameRgb, engine: c.typeEngineRgb, system: c.typeSystemRgb };
}

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  professional: 'Professional',
  educational:  'Educational',
  hobby:        'InHouse',
};


function getContext(entry: TimelineEntry): string {
  return entry.categoryLabel ?? (entry.category === 'hobby' ? 'InHouse' : entry.category);
}

function renderCard(entry: TimelineEntry) {
  const key     = entry.title.toLowerCase();
  const context = getContext(entry);

  if (entry.title === FEATURED_PROJECT.title)
    return <FeaturedProjectCard {...FEATURED_PROJECT} context={context} period={entry.period} />;

  const sys = systemByTitle.get(key);
  if (sys) return <SystemProjectCard {...sys} context={context} period={entry.period} />;

  const game = gameByTitle.get(key);
  if (game) return <GameProjectCard {...game} context={context} period={entry.period} />;

  return null;
}

function ProjectsPage() {
  const { theme } = useTheme();
  const TYPE_COLOR = useMemo(() => buildTypeColor(theme.colors), [theme]);
  const TYPE_RGB   = useMemo(() => buildTypeRgb(theme.colors),   [theme]);

  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const [navHoverId, setNavHoverId] = useState<number | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [filterOpen, setFilterOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const lastNavRef = useRef<number>(0);

  useEffect(() => {
    if (!filterOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setFilterOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [filterOpen]);

  function handleNavEnter(e: React.PointerEvent<HTMLButtonElement>, entry: TimelineEntry) {
    if (e.pointerType === 'touch') return;
    setHoveredProjectId(entry.id);
    navTimerRef.current = setTimeout(() => setNavHoverId(entry.id), 500);
  }

  function handleNavLeave() {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setHoveredProjectId(null);
    setNavHoverId(null);
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
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function toggleCategory(cat: ProjectCategory) {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleStatus(s: StatusGroup) {
    setActiveStatuses(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function resetFilters() {
    setActiveTypes(new Set(['game', 'engine', 'system']));
    setActiveCategories(new Set(['professional', 'educational', 'hobby']));
    setActiveStatuses(new Set(['active', 'finished', 'archived']));
  }

  const filterCount = (3 - activeTypes.size) + (3 - activeCategories.size) + (3 - activeStatuses.size);

  const [newestFirst, setNewestFirst] = useState(true);

  const sorted = useMemo(() => {
    function endVal(e: typeof TIMELINE_DATA[0]): number {
      return e.endDate ? dateToVal(e.endDate) : Infinity;
    }
    return [...TIMELINE_DATA]
      .filter(e => activeTypes.has(e.type) && activeCategories.has(e.category) && activeStatuses.has(STATUS_GROUP[e.status]))
      .sort((a, b) => newestFirst
        ? (endVal(b) - endVal(a)) || (dateToVal(b.startDate) - dateToVal(a.startDate))
        : (dateToVal(a.startDate) - dateToVal(b.startDate)) || (endVal(a) - endVal(b)));
  }, [activeTypes, activeCategories, activeStatuses, newestFirst]);

  const activeIds = useMemo(() => new Set(sorted.map(e => e.id)), [sorted]);

  useEffect(() => {
    if (sorted.length === 0) { setSelectedId(null); return; }
    setSelectedId(prev => sorted.some(e => e.id === prev) ? prev : sorted[0].id);
  }, [sorted]);

  const selectedIndex = sorted.findIndex(e => e.id === selectedId);

  function goNext() {
    if (sorted.length <= 1) return;
    const now = Date.now();
    if (now - lastNavRef.current < 220) return;
    lastNavRef.current = now;
    setSlideDir('next');
    const idx = selectedIndex < 0 ? 0 : (selectedIndex + 1) % sorted.length;
    setSelectedId(sorted[idx].id);
  }
  function goPrev() {
    if (sorted.length <= 1) return;
    const now = Date.now();
    if (now - lastNavRef.current < 220) return;
    lastNavRef.current = now;
    setSlideDir('prev');
    const idx = selectedIndex <= 0 ? sorted.length - 1 : selectedIndex - 1;
    setSelectedId(sorted[idx].id);
  }
  function selectTab(entry: TimelineEntry) {
    const newIdx = sorted.findIndex(e => e.id === entry.id);
    setSlideDir(newIdx >= selectedIndex ? 'next' : 'prev');
    setSelectedId(entry.id);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, sorted]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || selectedId === null) return;
    const active = strip.querySelector<HTMLElement>('[data-selected="true"]');
    if (!active) return;
    const stripRect = strip.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const target = strip.scrollLeft + (activeRect.left - stripRect.left) - (stripRect.width / 2) + (activeRect.width / 2);
    strip.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [selectedId]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) goNext(); else goPrev();
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Projects</h2>

      <div className={styles.filterBar}>
        <button className={styles.sortButton} onClick={() => setNewestFirst(p => !p)}>
          {newestFirst ? '↓ Newest' : '↑ Oldest'}
        </button>

        <div className={styles.filterPopoverWrapper} ref={filterRef}>
          <button
            className={`${styles.filterToggleBtn} ${filterCount > 0 ? styles.filterToggleBtnActive : ''}`}
            onClick={() => setFilterOpen(p => !p)}
          >
            {filterCount > 0 ? `Filter [${filterCount}]` : 'Filter'}
          </button>

          {filterOpen && (
            <div className={styles.filterPanel}>
              <div className={styles.filterGroup}>
                <span className={styles.filterGroupLabel}>Type</span>
                <div className={styles.filterGroupRow}>
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
              </div>

              <div className={styles.filterGroup}>
                <span className={styles.filterGroupLabel}>Category</span>
                <div className={styles.filterGroupRow}>
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
              </div>

              <div className={styles.filterGroup}>
                <span className={styles.filterGroupLabel}>Status</span>
                <div className={styles.filterGroupRow}>
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

              {filterCount > 0 && (
                <button className={styles.resetBtn} onClick={resetFilters}>
                  Reset filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.timelineSection}>
        <div className={`${styles.timelineRow} ${styles.timelineRowFull}`}>
          <GitTimeline showAxis highlightId={hoveredProjectId ?? undefined} selectedId={selectedId ?? undefined} forcedTooltipId={navHoverId ?? undefined} onHoverChange={handleTimelineHover} onSelect={id => { const e = sorted.find(x => x.id === id); if (e) selectTab(e); }} activeIds={activeIds} />
        </div>
      </div>

      {sorted.length > 0 && (() => {
        const entry = sorted.find(e => e.id === selectedId) ?? sorted[0];
        const card = entry ? renderCard(entry) : null;
        return (
          <>
            {/* Netflix strip */}
            <div className={styles.netflixWrapper}>
              <button className={`${styles.stripNavBtn} ${styles.stripNavBtnLeft}`} onClick={goPrev} tabIndex={-1}>‹</button>
              <div className={styles.netflixStrip} ref={stripRef}>
                {sorted.map(e => {
                  const key = e.title.toLowerCase();
                  const imageUrl = e.title === FEATURED_PROJECT.title
                    ? FEATURED_PROJECT.imageUrl
                    : systemByTitle.get(key)?.imageUrl ?? gameByTitle.get(key)?.imageUrl ?? '';
                  const isActive = selectedId === e.id || hoveredProjectId === e.id;
                  return (
                    <button
                      key={e.id}
                      data-selected={e.id === selectedId ? 'true' : undefined}
                      className={`${styles.stripCard} ${isActive ? styles.stripCardActive : ''}`}
                      style={{ '--type-color': TYPE_COLOR[e.type], '--type-rgb': TYPE_RGB[e.type] } as React.CSSProperties}
                      onClick={ev => { selectTab(e); (ev.currentTarget as HTMLElement).blur(); }}
                      onPointerEnter={ev => handleNavEnter(ev, e)}
                      onPointerLeave={handleNavLeave}
                    >
                      {imageUrl && <div className={styles.stripCardBg} style={{ backgroundImage: `url(${imageUrl})` }} />}
                      <div className={styles.stripCardOverlay} />
                      <div className={styles.stripCardContent}>
                        <span className={styles.stripCardName}>{e.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button className={`${styles.stripNavBtn} ${styles.stripNavBtnRight}`} onClick={goNext} tabIndex={-1}>›</button>
            </div>

            {/* Full card */}
            {card && entry && (
              <div
                className={styles.cardWrapper}
                style={{ '--accent-color': TYPE_COLOR[entry.type], '--accent-rgb': TYPE_RGB[entry.type] } as React.CSSProperties}
              >
                {sorted.length > 1 && (
                  <>
                    <button className={`${styles.sideNavBtn} ${styles.sideNavBtnLeft}`} onClick={goPrev} tabIndex={-1}>‹</button>
                    <button className={`${styles.sideNavBtn} ${styles.sideNavBtnRight}`} onClick={goNext} tabIndex={-1}>›</button>
                  </>
                )}
                <div
                  className={styles.folderPane}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div key={entry.id} className={slideDir === 'next' ? styles.slideNext : styles.slidePrev}>
                    {card}
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

export default ProjectsPage;
