export type ThemeId = 'portfolio' | 'vscode' | 'dracula' | 'nord' | 'gruvbox' | 'catppuccin';

export interface ThemeColors {
  typeGame: string;
  typeGameRgb: string;
  typeEngine: string;
  typeEngineRgb: string;
  typeSystem: string;
  typeSystemRgb: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  swatchBg: string;
  swatchAccent: string;
  colors: ThemeColors;
}

export const THEMES: Record<ThemeId, Theme> = {
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio Dark',
    swatchBg: '#0f172a',
    swatchAccent: '#38bdf8',
    colors: {
      typeGame:       '#a78bfa', typeGameRgb:   '167, 139, 250',
      typeEngine:     '#f0c060', typeEngineRgb: '240, 192, 96',
      typeSystem:     '#4ade80', typeSystemRgb: '74, 222, 128',
    },
  },
  vscode: {
    id: 'vscode',
    name: 'VS Code Dark+',
    swatchBg: '#1e1e1e',
    swatchAccent: '#569cd6',
    colors: {
      typeGame:       '#c586c0', typeGameRgb:   '197, 134, 192',
      typeEngine:     '#dcdcaa', typeEngineRgb: '220, 220, 170',
      typeSystem:     '#4ec9b0', typeSystemRgb: '78, 201, 176',
    },
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    swatchBg: '#282a36',
    swatchAccent: '#bd93f9',
    colors: {
      typeGame:       '#ff79c6', typeGameRgb:   '255, 121, 198',
      typeEngine:     '#f1fa8c', typeEngineRgb: '241, 250, 140',
      typeSystem:     '#50fa7b', typeSystemRgb: '80, 250, 123',
    },
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    swatchBg: '#2e3440',
    swatchAccent: '#88c0d0',
    colors: {
      typeGame:       '#b48ead', typeGameRgb:   '180, 142, 173',
      typeEngine:     '#ebcb8b', typeEngineRgb: '235, 203, 139',
      typeSystem:     '#a3be8c', typeSystemRgb: '163, 190, 140',
    },
  },
  gruvbox: {
    id: 'gruvbox',
    name: 'Gruvbox Dark',
    swatchBg: '#282828',
    swatchAccent: '#d79921',
    colors: {
      typeGame:       '#d3869b', typeGameRgb:   '211, 134, 155',
      typeEngine:     '#8ec07c', typeEngineRgb: '142, 192, 124',
      typeSystem:     '#b8bb26', typeSystemRgb: '184, 187, 38',
    },
  },
  catppuccin: {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    swatchBg: '#1e1e2e',
    swatchAccent: '#cba6f7',
    colors: {
      typeGame:       '#f38ba8', typeGameRgb:   '243, 139, 168',
      typeEngine:     '#fab387', typeEngineRgb: '250, 179, 135',
      typeSystem:     '#a6e3a1', typeSystemRgb: '166, 227, 161',
    },
  },
};

export const THEME_ORDER: ThemeId[] = ['portfolio', 'vscode', 'dracula', 'nord', 'gruvbox', 'catppuccin'];
