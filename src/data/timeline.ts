export type ProjectCategory = 'university' | 'school' | 'professional' | 'hobby' | 'system';

export interface TimelineEntry {
  id: number;
  year: number;
  period: string;
  title: string;
  contribution: string;
  engine?: string;
  category: ProjectCategory;
  ongoing?: boolean;
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  university: 'University',
  school: 'The Game Assembly',
  professional: 'Professional',
  hobby: 'Hobby Project',
  system: 'System Dev',
};

export const TIMELINE_DATA: TimelineEntry[] = [
  { id: 10, year: 2021, period: 'Spring 2021',       title: 'Fl!p',                         contribution: 'AI companion & parallax',                                        engine: 'Unity',               category: 'university' },
  { id: 12, year: 2021, period: '2021',              title: 'Orbital Warden',               contribution: 'Everything · personal project',                                  engine: 'Unity',               category: 'hobby' },
  { id: 11, year: 2021, period: 'Fall 2021',         title: 'Office Demons',                contribution: 'Player controller & weapons',                                    engine: 'Unity',               category: 'university' },
  { id: 9,  year: 2022, period: 'Fall 2022',         title: 'Sootling Saga',                contribution: 'Player controller & movement',                                   engine: 'Unity',               category: 'school' },
  { id: 8,  year: 2023, period: 'Spring 2023',       title: 'Impfiltration',                contribution: 'Player input & control',                                         engine: 'Unity',               category: 'school' },
  { id: 7,  year: 2023, period: 'Fall 2023',         title: 'Novaturient',                  contribution: 'Environment, collisions & importer',                             engine: 'TGE',                 category: 'school' },
  { id: 6,  year: 2023, period: 'Fall 2023',         title: 'Huntress',                     contribution: 'Weapon controller',                                              engine: 'TGE',                 category: 'school' },
  { id: 14, year: 2023, period: '2023 → 2024',      title: 'SadDadMotors',                 contribution: 'Co-developer with Filip Orrling · C++, navmesh, engine systems',  engine: undefined,             category: 'hobby' },
  { id: 5,  year: 2024, period: 'Spring 2024',       title: 'USSnoíR',                      contribution: 'Player controller & movement',                                   engine: 'Crowsnest',        category: 'school' },
  { id: 4,  year: 2024, period: 'Spring 2024',       title: 'Spite — Ragnareld',            contribution: 'Enemy AI',                                                       engine: 'Crowsnest',        category: 'school' },
  { id: 3,  year: 2024, period: 'Spring 2024',       title: "Cruisin' 4A Bruisin'",         contribution: 'PhysX integration & UI',                                         engine: 'Crowsnest',        category: 'school' },
  { id: 2,  year: 2024, period: 'Spring 2024',       title: 'Ascend',                       contribution: 'Player controller & physics',                                    engine: 'Crowsnest',        category: 'school' },
  { id: 0,  year: 2024, period: '2024 →',        title: 'The Höör Reclamation Project', contribution: 'Encounters, AI, GAS, Weapons, Animation, Save/Load, UI',          engine: 'Unreal Engine 5.7',   category: 'hobby',  ongoing: true },
  { id: 1,  year: 2024, period: '2024 → 2025',   title: 'Successor',                    contribution: 'Gameplay & UI',                                                  engine: 'Unreal Engine',       category: 'professional' },
  { id: 13, year: 2026, period: 'Spring 2026',       title: 'Weather Dashboard',            contribution: 'Everything',                                                     engine: undefined,             category: 'system' },
];
