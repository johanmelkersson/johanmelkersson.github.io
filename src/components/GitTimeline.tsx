import { useState, useRef, useEffect, useMemo } from 'react';
import { TIMELINE_DATA, CATEGORY_LABELS, TYPE_LABELS } from '../data/timeline';
import type { ProjectCategory, ProjectType, TimelineEntry } from '../data/timeline';
import type { ProjectStatus } from '../data/projects';
import styles from './GitTimeline.module.css';

// ─── Date → numeric value (month precision) ──────────────────────────────────

const ONGOING_END = 2027.0;

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

const TIME_MIN  = 2021.0;   // Jan 2021
const TIME_MAX  = 2026.75;  // Oct 2026
const PAD_X     = 24;
const PAD_TOP   = 10;
const LANE_H    = 14;
const DOT_R     = 5;        // kept for pulse ring on ongoing projects
const PAD_BOT   = 24;       // year labels
const SEG_GAP   = 4;        // = border strokeWidth/2, matches outer rounded cap radius

const TYPE_COLOR: Record<ProjectType, string> = {
  game:   '#38bdf8',
  engine: '#f0c060',
  system: '#fb923c',
};

function tX(val: number, w: number) {
  return PAD_X + ((val - TIME_MIN) / (TIME_MAX - TIME_MIN)) * (w - 2 * PAD_X);
}
function lY(lane: number) {
  return PAD_TOP + lane * LANE_H;
}

// ─── SVG path helpers ────────────────────────────────────────────────────────

function vcurve(x: number, y1: number, y2: number) {
  const mid = (y1 + y2) / 2;
  return `M ${x},${y1} C ${x},${mid} ${x},${mid} ${x},${y2}`;
}
function hcurve(x1: number, x2: number, y1: number, y2: number) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return `M ${x1},${y1} C ${x1},${midY} ${x2},${midY} ${x2},${y2}`;
}

// ─── Build SVG paths ─────────────────────────────────────────────────────────

interface SvgPath {
  d: string;
  color: string;
  dashed?: boolean;
  opacity?: number;
}

function buildPaths(entries: PositionedEntry[], w: number): SvgPath[] {
  const byLane = new Map<number, PositionedEntry[]>();
  entries.forEach(e => {
    if (!byLane.has(e.lane)) byLane.set(e.lane, []);
    byLane.get(e.lane)!.push(e);
  });
  byLane.forEach(arr => arr.sort((a, b) => a.startVal - b.startVal));

  const paths: SvgPath[] = [];
  const TRUNK = 'rgba(255,255,255,0.1)';

  byLane.forEach((laneEntries, lane) => {
    const y     = lY(lane);
    const yMain = lY(0);
    const first = laneEntries[0];
    const last  = laneEntries[laneEntries.length - 1];
    const color = lane === 0 ? TRUNK : TYPE_COLOR[first.type];

    // Segments between consecutive dots on this lane
    for (let i = 1; i < laneEntries.length; i++) {
      const x1 = tX(laneEntries[i - 1].startVal, w);
      const x2 = tX(laneEntries[i].startVal, w);
      paths.push({ d: `M ${x1},${y} L ${x2},${y}`, color, opacity: lane === 0 ? 1 : 0.6 });
    }

    if (lane > 0) {
      const xLast = tX(last.startVal, w);

      if (last.ongoing) {
        paths.push({ d: `M ${xLast},${y} L ${w - PAD_X},${y}`, color, dashed: true, opacity: 0.5 });
      } else {
        const xEnd = Math.min(tX(last.endVal, w), w - PAD_X);
        if (xEnd > xLast + 4) {
          paths.push({ d: `M ${xLast},${y} L ${xEnd},${y}`, color, opacity: 0.4 });
        }
      }
    } else {
      // Extend trunk past last dot if ongoing branches remain
      if (!last.ongoing) {
        const hasOngoing = entries.some(e => e.ongoing);
        if (hasOngoing) {
          paths.push({ d: `M ${tX(last.startVal, w)},${yMain} L ${w - PAD_X},${yMain}`, color: TRUNK, dashed: true, opacity: 0.4 });
        }
      }
    }
  });

  return paths;
}

