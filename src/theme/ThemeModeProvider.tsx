import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { createAppTheme } from './theme';

type ThemeModeContextValue = {
  mode: PaletteMode;
  toggle: () => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue>({ mode: 'light', toggle: () => {} });

type Props = { children: React.ReactNode };

export function ThemeModeProvider({ children }: Props) {
  // Respect system preference on first load
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  const [mode, setMode] = useState<PaletteMode>('light');

  // Initialize from localStorage or system preference
  useEffect(() => {
    const stored = (typeof window !== 'undefined' && (localStorage.getItem('theme-mode') as PaletteMode | null)) || null;
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    } else {
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, [systemPrefersDark]);

  const toggle = useCallback(() => {
    setMode((prev: PaletteMode) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') localStorage.setItem('theme-mode', next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default ThemeModeProvider;
