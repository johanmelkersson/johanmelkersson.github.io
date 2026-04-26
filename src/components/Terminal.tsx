import { useState, useEffect, useRef } from 'react';
import { TIMELINE_DATA, TYPE_LABELS, CATEGORY_LABELS } from '../data/timeline';
import type { TimelineEntry } from '../data/timeline';
import type { ProjectStatus } from '../data/projects';
import styles from './Terminal.module.css';

type LineType = 'input' | 'output' | 'error';

interface Line {
  type: LineType;
  text: string;
  onClick?: () => void;
}

const SEP = '─────────────────────────────────────';

// ── Terminal-specific extras (tech stack, systems checklist, team) ────────────
// Everything else is derived from TIMELINE_DATA automatically.

interface TerminalExtra {
  tech?: string;
  team?: string;
  contextSuffix?: string;
  systems?: string[];
}

const EXTRAS: Record<string, TerminalExtra> = {
  'The Höör Reclamation Project': {
    tech: 'C++ · Blueprints · GAS · EQS · Behavior Trees',
    team: 'Johan Melkersson + Filip Orrling',
    systems: [
      '[✓] AI Perception Pipeline',
      '[✓] GAS Integration',
      '[✓] Hex Grid & World Map',
      '[✓] Animation Blueprints (ABP)',
      '[✓] Save / Load',
      '[~] Cover System          (in progress)',
      '[ ] Weapon & Ammo expansion',
    ],
  },
  'Successor':              { tech: 'C++, Unreal Engine, Meta Quest' },
  'Ascend':                 { tech: 'C++, Crowsnest, FMOD, PhysX' },
  "Cruisin' 4A Bruisin'":  { tech: 'C++, Crowsnest, PhysX' },
  'Spite — Ragnareld':      { tech: 'C++, Crowsnest' },
  'USSnoíR':                { tech: 'C++, Crowsnest' },
  'Huntress':               { tech: 'C++, TGE' },
  'Novaturient':            { tech: 'C++, TGE' },
  'Impfiltration':          { tech: 'C#, Unity' },
  'Sootling Saga':          { tech: 'C#, Unity' },
  'Office Demons':          { tech: 'C#, Unity' },
  'Fl!p':                   { tech: 'C#, Unity' },
  'Orbital Warden':         { tech: 'C#, Unity' },
  'SadDadMotors':           { tech: 'C++', contextSuffix: ' · w/ Filip Orrling' },
  'Weather Dashboard':      { tech: 'TypeScript, React, Vite' },
  'Developer Portfolio':    { tech: 'TypeScript, React, Vite' },
};

// ── Derived data ──────────────────────────────────────────────────────────────

const STATUS_TAG: Record<ProjectStatus, string> = {
  'in-development': '[IN DEV  ]',
  'released':       '[RELEASED]',
  'finished':       '[FINISHED]',
  'archived':       '[ARCHIVED]',
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-development': 'In Development',
  'released':       'Released',
  'finished':       'Finished',
  'archived':       'Archived',
};

function getContext(e: TimelineEntry): string {
  const base = e.categoryLabel ?? (e.category === 'hobby' ? 'InHouse' : CATEGORY_LABELS[e.category]);
  return base + (EXTRAS[e.title]?.contextSuffix ?? '');
}

function getEngineLabel(e: TimelineEntry): string {
  if (e.engine) return e.engine;
  const tech = EXTRAS[e.title]?.tech;
  return tech ? tech.split(',')[0].trim() : '—';
}

function buildDetails(e: TimelineEntry): string[] {
  const extra = EXTRAS[e.title];
  const lines: string[] = [
    e.title,
    SEP,
    `Engine:   ${e.engine ?? '—'}`,
    `Status:   ${STATUS_LABEL[e.status]} · ${e.period}`,
    `Context:  ${getContext(e)}`,
    `Role:     ${e.contribution}`,
  ];
  if (extra?.team)   lines.push(`Team:     ${extra.team}`);
  if (extra?.tech)   lines.push(`Tech:     ${extra.tech}`);
  if (extra?.systems) {
    lines.push('');
    lines.push('Systems:');
    extra.systems.forEach(s => lines.push(`  ${s}`));
  }
  return lines;
}