// ─── Label & status maps ─────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

const TOOLTIP_W = 220;

interface GitTimelineProps {
  category?: ProjectCategory;
  showAxis?: boolean;
  highlightId?: number;
  forcedTooltipId?: number;
  onHoverChange?: (id: number | null) => void;
  activeIds?: Set<number>;
  singleLane?: boolean;
}

const HOVER_DELAY = 500;

function GitTimeline({ category, showAxis = false, highlightId, forcedTooltipId, onHoverChange, activeIds, singleLane = false }: GitTimelineProps) {
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
  const paths    = useMemo(() => buildPaths(entries, svgW), [entries, svgW]);
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

  const YEARS = svgW < 480
    ? [2021, 2023, 2025, 2027]
    : [2021, 2022, 2023, 2024, 2025, 2026, 2027];

  function handleEnter(e: React.MouseEvent<SVGLineElement>, entry: PositionedEntry) {
    const wrapperRect = wrapperRef.current!.getBoundingClientRect();
    const x = e.clientX - wrapperRect.left;
    onHoverChange?.(entry.id);
    hoverTimerRef.current = setTimeout(() => setTooltip({ entry, x }), HOVER_DELAY);
  }

  function handleLeave() {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setTooltip(null);
    onHoverChange?.(null);
  }

  function handleMove(e: React.MouseEvent<SVGLineElement>) {
    if (!tooltip) return;
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
        <div className={styles.tooltip} style={{ left: tipLeft(displayTooltip.x) }}>
          <div className={styles.arrow} style={{ left: arrowLeft(displayTooltip.x) }} />
          <div className={styles.tipTitle}>{displayTooltip.entry.title}</div>
          <div className={styles.tipMeta}>
            <span className={`${styles.statusBadge} ${styles[`status-${displayTooltip.entry.status}`]}`}>
              {STATUS_LABEL[displayTooltip.entry.status]}
            </span>
            <span className={styles.typeBadge}>{TYPE_LABELS[displayTooltip.entry.type]}</span>
          </div>
          <div className={styles.tipPeriod}>{displayTooltip.entry.period}</div>
          {displayTooltip.entry.engine && <div className={styles.tipEngine}>{displayTooltip.entry.engine}</div>}
          <div className={styles.tipContribution}>{displayTooltip.entry.contribution}</div>
          <div className={`${styles.tipCategory} ${styles[CATEGORY_CLASS[displayTooltip.entry.category]]}`}>
            {displayTooltip.entry.categoryLabel ?? CATEGORY_LABELS[displayTooltip.entry.category]}
          </div>
        </div>
      )}

      <div className={styles.scroll}>
        <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" className={styles.svg}>
          {/* Lines */}
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              stroke={p.color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={p.dashed ? '4 4' : undefined}
              fill="none"
              opacity={p.opacity ?? 1}
            />
          ))}

          {/* Per-project segments — always visible, glow on hover */}
          {entries.map(entry => {
            const rawX1   = tX(entry.startVal, svgW);
            const rawX2   = entry.ongoing ? svgW - PAD_X : Math.min(tX(entry.endVal, svgW), svgW - PAD_X);
            const visX1   = rawX1 + SEG_GAP;
            const visX2   = Math.max(visX1 + 2, rawX2 - SEG_GAP); // at least 2px wide
            const cy      = lY(entry.lane);
            const color    = TYPE_COLOR[entry.type];
            const hovered  = displayTooltip?.entry.id === entry.id || highlightId === entry.id;
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
                  stroke="#0f172a"
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
                  onMouseEnter={e => handleEnter(e, entry)}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
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
