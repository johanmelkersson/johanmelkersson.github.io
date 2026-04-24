import type { ProjectStatus } from './projects';

export type ProjectCategory = 'educational' | 'professional' | 'hobby';
export type ProjectType = 'game' | 'engine' | 'system';

export interface TimelineEntry {
  id: number;
  year: number;
  period: string;       // human-readable, shown in tooltip
  startDate: string;    // YYYY-MM, used for positioning
  endDate?: string;     // YYYY-MM, absent = ongoing
  title: string;
  contribution: string;
  engine?: string;
  category: ProjectCategory;
  categoryLabel?: string;
  type: ProjectType;
  status: ProjectStatus;
  ongoing?: boolean;
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  educational:  'Educational',
  professional: 'Professional',
  hobby:        'Hobby',
};

export const TYPE_LABELS: Record<ProjectType, string> = {
  game:   'Game Dev',
  engine: 'Engine Dev',
  system: 'System Dev',
};

export const TIMELINE_DATA: TimelineEntry[] = [
  { id: 10, year: 2021, period: 'Apr – May 2021',       startDate: '2021-04', endDate: '2021-05', title: 'Fl!p',                         contribution: 'AI companion & parallax',                                        engine: 'Unity',             category: 'educational',  categoryLabel: 'Malmö University',    type: 'game',   status: 'finished'        },
  { id: 12, year: 2021, period: 'Aug 2021 – Feb 2022',  startDate: '2021-08', endDate: '2022-02', title: 'Orbital Warden',               contribution: 'Everything · personal project',                                  engine: 'Unity',             category: 'hobby',                                              type: 'game',   status: 'archived'        },
  { id: 11, year: 2021, period: 'Sep 2021 – Feb 2022',  startDate: '2021-09', endDate: '2022-02', title: 'Office Demons',                contribution: 'Player controller & weapons',                                    engine: 'Unity',             category: 'educational',  categoryLabel: 'Malmö University',    type: 'game',   status: 'finished'        },
  { id: 9,  year: 2022, period: 'Oct – Dec 2022',       startDate: '2022-10', endDate: '2022-12', title: 'Sootling Saga',                contribution: 'Player controller & movement',                                   engine: 'Unity',             category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 8,  year: 2023, period: 'Feb – Jun 2023',       startDate: '2023-02', endDate: '2023-06', title: 'Impfiltration',                contribution: 'Player input & control',                                         engine: 'Unity',             category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 14, year: 2023, period: 'Jul 2023 – May 2024',  startDate: '2023-07', endDate: '2024-05', title: 'SadDadMotors',                 contribution: 'Co-developer with Filip Orrling · C++, navmesh, engine systems',  engine: undefined,           category: 'hobby',                                              type: 'engine', status: 'archived'        },
  { id: 7,  year: 2023, period: 'Sep 2023',             startDate: '2023-09', endDate: '2023-09', title: 'Novaturient',                  contribution: 'Environment, collisions & importer',                             engine: 'TGE',               category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 6,  year: 2023, period: 'Oct 2023',             startDate: '2023-10', endDate: '2023-10', title: 'Huntress',                     contribution: 'Weapon controller',                                              engine: 'TGE',               category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 5,  year: 2023, period: 'Nov 2023',             startDate: '2023-11', endDate: '2023-11', title: 'USSnoíR',                      contribution: 'Player controller & movement',                                   engine: 'Crowsnest',         category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 4,  year: 2023, period: 'Dec 2023 – Jan 2024',  startDate: '2023-12', endDate: '2024-01', title: 'Spite — Ragnareld',            contribution: 'Enemy AI',                                                       engine: 'Crowsnest',         category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 3,  year: 2024, period: 'Feb – Mar 2024',       startDate: '2024-02', endDate: '2024-03', title: "Cruisin' 4A Bruisin'",         contribution: 'PhysX integration & UI',                                         engine: 'Crowsnest',         category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 2,  year: 2024, period: 'Apr – Jun 2024',       startDate: '2024-04', endDate: '2024-06', title: 'Ascend',                       contribution: 'Player controller & physics',                                    engine: 'Crowsnest',         category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'released'        },
  { id: 1,  year: 2024, period: 'Jun 2024 – Mar 2025',  startDate: '2024-06', endDate: '2025-03', title: 'Successor',                    contribution: 'Gameplay & UI',                                                  engine: 'Unreal Engine',     category: 'professional', categoryLabel: 'Playwood',            type: 'game',   status: 'released'        },
  { id: 0,  year: 2024, period: 'Sep 2024 →',           startDate: '2024-09',                     title: 'The Höör Reclamation Project', contribution: 'Encounters, AI, GAS, Weapons, Animation, Save/Load, UI',          engine: 'Unreal Engine 5.7', category: 'hobby',                                              type: 'game',   status: 'in-development', ongoing: true },
  { id: 13, year: 2026, period: 'Apr 2026',             startDate: '2026-04', endDate: '2026-04', title: 'Weather Dashboard',            contribution: 'Everything',                                                     engine: undefined,           category: 'educational',  categoryLabel: 'Lexicon',             type: 'system', status: 'finished'        },
];
