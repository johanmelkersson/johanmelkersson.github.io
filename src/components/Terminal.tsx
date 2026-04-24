import { useState, useEffect, useRef } from 'react';
import styles from './Terminal.module.css';

type LineType = 'input' | 'output' | 'error';

interface Line {
  type: LineType;
  text: string;
  onClick?: () => void;
}

const SEP = '─────────────────────────────────────';

const PROJECT_DETAILS: Record<string, string[]> = {
  'The Höör Reclamation Project': [
    'The Höör Reclamation Project',
    SEP,
    'Engine:   Unreal Engine 5.7',
    'Status:   In Development · 2024 →',
    'Team:     Johan Melkersson + Filip Orrling',
    '',
    'Systems:',
    '  [✓] AI Perception Pipeline',
    '  [✓] GAS Integration',
    '  [✓] Hex Grid & World Map',
    '  [✓] Animation Blueprints (ABP)',
    '  [✓] Save / Load',
    '  [~] Cover System          (in progress)',
    '  [ ] Weapon & Ammo expansion',
  ],
  'Successor': [
    'Successor',
    SEP,
    'Engine:   Unreal Engine',
    'Status:   Released · Oct 2025',
    'Context:  Playwood (Copenhagen)',
    'Role:     Gameplay & UI',
    'Tech:     C++, Unreal Engine, Meta Quest',
  ],
  'Ascend': [
    'Ascend',
    SEP,
    'Engine:   Crowsnest',
    'Status:   Released · Spring 2024',
    'Context:  The Game Assembly',
    'Role:     Player controller & physics',
    'Tech:     C++, Crowsnest, FMOD, PhysX',
  ],
  "Cruisin' 4A Bruisin'": [
    "Cruisin' 4A Bruisin'",
    SEP,
    'Engine:   Crowsnest',
    'Status:   Finished · Spring 2024',
    'Context:  The Game Assembly',
    'Role:     PhysX integration & UI',
    'Tech:     C++, Crowsnest, PhysX',
  ],
  'Spite — Ragnareld': [
    'Spite — Ragnareld',
    SEP,
    'Engine:   Crowsnest',
    'Status:   Finished · Fall 2023 – Spring 2024',
    'Context:  The Game Assembly',
    'Role:     Enemy AI',
    'Tech:     C++, Crowsnest',
  ],
  'USSnoíR': [
    'USSnoíR',
    SEP,
    'Engine:   Crowsnest',
    'Status:   Finished · Fall 2023',
    'Context:  The Game Assembly',
    'Role:     Player controller & movement',
    'Tech:     C++, Crowsnest',
  ],
  'Huntress': [
    'Huntress',
    SEP,
    'Engine:   TGE',
    'Status:   Finished · Fall 2023',
    'Context:  The Game Assembly',
    'Role:     Weapon controller',
    'Tech:     C++, TGE',
  ],
  'Novaturient': [
    'Novaturient',
    SEP,
    'Engine:   TGE',
    'Status:   Finished · Fall 2023',
    'Context:  The Game Assembly',
    'Role:     Environment, collisions & importer',
    'Tech:     C++, TGE',
  ],
  'Impfiltration': [
    'Impfiltration',
    SEP,
    'Engine:   Unity',
    'Status:   Finished · Spring 2023',
    'Context:  The Game Assembly',
    'Role:     Player input & control',
    'Tech:     C#, Unity',
  ],
  'Sootling Saga': [
    'Sootling Saga',
    SEP,
    'Engine:   Unity',
    'Status:   Finished · Fall 2022',
    'Context:  The Game Assembly',
    'Role:     Player controller & movement',
    'Tech:     C#, Unity',
  ],
  'Office Demons': [
    'Office Demons',
    SEP,
    'Engine:   Unity',
    'Status:   Finished · Fall 2021 – Spring 2022',
    'Context:  Malmö University',
    'Role:     Player controller & weapons',
    'Tech:     C#, Unity',
  ],
  'Fl!p': [
    'Fl!p',
    SEP,
    'Engine:   Unity',
    'Status:   Finished · Spring 2021',
    'Context:  Malmö University',
    'Role:     AI companion & parallax',
    'Tech:     C#, Unity',
  ],
  'Orbital Warden': [
    'Orbital Warden',
    SEP,
    'Engine:   Unity',
    'Status:   Archived · 2022',
    'Context:  Hobby',
    'Role:     Everything · personal project',
    'Tech:     C#, Unity',
  ],
  'SadDadMotors': [
    'SadDadMotors',
    SEP,
    'Engine:   C++',
    'Status:   Archived · 2023 – 2024',
    'Context:  Hobby · w/ Filip Orrling',
    'Role:     Co-developer · navmesh, engine systems',
    'Tech:     C++',
  ],
  'Weather Dashboard': [
    'Weather Dashboard',
    SEP,
    'Engine:   —',
    'Status:   Finished · Spring 2026',
    'Context:  Lexicon',
    'Role:     Everything',
    'Tech:     TypeScript, React, Vite',
  ],
};

