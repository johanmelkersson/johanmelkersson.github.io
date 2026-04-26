import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme, ThemeId } from '../themes/themes';
import { THEMES } from '../themes/themes';

interface ThemeCtx {
  theme: Theme;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: THEMES.portfolio,
  setThemeId: () => {},
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty('--type-game',        c.typeGame);
  root.style.setProperty('--type-game-rgb',    c.typeGameRgb);
  root.style.setProperty('--type-engine',      c.typeEngine);
  root.style.setProperty('--type-engine-rgb',  c.typeEngineRgb);
  root.style.setProperty('--type-system',      c.typeSystem);
  root.style.setProperty('--type-system-rgb',  c.typeSystemRgb);
  root.setAttribute('data-theme', theme.id);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('portfolio-theme') as ThemeId | null;
    return saved && THEMES[saved] ? saved : 'portfolio';
  });

  const theme = THEMES[themeId];

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('portfolio-theme', themeId);
  }, [theme, themeId]);

  function setThemeId(id: ThemeId) {
    setThemeIdState(id);
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
