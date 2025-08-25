import Head from 'next/head';
import Layout from '@/components/Layout';
import { Container, Typography, Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Plataforma Web</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container disableGutters>
        <Typography variant="h4" sx={{ mb: 1 }}>Plataforma Web</Typography>
        <Typography sx={{ mb: 2 }}>Bienvenido. Esta es la base del proyecto Next.js + TypeScript.</Typography>
        <Paper>
          <List>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/api/health">
                <ListItemText primary="/api/health" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/api/leads">
                <ListItemText primary="/api/leads" />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Layout>
  );
}
