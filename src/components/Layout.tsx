import Link from 'next/link';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
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
          <Button color="inherit" component={Link} href="/leads">
            Leads
          </Button>
          <Button color="inherit" component={Link} href="/properties">
            Propiedades
          </Button>
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
