import { useEffect, useState } from 'react';
import { ThemeMode } from '../types/radio';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('atomica_theme_mode') as ThemeMode | null;
      if (saved && ['auto', 'dark', 'light'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'auto';
  });

  const [resolvedDark, setResolvedDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolved = () => {
      const isSystemDark = mediaQuery.matches;
      let isDark = true;

      if (mode === 'dark') {
        isDark = true;
      } else if (mode === 'light') {
        isDark = false;
      } else {
        isDark = isSystemDark;
      }

      setResolvedDark(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    };

    updateResolved();

    const listener = () => {
      if (mode === 'auto') {
        updateResolved();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [mode]);

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    try {
      localStorage.setItem('atomica_theme_mode', newMode);
    } catch {
      // ignore
    }
  };

  return {
    mode,
    resolvedDark,
    setThemeMode,
  };
}
