import { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { TIMELINE_DATA, CATEGORY_LABELS, TYPE_LABELS } from '../data/timeline';
import type { ProjectCategory, ProjectType, TimelineEntry } from '../data/timeline';
import type { ProjectStatus } from '../data/projects';
import styles from './GitTimeline.module.css';

// ─── Date → numeric value (month precision) ──────────────────────────────────

const _now = new Date();
const ONGOING_END = _now.getFullYear() + _now.getMonth() / 12 + 1 / 12; // today + 1 month

function dateToVal(yyyymm: string): number {
  const [y, m] = yyyymm.split('-').map(Number);
  return y + (m - 1) / 12;
}

// ─── Lane assignment (greedy interval scheduling) ───────────────────────────

export interface PositionedEntry extends TimelineEntry {
  lane: number;
  startVal: number;
  endVal: number;
}

function assignLanes(data: TimelineEntry[]): PositionedEntry[] {
  const parsed: PositionedEntry[] = data.map(e => {
    const startVal = dateToVal(e.startDate);
    const endVal   = e.endDate ? dateToVal(e.endDate) + 1 / 12 : ONGOING_END;
    return { ...e, startVal, endVal, lane: 0 };
  });

  const sorted = [...parsed].sort((a, b) =>
    a.startVal - b.startVal ||  // 1. earlier start first
    b.endVal   - a.endVal   ||  // 2. later end → lower lane
    a.startVal - b.startVal     // 3. same end → earlier start → lower lane
  );
  const laneEnds: number[] = [];

  sorted.forEach(entry => {
    let lane = laneEnds.findIndex(t => t <= entry.startVal);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = entry.endVal;
    entry.lane = lane;
  });

  return sorted;
}

// ─── Layout constants ────────────────────────────────────────────────────────

const _starts = TIMELINE_DATA.map(e => dateToVal(e.startDate));
const _ends   = TIMELINE_DATA.map(e => e.endDate ? dateToVal(e.endDate) + 1 / 12 : ONGOING_END);
const TIME_MIN = Math.min(..._starts) - 1 / 12;
const TIME_MAX = Math.max(..._ends)   + 1 / 12;

const PAD_X     = 24;
const PAD_TOP   = 10;
const LANE_H    = 14;
const DOT_R     = 5;        // kept for pulse ring on ongoing projects
const PAD_BOT   = 24;       // year labels
const SEG_GAP   = 4;        // = border strokeWidth/2, matches outer rounded cap radius

// TYPE_COLOR is built per-render from the active theme (see GitTimeline component)
type TypeColorMap = Record<ProjectType, string>;

function tX(val: number, w: number) {
  return PAD_X + ((val - TIME_MIN) / (TIME_MAX - TIME_MIN)) * (w - 2 * PAD_X);
}
function lY(lane: number) {
  return PAD_TOP + lane * LANE_H;
}



// ─── Label & status maps ─────────────────────────────────────────────────────

const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-development': 'In Development',
  'released':       'Released',
  'finished':       'Finished',
  'archived':       'Archived',
};

// ─── Component ───────────────────────────────────────────────────────────────

const TOOLTIP_W = 280;

interface GitTimelineProps {
  category?: ProjectCategory;
  showAxis?: boolean;
  highlightId?: number;
  selectedId?: number;
  forcedTooltipId?: number;
  onHoverChange?: (id: number | null) => void;
  onSelect?: (id: number) => void;
  activeIds?: Set<number>;
  singleLane?: boolean;
}

const HOVER_DELAY = 500;