const LS_PROJECTS = [...TIMELINE_DATA].sort((a, b) => {
  const aArchived = a.status === 'archived' ? 1 : 0;
  const bArchived = b.status === 'archived' ? 1 : 0;
  if (aArchived !== bArchived) return aArchived - bArchived;
  const aEnd = a.endDate ?? '9999-99';
  const bEnd = b.endDate ?? '9999-99';
  return bEnd.localeCompare(aEnd) || b.startDate.localeCompare(a.startDate);
});

// ── Static commands ───────────────────────────────────────────────────────────

const COMMANDS: Record<string, string[]> = {
  help: [
    'Available commands:',
    '  about      — who is this person',
    '  projects   — list all projects  (click a project for details)',
    '  status     — current project status',
    '  clear      — clear terminal',
    '  exit       — close terminal',
  ],
  about: [
    'Johan Melkersson',
    'Game Programmer & System Developer',
    'C++ · Unreal Engine · GAS · AI Systems',
    'Currently: The Höör Reclamation Project + Lexicon',
  ],
};

const WELCOME: Line[] = [
  { type: 'output', text: 'johan@portfolio:~$ — type "help" for commands' },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface TerminalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

function Terminal({ forceOpen, onClose }: TerminalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === '`' || e.key === '~' || e.key === '§') && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  useEffect(() => {
    if (!busy && isOpen) inputRef.current?.focus();
  }, [busy, isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  function addLines(newLines: Line[], delayMs = 45) {
    setBusy(true);
    newLines.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (i === newLines.length - 1) setBusy(false);
      }, i * delayMs);
    });
  }

  function showProjectDetail(entry: TimelineEntry) {
    setLines(prev => [...prev, { type: 'input', text: entry.title }]);
    addLines(buildDetails(entry).map(t => ({ type: 'output' as LineType, text: t })));
  }

  function buildLsLines(): Line[] {
    const padName = (name: string) => name.padEnd(32, ' ');
    const padType = (type: string) => type.padEnd(10, ' ');
    const header: Line = { type: 'output', text: '/projects' };
    const rows: Line[] = LS_PROJECTS.map((e, i) => {
      const prefix = i === LS_PROJECTS.length - 1 ? '└── ' : '├── ';
      return {
        type: 'output' as LineType,
        text: `${prefix}${STATUS_TAG[e.status]}  ${padName(e.title)}${padType(TYPE_LABELS[e.type])}  (${getEngineLabel(e)})`,
        onClick: () => showProjectDetail(e),
      };
    });
    return [header, ...rows];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const cmd = input.trim().toLowerCase();
    setInput('');

    setLines(prev => [...prev, { type: 'input', text: cmd }]);

    if (cmd === '') return;

    if (cmd === 'exit' || cmd === 'quit') {
      setIsOpen(false);
      onClose?.();
      return;
    }

    if (cmd === 'clear') {
      setLines(WELCOME);
      return;
    }

    if (cmd === 'projects') {
      addLines(buildLsLines());
      return;
    }

    if (cmd === 'status') {
      const current = LS_PROJECTS.find(e => e.ongoing) ?? LS_PROJECTS[0];
      addLines(buildDetails(current).map(t => ({ type: 'output' as LineType, text: t })));
      return;
    }

    if (COMMANDS[cmd]) {
      addLines(COMMANDS[cmd].map(t => ({ type: 'output' as LineType, text: t })));
      return;
    }

    addLines([{ type: 'error', text: `command not found: ${cmd}` }], 0);
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.window} onClick={e => e.stopPropagation()}>

        <div className={styles.titleBar}>
          <span className={styles.titleText}>johan@portfolio:~</span>
          <div className={styles.winControls}>
            <button className={styles.winBtn}>─</button>
            <button className={styles.winBtn}>□</button>
            <button className={`${styles.winBtn} ${styles.winClose}`} onClick={() => setIsOpen(false)}>✕</button>
          </div>
        </div>

        <div className={styles.body}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={`${styles.line} ${styles[line.type]} ${line.onClick ? styles.clickable : ''}`}
              onClick={line.onClick}
            >
              {line.type === 'input' && <span className={styles.prompt}>❯ </span>}
              <span>{line.text}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <span className={styles.prompt}>❯</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={busy}
            autoComplete="off"
            spellCheck={false}
            placeholder={busy ? '' : 'type a command...'}
          />
        </form>

      </div>
    </div>
  );
}

export default Terminal;
