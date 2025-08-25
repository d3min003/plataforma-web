import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#0ea5e9' }, // sky-500
      secondary: { main: '#6366f1' }, // indigo-500
      background: mode === 'light' ? { default: '#f8fafc' } : undefined,
    },
    typography: {
      fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    },
    shape: { borderRadius: 10 },
  });
}

// Tema por defecto (light) por si alguien lo importa directamente
const defaultTheme = createAppTheme('light');
export default defaultTheme;