function GitTimeline({ category, showAxis = false, highlightId, selectedId, forcedTooltipId, onHoverChange, onSelect, activeIds, singleLane = false }: GitTimelineProps) {
  const { theme } = useTheme();
  const TYPE_COLOR = useMemo<TypeColorMap>(() => ({
    game:   theme.colors.typeGame,
    engine: theme.colors.typeEngine,
    system: theme.colors.typeSystem,
  }), [theme]);
  const bgPage = theme.swatchBg;

  const wrapperRef    = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [svgW, setSvgW] = useState(900);
  const [tooltip, setTooltip]       = useState<{ entry: PositionedEntry; x: number } | null>(null);
  const [forcedTooltip, setForcedTooltip] = useState<{ entry: PositionedEntry; x: number } | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSvgW(Math.max(e.contentRect.width, 1)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data     = useMemo(
    () => category ? TIMELINE_DATA.filter(e => e.category === category) : TIMELINE_DATA,
    [category],
  );
  const entries  = useMemo(() => {
    const e = assignLanes(data);
    if (singleLane) e.forEach(p => { p.lane = 0; });
    return e;
  }, [data, singleLane]);
  const maxLane  = useMemo(() => Math.max(...entries.map(e => e.lane)), [entries]);
  const svgH     = PAD_TOP + maxLane * LANE_H + DOT_R + (showAxis ? PAD_BOT : 8);

  useEffect(() => {
    if (forcedTooltipId == null) { setForcedTooltip(null); return; }
    const entry = entries.find(e => e.id === forcedTooltipId);
    if (!entry) return;
    const midVal = entry.startVal + (Math.min(entry.endVal, TIME_MAX) - entry.startVal) / 2;
    const x = tX(Math.min(Math.max(midVal, TIME_MIN), TIME_MAX), svgW);
    setForcedTooltip({ entry, x });
  }, [forcedTooltipId, entries, svgW]);

  const displayTooltip = forcedTooltip ?? tooltip;

  const YEARS = (() => {
    const first = Math.ceil(TIME_MIN);
    const last  = Math.floor(TIME_MAX);
    const step  = svgW < 480 ? 2 : 1;
    const years = [];
    for (let y = first; y <= last; y += step) years.push(y);
    return years;
  })();

  function handleEnter(e: React.PointerEvent<SVGLineElement>, entry: PositionedEntry) {
    if (e.pointerType === 'touch') return;
    const wrapperRect = wrapperRef.current!.getBoundingClientRect();
    const x = e.clientX - wrapperRect.left;
    onHoverChange?.(entry.id);
    hoverTimerRef.current = setTimeout(() => setTooltip({ entry, x }), HOVER_DELAY);
  }

  function handleLeave(e: React.PointerEvent<SVGLineElement>) {
    if (e.pointerType === 'touch') return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setTooltip(null);
    onHoverChange?.(null);
  }

  function handleMove(e: React.PointerEvent<SVGLineElement>) {
    if (e.pointerType === 'touch' || !tooltip) return;
    const wrapperRect = wrapperRef.current!.getBoundingClientRect();
    setTooltip(t => t ? { ...t, x: e.clientX - wrapperRect.left } : null);
  }

  function tipLeft(x: number) {
    const ww = wrapperRef.current?.getBoundingClientRect().width ?? svgW;
    return Math.min(Math.max(x - TOOLTIP_W / 2, 8), ww - TOOLTIP_W - 8);
  }
  function arrowLeft(x: number) {
    return Math.min(Math.max(x - tipLeft(x) - 5, 10), TOOLTIP_W - 20);
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {/* Tooltip rendered outside scroll container */}
      {displayTooltip && (
        <div
          className={styles.tooltip}
          style={{ left: tipLeft(displayTooltip.x), '--tip-color': TYPE_COLOR[displayTooltip.entry.type] } as React.CSSProperties}
        >
          <div className={styles.arrow} style={{ left: arrowLeft(displayTooltip.x) }} />
          <div className={styles.tipHeader}>
            <div className={styles.tipLeft}>
              <div className={styles.tipTitle}>{displayTooltip.entry.title}</div>
              <div className={styles.tipContext}>
                {displayTooltip.entry.engine ?? TYPE_LABELS[displayTooltip.entry.type]}
              </div>
            </div>
            <div className={styles.tipRight}>
              <span className={`${styles.statusBadge} ${styles[`status-${displayTooltip.entry.status}`]}`}>
                {STATUS_LABEL[displayTooltip.entry.status]}
              </span>
              <span className={styles.tipCategoryLabel}>
                {displayTooltip.entry.categoryLabel ?? (displayTooltip.entry.category === 'hobby' ? 'InHouse' : CATEGORY_LABELS[displayTooltip.entry.category])}
              </span>
              <span className={styles.tipPeriod}>{displayTooltip.entry.period}</span>
            </div>
          </div>
          <div className={styles.tipFooter}>{displayTooltip.entry.contribution}</div>
        </div>
      )}

      <div className={styles.scroll}>
        <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" overflow="visible" className={styles.svg}>

          {/* Per-project segments — always visible, glow on hover */}
          {entries.map(entry => {
            const rawX1   = tX(entry.startVal, svgW);
            const rawX2   = entry.ongoing ? svgW - PAD_X : Math.min(tX(entry.endVal, svgW), svgW - PAD_X);
            const visX1   = rawX1 + SEG_GAP;
            const visX2   = Math.max(visX1 + 2, rawX2 - SEG_GAP); // at least 2px wide
            const cy      = lY(entry.lane);
            const color    = TYPE_COLOR[entry.type];
            const hovered  = displayTooltip?.entry.id === entry.id || highlightId === entry.id || selectedId === entry.id;
            const isActive = !activeIds || activeIds.has(entry.id);
            return (
              <g key={`seg-${entry.id}`} style={{ transition: 'opacity 0.25s' }} opacity={isActive ? 1 : 0.22}>
                {/* Pulse ring for ongoing — kept without the dot */}
                {entry.ongoing && (
                  <circle cx={rawX2} cy={cy} r={DOT_R + 3} fill={color} opacity={0.15} className={styles.pulse} />
                )}
                {/* Border layer — background colour creates clean rim + separation */}
                <line
                  x1={visX1} y1={cy} x2={visX2} y2={cy}
                  stroke={bgPage}
                  strokeWidth={hovered ? 10 : 8}
                  strokeLinecap="round"
                  opacity={1}
                  pointerEvents="none"
                />
                {/* Fill layer — type colour on top */}
                <line
                  x1={visX1} y1={cy} x2={visX2} y2={cy}
                  stroke={color}
                  strokeWidth={hovered ? 7 : 5}
                  strokeLinecap="round"
                  opacity={hovered ? 0.95 : 0.45}
                  style={{
                    transition: 'opacity 0.25s, stroke-width 0.15s',
                    filter: hovered ? `drop-shadow(0 0 6px ${color})` : 'none',
                  }}
                  pointerEvents="none"
                />
                {/* Full-width invisible hit target */}
                <line
                  x1={rawX1} y1={cy} x2={rawX2} y2={cy}
                  stroke="transparent" strokeWidth={16} strokeLinecap="butt"
                  style={{ cursor: 'pointer' }}
                  onPointerEnter={e => handleEnter(e, entry)}
                  onPointerMove={handleMove}
                  onPointerLeave={handleLeave}
                  onClick={() => onSelect?.(entry.id)}
                />
              </g>
            );
          })}

          {/* Year labels — only on the axis timeline */}
          {showAxis && YEARS.map(yr => (
            <text key={yr} x={tX(yr, svgW)} y={svgH - 6} textAnchor="middle" className={styles.yearLabel}>
              {yr}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default GitTimeline;
