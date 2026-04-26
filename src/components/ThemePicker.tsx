import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { THEMES, THEME_ORDER } from '../themes/themes';
import styles from './ThemePicker.module.css';

export default function ThemePicker() {
  const { theme, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={styles.wrapper}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(p => !p)}
        title="Switch theme"
        aria-label="Switch theme"
      >
        <span
          className={styles.triggerSwatch}
          style={{ background: theme.swatchAccent }}
        />
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.panelLabel}>THEME</div>
          {THEME_ORDER.map(id => {
            const t = THEMES[id];
            return (
              <button
                key={id}
                className={`${styles.themeRow} ${id === theme.id ? styles.themeRowActive : ''}`}
                onClick={() => { setThemeId(id); setOpen(false); }}
              >
                <span className={styles.swatch}>
                  <span className={styles.swatchBg}  style={{ background: t.swatchBg }} />
                  <span className={styles.swatchDot} style={{ background: t.swatchAccent }} />
                </span>
                <span className={styles.themeName}>{t.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
