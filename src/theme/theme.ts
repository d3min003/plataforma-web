import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9' }, // sky-500
    secondary: { main: '#6366f1' }, // indigo-500
    background: { default: '#f8fafc' },
  },
  typography: {
    fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
  },
  shape: { borderRadius: 10 },
});

export default theme;
