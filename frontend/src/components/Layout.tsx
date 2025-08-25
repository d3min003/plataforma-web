import * as React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Container, Box, Button, Stack } from '@mui/material';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component={Link} href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            CRM Inmobiliario
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} href="/leads">Leads</Button>
            <Button color="inherit" component={Link} href="/properties">Propiedades</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        {title && (
          <Box mb={2}>
            <Typography variant="h5">{title}</Typography>
          </Box>
        )}
        {children}
      </Container>
    </>
  );
}
 
