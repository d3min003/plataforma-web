import Link from 'next/link';
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Tooltip } from '@mui/material';
import { ReactNode, useContext } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ThemeModeContext } from '@/theme/ThemeModeProvider';

export default function Layout({ children }: { children: ReactNode }) {
  const { mode, toggle } = useContext(ThemeModeContext);
  return (
    <>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Plataforma Web
          </Typography>
          <Button color="inherit" component={Link} href="/">
            Inicio
          </Button>
          <Button color="inherit" component={Link} href="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} href="/leads">
            Leads
          </Button>
          <Button color="inherit" component={Link} href="/properties">
            Propiedades
          </Button>
          <Tooltip title={mode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
            <IconButton color="inherit" onClick={toggle} sx={{ ml: 1 }} aria-label="toggle theme">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box component="main" sx={{ py: 3 }}>
          {children}
        </Box>
      </Container>
    </>
  );
}
