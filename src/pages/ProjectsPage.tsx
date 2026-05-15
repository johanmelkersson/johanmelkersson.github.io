import { useMemo, useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
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


function smoothScrollTo(el: HTMLElement, target: number, duration: number, onDone: () => void): () => void {
  let cancelled = false;
  const start = el.scrollLeft;
  const dist = target - start;
  const t0 = performance.now();
  function step(now: number) {
    if (cancelled) return;
    const p = Math.min((now - t0) / duration, 1);
    const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    el.scrollLeft = start + dist * e;
    if (p < 1) requestAnimationFrame(step);
    else onDone();
  }
  requestAnimationFrame(step);
  return () => { cancelled = true; };
}

function dateToVal(yyyymm: string): number {
  const [y, m] = yyyymm.split('-').map(Number);
  return y + (m - 1) / 12;
}

const STATUS_SHORT: Record<string, string> = {
  'in-development': 'In Dev',
  'released':       'Released',
  'finished':       'Finished',
  'archived':       'Archived',
};

const STATUS_COLOR: Record<string, string> = {
  'in-development': 'var(--status-in-dev)',
  'released':       '#fb923c',
  'finished':       '#94a3b8',
  'archived':       'rgba(248, 250, 252, 0.25)',
};

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
  const [screensaverHoveredId, setScreensaverHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [stripFits, setStripFits] = useState(false);
  const [stripStaticOffset, setStripStaticOffset] = useState(0);
  const filterRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardCarouselRef = useRef<HTMLDivElement>(null);
  const lastNavRef = useRef<number>(0);
  const wrapDirRef = useRef<'none' | 'next' | 'prev'>('none');
  const wrapResetRef = useRef<(() => void) | null>(null);
  const carouselMountedRef = useRef(false);
  const stripWrapDirRef = useRef<'none' | 'next' | 'prev'>('none');
  const stripWrapResetRef = useRef<(() => void) | null>(null);
  const prevStripFitsRef = useRef(false);
  const stripNavHoldRef = useRef<{ dir: 1|-1; startTime: number; releasing: boolean; releaseTime: number; releaseVel: number; decelMs: number; raf: number|null } | null>(null);
  const stripNavClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const netflixWrapperRef = useRef<HTMLDivElement>(null);
  const screensaverRafRef = useRef<number | null>(null);
  const screensaverActiveRef = useRef(false);
  const screensaverHoveredIdRef = useRef<number | null>(null);
  const screensaverIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingStripCenterRef = useRef(false);
  const stripDragActiveRef = useRef(false);
  const stripPointerDownRef = useRef(false);
  const stripHoveredRef = useRef(false);

  // Both pointer hover and screensaver hover independently highlight timeline segments and strip cards
  const timelineHighlightIds = useMemo(() => {
    const ids = new Set<number>();
    if (hoveredProjectId !== null) ids.add(hoveredProjectId);
    if (screensaverHoveredId !== null) ids.add(screensaverHoveredId);
    return ids;
  }, [hoveredProjectId, screensaverHoveredId]);

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
  }

  function handleNavLeave() {
    setHoveredProjectId(null);
  }

  // Timeline hover drives the strip card hover (hoveredProjectId) so both can show simultaneously
  // with the screensaver's own hover (screensaverHoveredId)
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

  const [newestFirst, setNewestFirst] = useState(false);

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
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const stripFitsRef = useRef(stripFits);
  stripFitsRef.current = stripFits;

  function goNext() {
    if (sorted.length <= 1) return;
    if (wrapResetRef.current || stripWrapResetRef.current) return;
    const now = Date.now();
    if (now - lastNavRef.current < 220) return;
    lastNavRef.current = now;
    if (selectedIndex === sorted.length - 1) { wrapDirRef.current = 'next'; }
    const idx = selectedIndex < 0 ? 0 : (selectedIndex + 1) % sorted.length;
    setSelectedId(sorted[idx].id);
  }
  function goPrev() {
    if (sorted.length <= 1) return;
    if (wrapResetRef.current || stripWrapResetRef.current) return;
    const now = Date.now();
    if (now - lastNavRef.current < 220) return;
    lastNavRef.current = now;
    if (selectedIndex === 0) { wrapDirRef.current = 'prev'; }
    const idx = selectedIndex <= 0 ? sorted.length - 1 : selectedIndex - 1;
    setSelectedId(sorted[idx].id);
  }
  function selectTab(entry: TimelineEntry) {
    const n = sorted.length;
    const toIdx = sorted.findIndex(e => e.id === entry.id);
    const fromIdx = selectedIndex < 0 ? 0 : selectedIndex;
    const fwd = (toIdx - fromIdx + n) % n;
    const bwd = (fromIdx - toIdx + n) % n;
    const next = fwd <= bwd;
    const isWrap = (next && toIdx < fromIdx) || (!next && toIdx > fromIdx);
    if (isWrap) {
      wrapDirRef.current = next ? 'next' : 'prev';
    }
    resetScreensaverTimer();
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

  // stripFits: true when all cards fit without scrolling
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    prevStripFitsRef.current = false;
    setStripStaticOffset(0);
    function check() {
      const fits = sorted.length * 150 + Math.max(0, sorted.length - 1) * 10 <= strip!.clientWidth - 4;
      if (fits && !prevStripFitsRef.current) {
        // Rotate so selected card lands in the middle of the static strip
        const idx = selectedIndexRef.current < 0 ? 0 : selectedIndexRef.current;
        const n = sorted.length;
        setStripStaticOffset(((idx - Math.floor(n / 2)) % n + n) % n);
      }
      prevStripFitsRef.current = fits;
      setStripFits(fits);
    }
    check();
    const ro = new ResizeObserver(check);
    ro.observe(strip);
    return () => ro.disconnect();
  }, [sorted]);

  // Initial centering: useLayoutEffect to avoid a painted frame at the wrong position
  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip || stripFits) return;
    if (stripWrapResetRef.current) { stripWrapResetRef.current(); stripWrapResetRef.current = null; }
    stripWrapDirRef.current = 'none';
    let tid: ReturnType<typeof setTimeout> | null = null;
    function center() {
      const third = strip!.scrollWidth / 3;
      if (third === 0) { tid = setTimeout(center, 50); return; }
      const active = strip!.querySelector<HTMLElement>('[data-selected="true"]');
      if (active) {
        const sr = strip!.getBoundingClientRect();
        const er = active.getBoundingClientRect();
        strip!.scrollLeft = strip!.scrollLeft + (er.left - sr.left) - sr.width / 2 + er.width / 2;
      } else {
        strip!.scrollLeft = third;
      }
    }
    center();
    return () => { if (tid !== null) clearTimeout(tid); };
  }, [sorted, stripFits]);


  // Re-center on resize
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || stripFits) return;
    const ro = new ResizeObserver(() => {
      if (stripWrapResetRef.current) return;
      const active = strip.querySelector<HTMLElement>('[data-selected="true"]');
      if (!active) return;
      const sr = strip.getBoundingClientRect();
      const er = active.getBoundingClientRect();
      strip.scrollLeft = strip.scrollLeft + (er.left - sr.left) - sr.width / 2 + er.width / 2;
    });
    ro.observe(strip);
    return () => ro.disconnect();
  }, [stripFits]);

  // Boundary-based loop detection: keep scrollLeft in [third, 2*third)
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || stripFits || sorted.length <= 1) return;
    function onScroll() {
      if (stripWrapResetRef.current) return;
      const third = strip!.scrollWidth / 3;
      const center = strip!.scrollLeft + strip!.clientWidth / 2;
      if (center >= third * 2) strip!.scrollLeft -= third;
      else if (center < third) strip!.scrollLeft += third;
    }
    strip.addEventListener('scroll', onScroll, { passive: true });
    return () => strip.removeEventListener('scroll', onScroll);
  }, [stripFits, sorted]);

  useEffect(() => {
    carouselMountedRef.current = false;
    if (wrapResetRef.current) { wrapResetRef.current(); wrapResetRef.current = null; }
    wrapDirRef.current = 'none';
  }, [sorted]);

  useEffect(() => {
    const carousel = cardCarouselRef.current;
    if (!carousel || selectedId === null) return;

    function getTarget(el: HTMLElement): number {
      const cr = carousel!.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      return carousel!.scrollLeft + (er.left - cr.left) - (cr.width / 2) + (er.width / 2);
    }

    const active = carousel.querySelector<HTMLElement>('[data-carousel-selected="true"]');

    if (!carouselMountedRef.current) {
      carouselMountedRef.current = true;
      if (active) carousel.scrollLeft = getTarget(active);
      return;
    }

    const wrap = wrapDirRef.current;
    wrapDirRef.current = 'none';

    if (wrap !== 'none') {
      const clone = carousel.querySelector<HTMLElement>(
        wrap === 'next' ? '[data-carousel-clone="end"]' : '[data-carousel-clone="start"]'
      );
      if (clone) {
        if (wrapResetRef.current) { wrapResetRef.current(); wrapResetRef.current = null; }
        // Pre-position at the wrap boundary so the animation is always exactly 1 card
        const boundary = wrap === 'next'
          ? clone.previousElementSibling as HTMLElement | null  // last real card
          : clone.nextElementSibling as HTMLElement | null;     // first real card
        if (boundary) carousel.scrollLeft = getTarget(boundary);
        clone.style.opacity = '1';
        clone.style.transition = 'none';
        wrapResetRef.current = smoothScrollTo(carousel, getTarget(clone), 200, () => {
          clone.style.opacity = '';
          clone.style.transition = '';
          const real = carousel.querySelector<HTMLElement>('[data-carousel-selected="true"]');
          if (real) carousel.scrollLeft = getTarget(real);
          wrapResetRef.current = null;
        });
        return;
      }
    }

    // No wrap: skip if already at target (e.g. after touch-scroll sync),
    // smooth for short hops, instant for large jumps
    if (active) {
      const target = getTarget(active);
      if (Math.abs(target - carousel.scrollLeft) < 4) return;
      if (Math.abs(target - carousel.scrollLeft) <= carousel.clientWidth * 1.5) {
        carousel.scrollTo({ left: target, behavior: 'smooth' });
      } else {
        carousel.scrollLeft = target;
      }
    }
  }, [selectedId, sorted]);

  useEffect(() => {
    const carousel = cardCarouselRef.current;
    if (!carousel || sorted.length <= 1) return;
    function onScroll() {
      if (wrapResetRef.current) return;
      const startClone = carousel!.querySelector<HTMLElement>('[data-carousel-clone="start"]');
      const endClone   = carousel!.querySelector<HTMLElement>('[data-carousel-clone="end"]');
      if (!startClone || !endClone) return;
      const firstReal = startClone.nextElementSibling as HTMLElement | null;
      if (!firstReal) return;
      const cr  = carousel!.getBoundingClientRect();
      const cx  = cr.left + cr.width / 2;
      const scr = startClone.getBoundingClientRect();
      const ecr = endClone.getBoundingClientRect();
      const span = ecr.left - firstReal.getBoundingClientRect().left;
      if (scr.right > cx) carousel!.scrollTo({ left: carousel!.scrollLeft + span, behavior: 'instant' });
      else if (ecr.left < cx) carousel!.scrollTo({ left: carousel!.scrollLeft - span, behavior: 'instant' });
    }
    carousel.addEventListener('scroll', onScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', onScroll);
  }, [sorted]);

  useEffect(() => {
    const carousel = cardCarouselRef.current;
    if (!carousel) return;
    const ro = new ResizeObserver(() => {
      if (wrapResetRef.current) return;
      const active = carousel.querySelector<HTMLElement>('[data-carousel-selected="true"]');
      if (!active) return;
      // offsetLeft is always relative to the scroll container, unaffected by reflow timing
      carousel.scrollLeft = active.offsetLeft - (carousel.clientWidth - active.offsetWidth) / 2;
    });
    ro.observe(carousel);
    return () => ro.disconnect();
  }, []);

  // After a touch-scroll on the large carousel, sync selectedId to whichever
  // real card ended up nearest to center (scrollend fires after momentum settles)
  useEffect(() => {
    const carousel = cardCarouselRef.current;
    if (!carousel || sorted.length <= 1) return;
    let touchActive = false;
    let debounce: ReturnType<typeof setTimeout> | null = null;

    function sync() {
      if (!touchActive || wrapResetRef.current) return;
      touchActive = false;
      const cx = carousel!.scrollLeft + carousel!.clientWidth / 2;
      const cards = Array.from(carousel!.querySelectorAll<HTMLElement>('[data-carousel-id]'));
      let nearest: HTMLElement | null = null;
      let minDist = Infinity;
      for (const card of cards) {
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - cx);
        if (dist < minDist) { minDist = dist; nearest = card; }
      }
      if (!nearest) return;
      const id = Number(nearest.dataset.carouselId);
      if (id !== selectedIdRef.current) {
        wrapDirRef.current = 'none'; // already at destination, no wrap animation
        setSelectedId(id);
      }
    }

    function onTouchStart() { touchActive = true; }
    function onScroll() {
      if (!touchActive) return;
      if (debounce !== null) clearTimeout(debounce);
      debounce = setTimeout(sync, 150);
    }
    function onScrollEnd() {
      if (!touchActive) return;
      if (debounce !== null) { clearTimeout(debounce); debounce = null; }
      sync();
    }

    carousel.addEventListener('touchstart', onTouchStart, { passive: true });
    carousel.addEventListener('scroll', onScroll, { passive: true });
    carousel.addEventListener('scrollend', onScrollEnd);
    return () => {
      carousel.removeEventListener('touchstart', onTouchStart);
      carousel.removeEventListener('scroll', onScroll);
      carousel.removeEventListener('scrollend', onScrollEnd);
      if (debounce !== null) clearTimeout(debounce);
    };
  }, [sorted]);

  // Center the strip on the newly selected card when triggered by an explicit navigation action
  // (e.g. timeline click). Flag is set by the caller; effect fires after DOM commits.
  useEffect(() => {
    if (!pendingStripCenterRef.current) return;
    pendingStripCenterRef.current = false;
    centerSelectedInStrip();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function resetScreensaverTimer() {
    if (screensaverIdleTimerRef.current !== null) clearTimeout(screensaverIdleTimerRef.current);
    if (screensaverActiveRef.current) stopScreensaver();
    // Never schedule while the user is hovering the strip or has the pointer pressed down
    if (stripHoveredRef.current || stripPointerDownRef.current) return;
    screensaverIdleTimerRef.current = setTimeout(() => {
      screensaverIdleTimerRef.current = null;
      startScreensaver();
    }, 3000);
  }

  function updateStripHoverFromCenter() {
    const strip = stripRef.current;
    if (!strip) return;
    const center = strip.scrollLeft + strip.clientWidth / 2;
    const cards = strip.querySelectorAll<HTMLElement>('[data-strip-id]');
    let nearest: HTMLElement | null = null;
    let minDist = Infinity;
    for (const card of Array.from(cards)) {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; nearest = card; }
    }
    if (nearest) {
      const id = Number(nearest.dataset.stripId);
      if (id !== screensaverHoveredIdRef.current) { screensaverHoveredIdRef.current = id; setScreensaverHoveredId(id); }
    }
  }

  function stopScreensaver() {
    screensaverActiveRef.current = false;
    if (screensaverRafRef.current !== null) { cancelAnimationFrame(screensaverRafRef.current); screensaverRafRef.current = null; }
    if (screensaverHoveredIdRef.current !== null) { screensaverHoveredIdRef.current = null; setScreensaverHoveredId(null); }
  }

  function startScreensaver() {
    if (screensaverActiveRef.current || stripFitsRef.current || stripHoveredRef.current || stripPointerDownRef.current) return;
    screensaverActiveRef.current = true;
    function tick() {
      const strip = stripRef.current;
      if (!strip || !screensaverActiveRef.current) return;
      strip.scrollLeft += 0.6;
      updateStripHoverFromCenter();
      screensaverRafRef.current = requestAnimationFrame(tick);
    }
    screensaverRafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    const wrapper = netflixWrapperRef.current;
    const strip   = stripRef.current;
    if (!wrapper) return;

    function onEnter() {
      stripHoveredRef.current = true;
      if (screensaverIdleTimerRef.current !== null) { clearTimeout(screensaverIdleTimerRef.current); screensaverIdleTimerRef.current = null; }
      stopScreensaver();
    }
    function onLeave() {
      stripHoveredRef.current = false;
      resetScreensaverTimer();
    }

    // Mobile: native touch-scroll on the strip — block screensaver for the duration of the gesture
    function onTouchStart() { stripPointerDownRef.current = true; }
    function onTouchEnd() {
      stripPointerDownRef.current = false;
      if (!stripHoveredRef.current) resetScreensaverTimer();
    }

    resetScreensaverTimer();
    wrapper.addEventListener('pointerenter', onEnter);
    wrapper.addEventListener('pointerleave', onLeave);
    if (strip) {
      strip.addEventListener('touchstart',  onTouchStart, { passive: true });
      strip.addEventListener('touchend',    onTouchEnd,   { passive: true });
      strip.addEventListener('touchcancel', onTouchEnd,   { passive: true });
    }
    return () => {
      if (screensaverIdleTimerRef.current !== null) { clearTimeout(screensaverIdleTimerRef.current); screensaverIdleTimerRef.current = null; }
      stopScreensaver();
      wrapper.removeEventListener('pointerenter', onEnter);
      wrapper.removeEventListener('pointerleave', onLeave);
      if (strip) {
        strip.removeEventListener('touchstart',  onTouchStart);
        strip.removeEventListener('touchend',    onTouchEnd);
        strip.removeEventListener('touchcancel', onTouchEnd);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted, stripFits]);

  function centerSelectedInCarousel() {
    const carousel = cardCarouselRef.current;
    if (!carousel || selectedId === null) return;
    const active = carousel.querySelector<HTMLElement>('[data-carousel-selected="true"]');
    if (!active) return;
    const target = active.offsetLeft - (carousel.clientWidth - active.offsetWidth) / 2;
    if (Math.abs(target - carousel.scrollLeft) < 4) return;
    carousel.scrollTo({ left: target, behavior: 'smooth' });
  }

  function centerSelectedInStrip() {
    const strip = stripRef.current;
    if (!strip || stripFits) return;
    resetScreensaverTimer();
    const third = strip.scrollWidth / 3;
    if (third === 0) return;
    const active = strip.querySelector<HTMLElement>('[data-selected="true"]');
    if (!active) return;
    if (stripWrapResetRef.current) { stripWrapResetRef.current(); stripWrapResetRef.current = null; }
    const target = active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2;
    const cur = strip.scrollLeft;
    const candidates = [target - third, target, target + third];
    const dists = candidates.map(t => Math.abs(t - cur));
    const bestIdx = dists.indexOf(Math.min(...dists));
    const best = candidates[bestIdx];
    if (Math.abs(best - cur) < 4) return;
    const adjust = [third, 0, -third][bestIdx];
    stripWrapResetRef.current = smoothScrollTo(strip, best, 300, () => {
      if (adjust !== 0) strip.scrollLeft += adjust;
      stripWrapResetRef.current = null;
    });
  }

  function startStripNavHold(dir: 1 | -1) {
    // Cancel inertia if running; bail if already in an active (non-releasing) hold
    if (stripNavHoldRef.current) {
      if (!stripNavHoldRef.current.releasing) return;
      if (stripNavHoldRef.current.raf) cancelAnimationFrame(stripNavHoldRef.current.raf);
      stripNavHoldRef.current = null;
    }
    const MAX_VEL = 8, ACCEL_MS = 500, DECEL_MS = 350;
    const state = { dir, startTime: performance.now(), releasing: false, releaseTime: 0, releaseVel: 0, decelMs: DECEL_MS, raf: null as number | null };
    stripNavHoldRef.current = state;
    function tick() {
      const strip = stripRef.current;
      const s = stripNavHoldRef.current;
      if (!strip || !s) return;
      const now = performance.now();
      let vel: number;
      if (s.releasing) {
        const p = 1 - Math.min((now - s.releaseTime) / s.decelMs, 1);
        vel = s.releaseVel * p * p;
        if (p <= 0) {
          stripNavHoldRef.current = null;
          screensaverHoveredIdRef.current = null;
          setScreensaverHoveredId(null);
          return;
        }
      } else {
        const p = Math.min((now - s.startTime) / ACCEL_MS, 1);
        vel = MAX_VEL * p * p;
      }
      strip.scrollLeft += s.dir * vel;
      updateStripHoverFromCenter();
      s.raf = requestAnimationFrame(tick);
    }
    state.raf = requestAnimationFrame(tick);
  }

  function startStripInertia(vel: number) {
    if (stripNavHoldRef.current?.raf) cancelAnimationFrame(stripNavHoldRef.current.raf);
    const dir = (vel > 0 ? 1 : -1) as 1 | -1;
    const releaseVel = Math.abs(vel);
    // Decel time scales with velocity — faster fling → longer coast
    const decelMs = Math.min(releaseVel * 50, 900);
    const state = { dir, startTime: 0, releasing: true, releaseTime: performance.now(), releaseVel, decelMs, raf: null as number | null };
    stripNavHoldRef.current = state;
    function tick() {
      const strip = stripRef.current;
      const s = stripNavHoldRef.current;
      if (!strip || !s) return;
      const p = 1 - Math.min((performance.now() - s.releaseTime) / s.decelMs, 1);
      if (p <= 0) { stripNavHoldRef.current = null; screensaverHoveredIdRef.current = null; setScreensaverHoveredId(null); return; }
      strip.scrollLeft += s.dir * s.releaseVel * p * p;
      updateStripHoverFromCenter();
      s.raf = requestAnimationFrame(tick);
    }
    state.raf = requestAnimationFrame(tick);
  }

  function stopStripNavHold() {
    const s = stripNavHoldRef.current;
    if (!s || s.releasing) return;
    const p = Math.min((performance.now() - s.startTime) / 500, 1);
    s.releaseVel = 8 * p * p;
    s.releasing = true;
    s.releaseTime = performance.now();
  }

  function handleStripNavDown(e: React.PointerEvent, dir: 1 | -1) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    stripNavClickTimerRef.current = setTimeout(() => {
      stripNavClickTimerRef.current = null;
      startStripNavHold(dir);
    }, 180);
  }

  function handleStripNavUp(_e: React.PointerEvent, dir: 1 | -1) {
    if (stripNavClickTimerRef.current !== null) {
      clearTimeout(stripNavClickTimerRef.current);
      stripNavClickTimerRef.current = null;
      // Quick click: start hold and immediately release with a preset burst velocity
      startStripNavHold(dir);
      const s = stripNavHoldRef.current;
      if (s) { s.releaseVel = 10; s.releasing = true; s.releaseTime = performance.now(); }
    } else {
      stopStripNavHold();
    }
  }

  function handleStripNavLeave() {
    if (stripNavClickTimerRef.current !== null) {
      clearTimeout(stripNavClickTimerRef.current);
      stripNavClickTimerRef.current = null;
    }
    stopStripNavHold();
  }

  function handleStripPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return; // native scroll handles touch
    if (e.button !== 0) return;
    const strip = stripRef.current;
    if (!strip || stripFits) return;
    // Cancel any ongoing inertia
    if (stripNavHoldRef.current?.raf) cancelAnimationFrame(stripNavHoldRef.current.raf);
    stripNavHoldRef.current = null;
    const startX = e.clientX;
    const startScrollLeft = strip.scrollLeft;
    stripDragActiveRef.current = false;
    stripPointerDownRef.current = true;
    resetScreensaverTimer();
    // Velocity samples: record last ~100 ms of movement for momentum
    const samples: Array<{ t: number; x: number }> = [];

    function onMove(me: PointerEvent) {
      if (!strip) return;
      const dx = me.clientX - startX;
      if (!stripDragActiveRef.current && Math.abs(dx) > 5) stripDragActiveRef.current = true;
      if (stripDragActiveRef.current) {
        strip.scrollLeft = startScrollLeft - dx;
        updateStripHoverFromCenter();
        const now = performance.now();
        samples.push({ t: now, x: me.clientX });
        while (samples.length > 1 && now - samples[0].t > 100) samples.shift();
      }
    }
    function onUp() {
      stripPointerDownRef.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      // If pointer released outside the wrapper, start the idle timer now
      // (pointerleave fired earlier but was suppressed by stripPointerDownRef)
      if (!stripHoveredRef.current) resetScreensaverTimer();
      if (stripDragActiveRef.current) {
        // Compute release velocity (positive = scrollLeft increasing, negative = decreasing)
        let launchedInertia = false;
        if (samples.length >= 2) {
          const first = samples[0];
          const last = samples[samples.length - 1];
          const dt = last.t - first.t;
          if (dt > 5) {
            // first.x - last.x: positive if mouse moved left (content scrolls right)
            const velPxPerFrame = ((first.x - last.x) / dt) * (1000 / 60);
            if (Math.abs(velPxPerFrame) > 0.5) { startStripInertia(velPxPerFrame); launchedInertia = true; }
          }
        }
        if (!launchedInertia) {
          // No momentum — clear hover immediately (consistent with nav arrow behavior)
          screensaverHoveredIdRef.current = null;
          setScreensaverHoveredId(null);
        }
        // Let the click event consume the drag flag before clearing
        setTimeout(() => { stripDragActiveRef.current = false; }, 0);
      }
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
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
          <GitTimeline showAxis highlightIds={timelineHighlightIds} selectedId={selectedId ?? undefined} onHoverChange={handleTimelineHover} onSelect={id => { const e = sorted.find(x => x.id === id); if (e) { pendingStripCenterRef.current = true; selectTab(e); } }} activeIds={activeIds} />
        </div>
      </div>

      {sorted.length > 0 && (() => {
        const entry = sorted.find(e => e.id === selectedId) ?? sorted[0];
        return (
          <>
            {/* Thumbnail strip */}
            <div className={styles.netflixWrapper} ref={netflixWrapperRef}>
              {!stripFits && <button
                className={`${styles.stripNavBtn} ${styles.stripNavBtnLeft}`}
                onPointerDown={e => handleStripNavDown(e, -1)}
                onPointerUp={e => handleStripNavUp(e, -1)}
                onPointerLeave={handleStripNavLeave}
                tabIndex={-1}
              >‹</button>}
              <div className={`${styles.netflixStrip} ${stripFits ? styles.netflixStripCentered : styles.netflixStripScrollable}`} ref={stripRef} onPointerDown={handleStripPointerDown}>
                {/* Three copies for seamless infinite loop */}
                {!stripFits && sorted.length > 1
                  ? [0, 1, 2].flatMap(copyIdx =>
                      sorted.map(e => {
                        const key = e.title.toLowerCase();
                        const imageUrl = e.title === FEATURED_PROJECT.title ? FEATURED_PROJECT.imageUrl : systemByTitle.get(key)?.imageUrl ?? gameByTitle.get(key)?.imageUrl ?? '';
                        const isSelected = e.id === selectedId;
                        const isHovered  = !isSelected && (e.id === hoveredProjectId || e.id === screensaverHoveredId);
                        return (
                          <button
                            key={`${e.id}-${copyIdx}`}
                            data-strip-id={e.id}
                            data-selected={copyIdx === 1 && e.id === selectedId ? 'true' : undefined}
                            className={`${styles.stripCard} ${isSelected ? styles.stripCardActive : isHovered ? styles.stripCardHovered : ''}`}
                            style={{ '--type-color': TYPE_COLOR[e.type], '--type-rgb': TYPE_RGB[e.type] } as React.CSSProperties}
                            onClick={ev => { if (stripDragActiveRef.current) return; selectTab(e); (ev.currentTarget as HTMLElement).blur(); }}
                            onPointerEnter={ev => handleNavEnter(ev, e)}
                            onPointerLeave={handleNavLeave}
                            tabIndex={copyIdx !== 1 ? -1 : undefined}
                          >
                            <div className={styles.stripCardTypeBar} />
                            {imageUrl && <div className={styles.stripCardBg} style={{ backgroundImage: `url(${imageUrl})` }} />}
                            <div className={styles.stripCardOverlay} />
                            <div className={styles.stripCardTopRight}>
                              <span className={styles.stripCardStatus} style={{ color: STATUS_COLOR[e.status], borderColor: STATUS_COLOR[e.status] }}>{STATUS_SHORT[e.status]}</span>
                            </div>
                            <div className={styles.stripCardContent}>
                              <span className={styles.stripCardName}>{e.title}</span>
                              <span className={styles.stripCardContext}>{getContext(e)}</span>
                              <span className={styles.stripCardMeta}>{e.period}</span>
                            </div>
                          </button>
                        );
                      })
                    )
                  : (() => {
                      const off = stripStaticOffset % sorted.length;
                      const rotated = off > 0 ? [...sorted.slice(off), ...sorted.slice(0, off)] : sorted;
                      return rotated;
                    })().map(e => {
                      const key = e.title.toLowerCase();
                      const imageUrl = e.title === FEATURED_PROJECT.title ? FEATURED_PROJECT.imageUrl : systemByTitle.get(key)?.imageUrl ?? gameByTitle.get(key)?.imageUrl ?? '';
                      const isSelected = e.id === selectedId;
                      const isHovered  = !isSelected && e.id === hoveredProjectId;
                      return (
                        <button
                          key={e.id}
                          data-strip-id={e.id}
                          data-selected={e.id === selectedId ? 'true' : undefined}
                          className={`${styles.stripCard} ${isSelected ? styles.stripCardActive : isHovered ? styles.stripCardHovered : ''}`}
                          style={{ '--type-color': TYPE_COLOR[e.type], '--type-rgb': TYPE_RGB[e.type] } as React.CSSProperties}
                          onClick={ev => { if (stripDragActiveRef.current) return; selectTab(e); (ev.currentTarget as HTMLElement).blur(); }}
                          onPointerEnter={ev => handleNavEnter(ev, e)}
                          onPointerLeave={handleNavLeave}
                        >
                          <div className={styles.stripCardTypeBar} />
                          {imageUrl && <div className={styles.stripCardBg} style={{ backgroundImage: `url(${imageUrl})` }} />}
                          <div className={styles.stripCardOverlay} />
                          <div className={styles.stripCardTopRight}>
                            <span className={styles.stripCardStatus} style={{ color: STATUS_COLOR[e.status], borderColor: STATUS_COLOR[e.status] }}>{STATUS_SHORT[e.status]}</span>
                          </div>
                          <div className={styles.stripCardContent}>
                            <span className={styles.stripCardName}>{e.title}</span>
                            <span className={styles.stripCardContext}>{getContext(e)}</span>
                            <span className={styles.stripCardMeta}>{e.period}</span>
                          </div>
                        </button>
                      );
                    })
                }
              </div>
              {!stripFits && <button
                className={`${styles.stripNavBtn} ${styles.stripNavBtnRight}`}
                onPointerDown={e => handleStripNavDown(e, 1)}
                onPointerUp={e => handleStripNavUp(e, 1)}
                onPointerLeave={handleStripNavLeave}
                tabIndex={-1}
              >›</button>}
            </div>

            {/* Large card carousel */}
            <div
              className={styles.cardCarouselWrapper}
              style={{ '--accent-color': TYPE_COLOR[entry.type], '--accent-rgb': TYPE_RGB[entry.type] } as React.CSSProperties}
            >
              {sorted.length > 1 && (
                <>
                  <button className={`${styles.sideNavBtn} ${styles.sideNavBtnLeft}`} onClick={goPrev} tabIndex={-1}>‹</button>
                  <button className={`${styles.sideNavBtn} ${styles.sideNavBtnRight}`} onClick={goNext} tabIndex={-1}>›</button>
                </>
              )}
              <div
                className={`${styles.cardCarousel} ${sorted.length === 1 ? styles.cardCarouselSingle : ''}`}
                ref={cardCarouselRef}
              >
                {sorted.length > 1 && [
                  sorted.length >= 2 ? sorted[sorted.length - 2] : null,
                  sorted[sorted.length - 1],
                ].map((e, i) => {
                  if (!e) return null;
                  const card = renderCard(e);
                  if (!card) return null;
                  return (
                    <div
                      key={`clone-start-${i}`}
                      data-carousel-clone={i === 1 ? 'start' : undefined}
                      className={styles.cardCarouselItem}
                      style={{ '--accent-color': TYPE_COLOR[e.type], '--accent-rgb': TYPE_RGB[e.type] } as React.CSSProperties}
                      onClick={goPrev}
                    >
                      {card}
                    </div>
                  );
                })}
                {sorted.map(e => {
                  const card = renderCard(e);
                  if (!card) return null;
                  const isActive = e.id === selectedId;
                  return (
                    <div
                      key={e.id}
                      data-carousel-id={e.id}
                      data-carousel-selected={isActive ? 'true' : undefined}
                      className={`${styles.cardCarouselItem} ${isActive ? styles.cardCarouselItemActive : ''}`}
                      style={{ '--accent-color': TYPE_COLOR[e.type], '--accent-rgb': TYPE_RGB[e.type] } as React.CSSProperties}
                      onClick={() => { if (isActive) { centerSelectedInCarousel(); centerSelectedInStrip(); } else { selectTab(e); } }}
                    >
                      {card}
                    </div>
                  );
                })}
                {sorted.length > 1 && [
                  sorted[0],
                  sorted.length >= 2 ? sorted[1] : null,
                ].map((e, i) => {
                  if (!e) return null;
                  const card = renderCard(e);
                  if (!card) return null;
                  return (
                    <div
                      key={`clone-end-${i}`}
                      data-carousel-clone={i === 0 ? 'end' : undefined}
                      className={styles.cardCarouselItem}
                      style={{ '--accent-color': TYPE_COLOR[e.type], '--accent-rgb': TYPE_RGB[e.type] } as React.CSSProperties}
                      onClick={goNext}
                    >
                      {card}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}

export default ProjectsPage;
