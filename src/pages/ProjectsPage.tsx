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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [dropdownOpen]);

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
    setSlideDir('next');
    const idx = selectedIndex < 0 ? 0 : (selectedIndex + 1) % sorted.length;
    setSelectedId(sorted[idx].id);
  }
  function goPrev() {
    if (sorted.length <= 1) return;
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
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, sorted]);

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

      <div className={styles.timelineSection}>
        <div className={`${styles.timelineRow} ${styles.timelineRowFull}`}>
          <GitTimeline showAxis highlightId={hoveredProjectId ?? undefined} selectedId={selectedId ?? undefined} forcedTooltipId={navHoverId ?? undefined} onHoverChange={handleTimelineHover} onSelect={id => { const e = sorted.find(x => x.id === id); if (e) selectTab(e); }} activeIds={activeIds} />
        </div>
      </div>

      <div className={styles.tabRow}>
        {/* Desktop: tab buttons */}
        <nav className={styles.projectNav}>
          {sorted.map(entry => (
            <button
              key={entry.id}
              className={`${styles.projectNavLink} ${(selectedId === entry.id || hoveredProjectId === entry.id) ? styles.projectNavLinkActive : ''}`}
              style={{ '--type-color': TYPE_COLOR[entry.type] } as React.CSSProperties}
              onPointerEnter={e => handleNavEnter(e, entry)}
              onPointerLeave={handleNavLeave}
              onClick={() => selectTab(entry)}
            >
              {entry.title}
            </button>
          ))}
        </nav>

        {/* Mobile: dropdown */}
        {(() => {
          const selectedEntry = sorted.find(e => e.id === selectedId) ?? sorted[0] ?? null;
          return (
            <div ref={dropdownRef} className={styles.mobileDropdown}>
              <button
                className={styles.dropdownTrigger}
                style={selectedEntry ? { '--type-color': TYPE_COLOR[selectedEntry.type] } as React.CSSProperties : undefined}
                onClick={() => setDropdownOpen(p => !p)}
              >
                <span>{selectedEntry?.title ?? '—'}</span>
                <span className={styles.dropdownArrow}>{dropdownOpen ? '▴' : '▾'}</span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownList}>
                  {sorted.map(entry => (
                    <button
                      key={entry.id}
                      className={`${styles.dropdownItem} ${entry.id === selectedId ? styles.dropdownItemActive : ''}`}
                      style={{ '--type-color': TYPE_COLOR[entry.type] } as React.CSSProperties}
                      onClick={() => { selectTab(entry); setDropdownOpen(false); }}
                    >
                      {entry.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {sorted.length > 0 && (
          <div className={styles.folderNav}>
            <button className={styles.folderNavBtn} onClick={goPrev}>‹</button>
            <span className={styles.folderNavCount}>
              {selectedIndex + 1} / {sorted.length}
            </span>
            <button className={styles.folderNavBtn} onClick={goNext}>›</button>
          </div>
        )}
      </div>

      {(() => {
        const entry = sorted.find(e => e.id === selectedId) ?? sorted[0] ?? null;
        if (!entry) return null;
        const card = renderCard(entry);
        if (!card) return null;
        return (
          <div
            className={styles.folderPane}
            style={{ '--accent-color': TYPE_COLOR[entry.type], '--accent-rgb': TYPE_RGB[entry.type] } as React.CSSProperties}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div key={entry.id} className={slideDir === 'next' ? styles.slideNext : styles.slidePrev}>
              {card}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default ProjectsPage;