const LS_PROJECTS: { tag: string; name: string; engine: string; type: string }[] = [
  { tag: '[IN DEV  ]', name: 'The Höör Reclamation Project', engine: 'Unreal Engine 5.7', type: 'Game Dev'   },
  { tag: '[RELEASED]', name: 'Successor',                    engine: 'Unreal Engine',     type: 'Game Dev'   },
  { tag: '[RELEASED]', name: 'Ascend',                       engine: 'Crowsnest',         type: 'Game Dev'   },
  { tag: '[FINISHED]', name: "Cruisin' 4A Bruisin'",         engine: 'Crowsnest',         type: 'Game Dev'   },
  { tag: '[FINISHED]', name: 'Spite — Ragnareld',            engine: 'Crowsnest',         type: 'Game Dev'   },
  { tag: '[FINISHED]', name: 'USSnoíR',                      engine: 'Crowsnest',         type: 'Game Dev'   },
  { tag: '[FINISHED]', name: 'Huntress',                     engine: 'TGE',               type: 'Game Dev'   },
  { tag: '[FINISHED]', name: 'Novaturient',                  engine: 'TGE',               type: 'Game Dev'   },
  { tag: '[FINISHED]', name: 'Impfiltration',                engine: 'Unity',             type: 'Game Dev'   },
  { tag: '[FINISHED]', name: 'Sootling Saga',                engine: 'Unity',             type: 'Game Dev'   },
  { tag: '[FINISHED]', name: 'Office Demons',                engine: 'Unity',             type: 'Game Dev'   },
  { tag: '[FINISHED]', name: 'Fl!p',                         engine: 'Unity',             type: 'Game Dev'   },
  { tag: '[ARCHIVED]', name: 'Orbital Warden',               engine: 'Unity',             type: 'Game Dev'   },
  { tag: '[ARCHIVED]', name: 'SadDadMotors',                 engine: 'C++',               type: 'Engine Dev' },
  { tag: '[FINISHED]', name: 'Weather Dashboard',            engine: 'TypeScript',        type: 'System Dev' },
];

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

  function showProjectDetail(name: string) {
    const details = PROJECT_DETAILS[name];
    if (!details) return;
    setLines(prev => [...prev, { type: 'input', text: name }]);
    addLines(details.map(t => ({ type: 'output' as LineType, text: t })));
  }

  function buildLsLines(): Line[] {
    const padName = (name: string) => name.padEnd(32, ' ');
    const padType = (type: string) => type.padEnd(10, ' ');
    const header: Line = { type: 'output', text: '/projects' };
    const rows: Line[] = LS_PROJECTS.map((p, i) => {
      const prefix = i === LS_PROJECTS.length - 1 ? '└── ' : '├── ';
      return {
        type: 'output' as LineType,
        text: `${prefix}${p.tag}  ${padName(p.name)}${padType(p.type)}  (${p.engine})`,
        onClick: () => showProjectDetail(p.name),
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
      addLines(PROJECT_DETAILS['The Höör Reclamation Project'].map(t => ({ type: 'output' as LineType, text: t })));
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
          <div className={styles.dots}>
            <button className={styles.dotRed}   onClick={() => setIsOpen(false)} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen}  />
          </div>
          <span className={styles.titleText}>johan@portfolio:~</span>
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
