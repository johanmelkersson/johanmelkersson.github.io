import type { ProjectStatus } from './projects';

export type ProjectCategory = 'educational' | 'professional' | 'hobby';
export type ProjectType = 'game' | 'system';

export interface TimelineEntry {
  id: number;
  year: number;
  period: string;
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
  system: 'System Dev',
};

export const TIMELINE_DATA: TimelineEntry[] = [
  { id: 10, year: 2021, period: 'Spring 2021',             title: 'Fl!p',                         contribution: 'AI companion & parallax',                                        engine: 'Unity',             category: 'educational',  categoryLabel: 'Malmö University',    type: 'game',   status: 'finished'        },
  { id: 12, year: 2021, period: '2021 – 2022',             title: 'Orbital Warden',               contribution: 'Everything · personal project',                                  engine: 'Unity',             category: 'hobby',                                              type: 'game',   status: 'archived'        },
  { id: 11, year: 2021, period: 'Fall 2021 – Spring 2022', title: 'Office Demons',                contribution: 'Player controller & weapons',                                    engine: 'Unity',             category: 'educational',  categoryLabel: 'Malmö University',    type: 'game',   status: 'finished'        },
  { id: 9,  year: 2022, period: 'Fall 2022',               title: 'Sootling Saga',                contribution: 'Player controller & movement',                                   engine: 'Unity',             category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 8,  year: 2023, period: 'Spring 2023',             title: 'Impfiltration',                contribution: 'Player input & control',                                         engine: 'Unity',             category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 14, year: 2023, period: '2023 – 2024',            title: 'SadDadMotors',                 contribution: 'Co-developer with Filip Orrling · C++, navmesh, engine systems',  engine: undefined,           category: 'hobby',                                              type: 'game',   status: 'archived'        },
  { id: 7,  year: 2023, period: 'Fall 2023',               title: 'Novaturient',                  contribution: 'Environment, collisions & importer',                             engine: 'TGE',               category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 6,  year: 2023, period: 'Fall 2023',               title: 'Huntress',                     contribution: 'Weapon controller',                                              engine: 'TGE',               category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 5,  year: 2023, period: 'Fall 2023',               title: 'USSnoíR',                      contribution: 'Player controller & movement',                                   engine: 'Crowsnest',         category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 4,  year: 2023, period: 'Fall 2023 – Spring 2024', title: 'Spite — Ragnareld',            contribution: 'Enemy AI',                                                       engine: 'Crowsnest',         category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 3,  year: 2024, period: 'Spring 2024',             title: "Cruisin' 4A Bruisin'",         contribution: 'PhysX integration & UI',                                         engine: 'Crowsnest',         category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'finished'        },
  { id: 2,  year: 2024, period: 'Spring 2024',             title: 'Ascend',                       contribution: 'Player controller & physics',                                    engine: 'Crowsnest',         category: 'educational',  categoryLabel: 'The Game Assembly',   type: 'game',   status: 'released'        },
  { id: 0,  year: 2024, period: '2024 →',                  title: 'The Höör Reclamation Project', contribution: 'Encounters, AI, GAS, Weapons, Animation, Save/Load, UI',          engine: 'Unreal Engine 5.7', category: 'hobby',                                              type: 'game',   status: 'in-development', ongoing: true },
  { id: 1,  year: 2024, period: '2024 → 2025',            title: 'Successor',                    contribution: 'Gameplay & UI',                                                  engine: 'Unreal Engine',     category: 'professional', categoryLabel: 'Playwood',            type: 'game',   status: 'released'        },
  { id: 13, year: 2026, period: 'Spring 2026',             title: 'Weather Dashboard',            contribution: 'Everything',                                                     engine: undefined,           category: 'educational',  categoryLabel: 'Lexicon',             type: 'system', status: 'finished'        },
];
