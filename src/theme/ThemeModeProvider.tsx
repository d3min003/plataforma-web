import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { createAppTheme } from '@/theme/theme';

type Ctx = { mode: PaletteMode; toggle: () => void };
export const ThemeModeContext = React.createContext<Ctx>({ mode: 'light', toggle: () => {} });

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<PaletteMode>('light');

  React.useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('theme-mode') as PaletteMode | null) : null;
    if (saved === 'light' || saved === 'dark') setMode(saved);
  }, []);

  const toggle = React.useCallback(() => {
    setMode(m => {
      const next = m === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') localStorage.setItem('theme-mode', next);
      return next;
    });
  }, []);

  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
